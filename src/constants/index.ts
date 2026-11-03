export const STORAGE_KEYS = {
  SESSIONS: 'athlete-guard-sessions',
  DEMO_SESSIONS: 'athlete-guard-demo-sessions',
  DEMO_MODE: 'athlete-guard-demo-mode',
  SETTINGS: 'athlete-guard-settings',
  USER_PROFILE: 'athlete-guard-profile',
} as const;

export const MEDIAPIPE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task';

export const DEFAULT_SETTINGS = {
  cameraId: '',
  resolution: { width: 1280, height: 720 },
  fps: 30,
  showSkeleton: true,
  showAngles: true,
  showConfidence: true,
  voiceFeedback: false,
  theme: 'dark' as const,
  sensitivity: 'medium' as const,
};

export const ANGLE_THRESHOLDS = {
  squat: {
    kneeAngleDeep: 90,
    kneeAngleStanding: 160,
    hipAngleDeep: 90,
    forwardLeanMax: 45,
    symmetryThreshold: 15,
  },
  running: {
    kneeFlexionMin: 20,
    kneeFlexionMax: 120,
    hipExtensionMin: 160,
    cadenceMin: 150,
    cadenceMax: 200,
  },
  basketball: {
    landingKneeFlexionMin: 70,
    landingSymmetryThreshold: 10,
    flightTimeMin: 0.3,
    takeoffAngleMin: 30,
  },
};

export const CONFIDENCE_THRESHOLD = 0.5;

export const VISIBILITY_THRESHOLD = 0.5;

export const SESSION_CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

export const MAX_SESSIONS_STORED = 100;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};