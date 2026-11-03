import type { Landmark, JointAngle, MovementFlag } from '../types';
import { ANGLE_THRESHOLDS, CONFIDENCE_THRESHOLD, VISIBILITY_THRESHOLD } from '../constants';

export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const dotProduct = ba.x * bc.x + ba.y * bc.y;
  const magnitudeBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y);
  const magnitudeBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);

  if (magnitudeBA === 0 || magnitudeBC === 0) return 0;

  const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  const angle = Math.acos(clampedCos) * (180 / Math.PI);

  return angle;
}

export function calculate3DAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const ba = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const bc = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dotProduct = ba.x * bc.x + ba.y * bc.y + ba.z * bc.z;
  const magnitudeBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y + ba.z * ba.z);
  const magnitudeBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z);

  if (magnitudeBA === 0 || magnitudeBC === 0) return 0;

  const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  const angle = Math.acos(clampedCos) * (180 / Math.PI);

  return angle;
}

export function getLandmarkConfidence(landmarks: Landmark[], indices: number[]): number {
  const confidences = indices
    .map(i => landmarks[i]?.visibility ?? 0)
    .filter(v => v > 0);
  
  if (confidences.length === 0) return 0;
  return confidences.reduce((sum, v) => sum + v, 0) / confidences.length;
}

export function isLandmarkVisible(landmark: Landmark | undefined): boolean {
  return landmark !== undefined && landmark.visibility >= VISIBILITY_THRESHOLD;
}

export function getJointAngles(landmarks: Landmark[], sport: 'strength' | 'running' | 'basketball'): JointAngle[] {
  const angles: JointAngle[] = [];

  if (sport === 'strength' || sport === 'basketball') {
    if (isLandmarkVisible(landmarks[23]) && isLandmarkVisible(landmarks[25]) && isLandmarkVisible(landmarks[27])) {
      const angle = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
      const confidence = getLandmarkConfidence(landmarks, [23, 25, 27]);
      angles.push({ joint: 'left_knee', angle, confidence });
    }

    if (isLandmarkVisible(landmarks[24]) && isLandmarkVisible(landmarks[26]) && isLandmarkVisible(landmarks[28])) {
      const angle = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
      const confidence = getLandmarkConfidence(landmarks, [24, 26, 28]);
      angles.push({ joint: 'right_knee', angle, confidence });
    }

    if (isLandmarkVisible(landmarks[11]) && isLandmarkVisible(landmarks[23]) && isLandmarkVisible(landmarks[25])) {
      const angle = calculateAngle(landmarks[11], landmarks[23], landmarks[25]);
      const confidence = getLandmarkConfidence(landmarks, [11, 23, 25]);
      angles.push({ joint: 'left_hip', angle, confidence });
    }

    if (isLandmarkVisible(landmarks[12]) && isLandmarkVisible(landmarks[24]) && isLandmarkVisible(landmarks[26])) {
      const angle = calculateAngle(landmarks[12], landmarks[24], landmarks[26]);
      const confidence = getLandmarkConfidence(landmarks, [12, 24, 26]);
      angles.push({ joint: 'right_hip', angle, confidence });
    }
  }

  if (sport === 'running') {
    if (isLandmarkVisible(landmarks[25]) && isLandmarkVisible(landmarks[27]) && isLandmarkVisible(landmarks[29])) {
      const angle = calculateAngle(landmarks[25], landmarks[27], landmarks[29]);
      const confidence = getLandmarkConfidence(landmarks, [25, 27, 29]);
      angles.push({ joint: 'left_ankle', angle, confidence });
    }

    if (isLandmarkVisible(landmarks[26]) && isLandmarkVisible(landmarks[28]) && isLandmarkVisible(landmarks[30])) {
      const angle = calculateAngle(landmarks[26], landmarks[28], landmarks[30]);
      const confidence = getLandmarkConfidence(landmarks, [26, 28, 30]);
      angles.push({ joint: 'right_ankle', angle, confidence });
    }
  }

  return angles;
}

