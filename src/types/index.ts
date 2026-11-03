export type SportType = 'strength' | 'running' | 'basketball';

export type SportConfig = {
  id: SportType;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  landmarks: number[];
  metrics: string[];
};

export type Landmark = {
  x: number;
  y: number;
  z: number;
  visibility: number;
  name: string;
};

export type PoseResult = {
  landmarks: Landmark[];
  worldLandmarks?: Landmark[];
  timestamp: number;
};

export type JointAngle = {
  joint: string;
  angle: number;
  confidence: number;
};

export type MovementMetrics = {
  squatCount?: number;
  cadence?: number;
  jumpCount?: number;
  landingQuality?: number;
  avgKneeAngle?: number;
  avgHipAngle?: number;
  avgAnkleAngle?: number;
  symmetryScore?: number;
  forwardLean?: number;
};

export type MovementFlag = {
  id: string;
  type: 'info' | 'warning' | 'critical';
  category: string;
  message: string;
  joint?: string;
  angle?: number;
  threshold?: number;
  timestamp: number;
};

export type Session = {
  id: string;
  sport: SportType;
  startTime: number;
  endTime: number;
  duration: number;
  metrics: MovementMetrics;
  flags: MovementFlag[];
  repCount: number;
  landmarkData?: Landmark[][];
};

export type UserSettings = {
  cameraId: string;
  resolution: { width: number; height: number };
  fps: number;
  showSkeleton: boolean;
  showAngles: boolean;
  showConfidence: boolean;
  voiceFeedback: boolean;
  theme: 'dark' | 'light';
  sensitivity: 'low' | 'medium' | 'high';
};

export type CameraDevice = {
  deviceId: string;
  label: string;
  kind: 'videoinput';
};

export type UserProfile = {
  email: string;
  name?: string;
  loginTime: number;
};

export type AppState = {
  currentPage: PageType;
  selectedSport: SportType | null;
  isMonitoring: boolean;
  cameraPermission: PermissionState;
  sessions: Session[];
  settings: UserSettings;
  user: UserProfile | null;
  isAuthenticated: boolean;
};

export type PageType = 
  | 'login'
  | 'landing' 
  | 'dashboard' 
  | 'sports-selection' 
  | 'live-monitoring' 
  | 'analytics' 
  | 'injury-risk' 
  | 'history' 
  | 'settings';

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  strength: {
    id: 'strength',
    name: 'Strength Training',
    description: 'Squat form analysis with rep counting and posture feedback',
    icon: 'dumbbell',
    color: '#00b8d4',
    gradient: 'from-brown-500 to-primary-700',
    landmarks: [11, 12, 23, 24, 25, 26, 27, 28],
    metrics: ['Squat Count', 'Knee Angle', 'Hip Angle', 'Forward Lean', 'Symmetry'],
  },
  running: {
    id: 'running',
    name: 'Running',
    description: 'Movement pattern analysis with cadence estimation',
    icon: 'figure-running',
    color: '#33cc00',
    gradient: 'from-olive-500 to-accent-700',
    landmarks: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    metrics: ['Cadence', 'Stride Symmetry', 'Knee Flexion', 'Hip Extension', 'Ankle Angle'],
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    description: 'Jump and landing mechanics analysis',
    icon: 'basketball',
    color: '#f97316',
    gradient: 'from-orange-500 to-orange-700',
    landmarks: [11, 12, 23, 24, 25, 26, 27, 28, 29, 30],
    metrics: ['Jump Count', 'Landing Knee Flexion', 'Landing Symmetry', 'Flight Time', 'Takeoff Angle'],
  },
};

export const LANDMARK_NAMES: Record<number, string> = {
  0: 'nose',
  1: 'left_eye_inner',
  2: 'left_eye',
  3: 'left_eye_outer',
  4: 'right_eye_inner',
  5: 'right_eye',
  6: 'right_eye_outer',
  7: 'left_ear',
  8: 'right_ear',
  9: 'mouth_left',
  10: 'mouth_right',
  11: 'left_shoulder',
  12: 'right_shoulder',
  13: 'left_elbow',
  14: 'right_elbow',
  15: 'left_wrist',
  16: 'right_wrist',
  17: 'left_pinky',
  18: 'right_pinky',
  19: 'left_index',
  20: 'right_index',
  21: 'left_thumb',
  22: 'right_thumb',
  23: 'left_hip',
  24: 'right_hip',
  25: 'left_knee',
  26: 'right_knee',
  27: 'left_ankle',
  28: 'right_ankle',
  29: 'left_heel',
  30: 'right_heel',
  31: 'left_foot_index',
  32: 'right_foot_index',
};

export const POSE_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  [11, 12],
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
  [11, 23], [12, 24],
  [23, 24],
  [23, 25], [25, 27], [27, 29], [29, 31],
  [24, 26], [26, 28], [28, 30], [30, 32],
];