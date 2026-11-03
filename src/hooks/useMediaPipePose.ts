import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { PoseResult, Landmark } from '../types';
import { MEDIAPIPE_MODEL_URL, CONFIDENCE_THRESHOLD } from '../constants';

interface UseMediaPipePoseOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  onResults?: (results: PoseResult) => void;
}

interface UseMediaPipePoseReturn {
  poseLandmarker: PoseLandmarker | null;
  isLoading: boolean;
  error: string | null;
  lastResults: PoseResult | null;
  fps: number;
}

export function useMediaPipePose({
  videoRef,
  enabled,
  onResults,
}: UseMediaPipePoseOptions): UseMediaPipePoseReturn {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<PoseResult | null>(null);
  const [fps, setFps] = useState(0);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initializePoseLandmarker() {
      try {
        setIsLoading(true);
        setError(null);

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MEDIAPIPE_MODEL_URL,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: CONFIDENCE_THRESHOLD,
          minPosePresenceConfidence: CONFIDENCE_THRESHOLD,
          minTrackingConfidence: CONFIDENCE_THRESHOLD,
          outputSegmentationMasks: false,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        poseLandmarkerRef.current = landmarker;
        setPoseLandmarker(landmarker);
        setIsLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to initialize pose detection');
          setIsLoading(false);
        }
      }
    }

    initializePoseLandmarker();

    return () => {
      cancelled = true;
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
        poseLandmarkerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const detectPose = useCallback(async () => {
    const video = videoRef.current;
    const landmarker = poseLandmarkerRef.current;

    if (!video || !landmarker || !enabled || video.readyState < 2) {
      if (enabled) {
        animationFrameRef.current = requestAnimationFrame(detectPose);
      }
      return;
    }

    try {
      const startTime = performance.now();
      const results = landmarker.detectForVideo(video, startTime);

      const landmarks: Landmark[] = results.landmarks[0]?.map((lm, i) => ({
        x: lm.x,
        y: lm.y,
        z: lm.z,
        visibility: (lm as any).visibility ?? 1,
        name: `landmark_${i}`,
      })) || [];

      const poseResult: PoseResult = {
        landmarks,
        worldLandmarks: results.worldLandmarks[0]?.map(lm => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
          visibility: 1,
          name: `world_${lm}`,
        })),
        timestamp: startTime,
      };

      setLastResults(poseResult);
      onResults?.(poseResult);

      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
    } catch (err) {
      console.error('Pose detection error:', err);
    }

    animationFrameRef.current = requestAnimationFrame(detectPose);
  }, [videoRef, enabled, onResults]);

  useEffect(() => {
    if (enabled && poseLandmarker) {
      animationFrameRef.current = requestAnimationFrame(detectPose);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, poseLandmarker, detectPose]);

  return {
    poseLandmarker,
    isLoading,
    error,
    lastResults,
    fps,
  };
}