export function calculateForwardLean(landmarks: Landmark[]): number | null {
  if (!isLandmarkVisible(landmarks[11]) || !isLandmarkVisible(landmarks[12]) || 
      !isLandmarkVisible(landmarks[23]) || !isLandmarkVisible(landmarks[24])) {
    return null;
  }

  const shoulderMidX = (landmarks[11].x + landmarks[12].x) / 2;
  const hipMidX = (landmarks[23].x + landmarks[24].x) / 2;
  const shoulderMidY = (landmarks[11].y + landmarks[12].y) / 2;
  const hipMidY = (landmarks[23].y + landmarks[24].y) / 2;

  const dx = shoulderMidX - hipMidX;
  const dy = shoulderMidY - hipMidY;

  if (dy === 0) return 0;

  const angle = Math.atan2(Math.abs(dx), Math.abs(dy)) * (180 / Math.PI);
  return angle;
}

export function calculateSymmetry(landmarks: Landmark[]): number | null {
  const leftKnee = isLandmarkVisible(landmarks[25]) && isLandmarkVisible(landmarks[23]) && isLandmarkVisible(landmarks[27])
    ? calculateAngle(landmarks[23], landmarks[25], landmarks[27])
    : null;
  
  const rightKnee = isLandmarkVisible(landmarks[26]) && isLandmarkVisible(landmarks[24]) && isLandmarkVisible(landmarks[28])
    ? calculateAngle(landmarks[24], landmarks[26], landmarks[28])
    : null;

  if (leftKnee === null || rightKnee === null) return null;

  return Math.abs(leftKnee - rightKnee);
}

export function analyzeSquatForm(angles: JointAngle[], forwardLean: number | null, symmetry: number | null): MovementFlag[] {
  const flags: MovementFlag[] = [];
  const timestamp = Date.now();

  const leftKnee = angles.find(a => a.joint === 'left_knee');
  const rightKnee = angles.find(a => a.joint === 'right_knee');
  const leftHip = angles.find(a => a.joint === 'left_hip');
  const rightHip = angles.find(a => a.joint === 'right_hip');

  const avgKneeAngle = leftKnee && rightKnee ? (leftKnee.angle + rightKnee.angle) / 2 : leftKnee?.angle ?? rightKnee?.angle ?? null;
  const avgHipAngle = leftHip && rightHip ? (leftHip.angle + rightHip.angle) / 2 : leftHip?.angle ?? rightHip?.angle ?? null;

  if (avgKneeAngle !== null && avgKneeAngle < ANGLE_THRESHOLDS.squat.kneeAngleDeep) {
    flags.push({
      id: `squat-deep-${timestamp}`,
      type: 'info',
      category: 'Depth',
      message: 'Good squach depth achieved',
      joint: 'knee',
      angle: avgKneeAngle,
      threshold: ANGLE_THRESHOLDS.squat.kneeAngleDeep,
      timestamp,
    });
  }

  if (forwardLean !== null && forwardLean > ANGLE_THRESHOLDS.squat.forwardLeanMax) {
    flags.push({
      id: `squat-lean-${timestamp}`,
      type: 'warning',
      category: 'Posture',
      message: `Excessive forward lean detected (${forwardLean.toFixed(1)}°). Keep chest up.`,
      joint: 'torso',
      angle: forwardLean,
      threshold: ANGLE_THRESHOLDS.squat.forwardLeanMax,
      timestamp,
    });
  }

  if (symmetry !== null && symmetry > ANGLE_THRESHOLDS.squat.symmetryThreshold) {
    flags.push({
      id: `squat-symmetry-${timestamp}`,
      type: 'warning',
      category: 'Symmetry',
      message: `Asymmetric movement detected (${symmetry.toFixed(1)}° difference). Distribute weight evenly.`,
      joint: 'knee',
      angle: symmetry,
      threshold: ANGLE_THRESHOLDS.squat.symmetryThreshold,
      timestamp,
    });
  }

  if (avgHipAngle !== null && avgHipAngle < ANGLE_THRESHOLDS.squat.hipAngleDeep) {
    flags.push({
      id: `squat-hip-${timestamp}`,
      type: 'info',
      category: 'Hip Mobility',
      message: 'Good hip flexion achieved',
      joint: 'hip',
      angle: avgHipAngle,
      threshold: ANGLE_THRESHOLDS.squat.hipAngleDeep,
      timestamp,
    });
  }

  if (flags.length === 0) {
    flags.push({
      id: `squat-ok-${timestamp}`,
      type: 'info',
      category: 'Form',
      message: 'No movement flags detected',
      timestamp,
    });
  }

  return flags;
}

