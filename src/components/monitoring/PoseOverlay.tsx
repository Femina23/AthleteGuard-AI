import { useRef, useEffect, useMemo } from 'react';
import type { Landmark } from '../../types';
import { POSE_CONNECTIONS, LANDMARK_NAMES } from '../../types';
import { drawLandmarksOnCanvas, drawAngleOnCanvas } from '../../utils/camera';
import { getJointAngles } from '../../utils/calculations';

interface PoseOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  landmarks: Landmark[];
  sport: 'strength' | 'running' | 'basketball';
  showSkeleton: boolean;
  showAngles: boolean;
  showConfidence: boolean;
  mirror?: boolean;
}

export function PoseOverlay({
  videoRef,
  landmarks,
  sport,
  showSkeleton,
  showAngles,
  showConfidence,
  mirror = true,
}: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const angleData = useMemo(() => {
    if (!showAngles || landmarks.length === 0) return [];
    const angles = getJointAngles(landmarks, sport);
    return angles.map(a => ({
      joint: a.joint.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      angle: a.angle,
      landmarks: getLandmarkIndicesForJoint(a.joint),
      confidence: a.confidence,
    }));
  }, [landmarks, sport, showAngles]);

  function getLandmarkIndicesForJoint(joint: string): [number, number, number] {
    const jointMap: Record<string, [number, number, number]> = {
      left_knee: [23, 25, 27],
      right_knee: [24, 26, 28],
      left_hip: [11, 23, 25],
      right_hip: [12, 24, 26],
      left_ankle: [25, 27, 29],
      right_ankle: [26, 28, 30],
    };
    return jointMap[joint] || [0, 0, 0];
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
      }
    };

    const draw = () => {
      if (!video || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      resizeCanvas();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mirror) {
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      if (showSkeleton && landmarks.length > 0) {
        drawLandmarksOnCanvas(ctx, landmarks, POSE_CONNECTIONS, canvas.width, canvas.height, {
          showSkeleton: true,
          showPoints: true,
          pointColor: '#00b8d4',
          lineColor: '#00b8d4',
          pointRadius: 4,
          lineWidth: 2,
          minVisibility: 0.5,
        });
      }

      if (showAngles && angleData.length > 0) {
        drawAngleOnCanvas(ctx, landmarks, angleData, canvas.width, canvas.height);
      }

      if (mirror) {
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [landmarks, showSkeleton, showAngles, angleData, mirror, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
