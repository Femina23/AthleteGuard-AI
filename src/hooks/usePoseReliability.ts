import { useState, useEffect, useRef, useMemo } from 'react';
import type { Landmark, SportType } from '../types';

export type TrackingStatus = 
  | 'initializing'
  | 'camera_permission'
  | 'no_person'
  | 'partially_visible'
  | 'ready';

export interface PoseReliabilityResult {
  status: TrackingStatus;
  statusLabel: string;
  setupHint: string;
  isReliable: boolean;
  averageConfidence: number;
  missingLandmarks: string[];
}

interface UsePoseReliabilityOptions {
  landmarks: Landmark[];
  sport: SportType | null;
  cameraActive: boolean;
  cameraLoading: boolean;
  cameraError: string | null;
  detectorLoading: boolean;
  detectorError: string | null;
}

export function usePoseReliability({
  landmarks,
  sport,
  cameraActive,
  cameraLoading,
  cameraError,
  detectorLoading,
  detectorError,
}: UsePoseReliabilityOptions): PoseReliabilityResult {
  // Determine raw status from current frame
  const { rawStatus, missingList, avgConf } = useMemo(() => {
    // 1. Initializing pose detector
    if (detectorLoading) {
      return { rawStatus: 'initializing' as TrackingStatus, missingList: [], avgConf: 0 };
    }

    // 2. Camera permission required
    if (cameraError || (!cameraActive && !cameraLoading)) {
      return { rawStatus: 'camera_permission' as TrackingStatus, missingList: [], avgConf: 0 };
    }

    // Camera is active and detector is ready, check landmarks
    if (!landmarks || landmarks.length === 0) {
      return { rawStatus: 'no_person' as TrackingStatus, missingList: ['Full Body'], avgConf: 0 };
    }

    // Check visibility & presence of key landmarks
    // MediaPipe landmark indices:
    // 11, 12: shoulders
    // 23, 24: hips
    // 25, 26: knees
    // 27, 28: ankles
    const lShoulder = landmarks[11];
    const rShoulder = landmarks[12];
    const lHip = landmarks[23];
    const rHip = landmarks[24];
    const lKnee = landmarks[25];
    const rKnee = landmarks[26];
    const lAnkle = landmarks[27];
    const rAnkle = landmarks[28];

    const isVis = (lm: Landmark | undefined, threshold = 0.5) => {
      if (!lm) return false;
      const v = typeof lm.visibility === 'number' ? lm.visibility : 0;
      // Also ensure it is not cut off outside frame borders
      const inBounds = lm.x >= 0.01 && lm.x <= 0.99 && lm.y >= 0.01 && lm.y <= 0.99;
      return v >= threshold && inBounds;
    };

    const missing: string[] = [];

    const shouldersVisible = isVis(lShoulder, 0.4) || isVis(rShoulder, 0.4);
    const hipsVisible = isVis(lHip, 0.45) || isVis(rHip, 0.45);
    const kneesVisible = isVis(lKnee, 0.45) || isVis(rKnee, 0.45);
    const anklesVisible = isVis(lAnkle, 0.4) || isVis(rAnkle, 0.4);

    if (!shouldersVisible) missing.push('Shoulders / Upper Torso');
    if (!hipsVisible) missing.push('Hips / Core');
    if (!kneesVisible) missing.push('Knees');
    if (!anklesVisible) missing.push('Ankles / Feet');

    // Calculate average confidence for key landmarks
    const keyIndices = [11, 12, 23, 24, 25, 26, 27, 28];
    const confs = keyIndices
      .map(i => landmarks[i]?.visibility ?? 0)
      .filter(v => v > 0);
    const average = confs.length > 0 
      ? Math.round((confs.reduce((a, b) => a + b, 0) / confs.length) * 100)
      : 0;

    // Check if reliable based on sport requirements
    let reliable = false;
    if (sport === 'strength') {
      // Squat form requires hips, knees, and ankles for depth & angles
      reliable = hipsVisible && kneesVisible && (anklesVisible || shouldersVisible) && missing.length <= 1;
    } else if (sport === 'running') {
      // Running requires hips, knees, and lower legs
      reliable = hipsVisible && kneesVisible && anklesVisible;
    } else if (sport === 'basketball') {
      // Basketball requires full body
      reliable = shouldersVisible && hipsVisible && kneesVisible && anklesVisible;
    } else {
      reliable = hipsVisible && kneesVisible;
    }

    if (reliable && average >= 45) {
      return { rawStatus: 'ready' as TrackingStatus, missingList: [], avgConf: average };
    } else {
      return { rawStatus: 'partially_visible' as TrackingStatus, missingList: missing, avgConf: average };
    }
  }, [landmarks, sport, cameraActive, cameraLoading, cameraError, detectorLoading]);

  // Anti-flicker confirmation state
  const [confirmedStatus, setConfirmedStatus] = useState<TrackingStatus>(rawStatus);
  const candidateStatusRef = useRef<TrackingStatus>(rawStatus);
  const candidateTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Immediate transitions for unrecoverable or setup events
    if (rawStatus === 'initializing' || rawStatus === 'camera_permission') {
      candidateStatusRef.current = rawStatus;
      setConfirmedStatus(rawStatus);
      return;
    }

    const now = Date.now();
    if (candidateStatusRef.current !== rawStatus) {
      // New candidate status started
      candidateStatusRef.current = rawStatus;
      candidateTimeRef.current = now;
    }

    // Check confirmation timer
    const elapsed = now - candidateTimeRef.current;
    // To switch into ready: require 250ms stability
    // To switch into partial: require 320ms stability (prevents jitter when doing fast movements)
    // To switch into no_person: require 350ms stability (prevents single-frame dropouts)
    const requiredTime = rawStatus === 'ready' ? 250 : rawStatus === 'no_person' ? 350 : 320;

    if (elapsed >= requiredTime) {
      setConfirmedStatus(rawStatus);
    } else {
      const timer = setTimeout(() => {
        if (candidateStatusRef.current === rawStatus) {
          setConfirmedStatus(rawStatus);
        }
      }, requiredTime - elapsed);
      return () => clearTimeout(timer);
    }
  }, [rawStatus]);

  // Status Labels (Requirement 3: exact labels)
  const statusLabel = useMemo(() => {
    switch (confirmedStatus) {
      case 'initializing':
        return 'Initializing pose detector';
      case 'camera_permission':
        return 'Camera permission required';
      case 'no_person':
        return 'No person detected';
      case 'partially_visible':
        return 'Person partially visible';
      case 'ready':
        return 'Pose detected and ready';
    }
  }, [confirmedStatus]);

  // Setup Hints (Requirement 5)
  const setupHint = useMemo(() => {
    switch (confirmedStatus) {
      case 'initializing':
        return 'Preparing MediaPipe AI vision models in your browser...';
      case 'camera_permission':
        return 'Please allow camera access in your browser to begin monitoring.';
      case 'no_person':
        return 'Step into the camera frame with your full body visible.';
      case 'partially_visible':
        if (missingList.includes('Ankles / Feet') || missingList.includes('Knees')) {
          return 'Step back so your hips, knees, and feet are visible in frame.';
        }
        if (missingList.includes('Shoulders / Upper Torso')) {
          return 'Adjust camera angle so your upper body and chest are in view.';
        }
        return 'Position yourself so your full body from shoulders to feet is inside the frame.';
      case 'ready':
        return 'Full body tracked reliably. Ready for workout analysis!';
    }
  }, [confirmedStatus, missingList]);

  return {
    status: confirmedStatus,
    statusLabel,
    setupHint,
    isReliable: confirmedStatus === 'ready',
    averageConfidence: avgConf,
    missingLandmarks: missingList,
  };
}