export function analyzeRunningForm(angles: JointAngle[], landmarks: Landmark[]): MovementFlag[] {
  const flags: MovementFlag[] = [];
  const timestamp = Date.now();

  const leftKnee = angles.find(a => a.joint === 'left_knee');
  const rightKnee = angles.find(a => a.joint === 'right_knee');
  const leftAnkle = angles.find(a => a.joint === 'left_ankle');
  const rightAnkle = angles.find(a => a.joint === 'right_ankle');

  const symmetry = calculateSymmetry(landmarks);

  if (symmetry !== null && symmetry > 15) {
    flags.push({
      id: `run-symmetry-${timestamp}`,
      type: 'warning',
      category: 'Symmetry',
      message: `Stride asymmetry detected (${symmetry.toFixed(1)}° difference)`,
      joint: 'knee',
      angle: symmetry,
      threshold: 15,
      timestamp,
    });
  }

  if (leftKnee && leftKnee.angle > ANGLE_THRESHOLDS.running.kneeFlexionMax) {
    flags.push({
      id: `run-knee-ext-${timestamp}`,
      type: 'warning',
      category: 'Knee Extension',
      message: `Excessive knee extension (${leftKnee.angle.toFixed(1)}°). Increase knee flexion.`,
      joint: 'left_knee',
      angle: leftKnee.angle,
      threshold: ANGLE_THRESHOLDS.running.kneeFlexionMax,
      timestamp,
    });
  }

  if (rightKnee && rightKnee.angle > ANGLE_THRESHOLDS.running.kneeFlexionMax) {
    flags.push({
      id: `run-knee-ext-r-${timestamp}`,
      type: 'warning',
      category: 'Knee Extension',
      message: `Excessive knee extension (${rightKnee.angle.toFixed(1)}°). Increase knee flexion.`,
      joint: 'right_knee',
      angle: rightKnee.angle,
      threshold: ANGLE_THRESHOLDS.running.kneeFlexionMax,
      timestamp,
    });
  }

  if (flags.length === 0) {
    flags.push({
      id: `run-ok-${timestamp}`,
      type: 'info',
      category: 'Form',
      message: 'No movement flags detected',
      timestamp,
    });
  }

  return flags;
}

export function analyzeBasketballForm(angles: JointAngle[], landmarks: Landmark[]): MovementFlag[] {
  const flags: MovementFlag[] = [];
  const timestamp = Date.now();

  const leftKnee = angles.find(a => a.joint === 'left_knee');
  const rightKnee = angles.find(a => a.joint === 'right_knee');
  const symmetry = calculateSymmetry(landmarks);

  const avgKneeAngle = leftKnee && rightKnee ? (leftKnee.angle + rightKnee.angle) / 2 : leftKnee?.angle ?? rightKnee?.angle ?? null;

  if (avgKneeAngle !== null && avgKneeAngle < ANGLE_THRESHOLDS.basketball.landingKneeFlexionMin) {
    flags.push({
      id: `bball-landing-${timestamp}`,
      type: 'warning',
      category: 'Landing Mechanics',
      message: `Insufficient knee flexion on landing (${avgKneeAngle.toFixed(1)}°). Bend knees more to absorb impact.`,
      joint: 'knee',
      angle: avgKneeAngle,
      threshold: ANGLE_THRESHOLDS.basketball.landingKneeFlexionMin,
      timestamp,
    });
  }

  if (symmetry !== null && symmetry > ANGLE_THRESHOLDS.basketball.landingSymmetryThreshold) {
    flags.push({
      id: `bball-symmetry-${timestamp}`,
      type: 'warning',
      category: 'Landing Symmetry',
      message: `Asymmetric landing detected (${symmetry.toFixed(1)}° difference). Land evenly on both feet.`,
      joint: 'knee',
      angle: symmetry,
      threshold: ANGLE_THRESHOLDS.basketball.landingSymmetryThreshold,
      timestamp,
    });
  }

  if (flags.length === 0) {
    flags.push({
      id: `bball-ok-${timestamp}`,
      type: 'info',
      category: 'Form',
      message: 'No movement flags detected',
      timestamp,
    });
  }

  return flags;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function smoothValue(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}