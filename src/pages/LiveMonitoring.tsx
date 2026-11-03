import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useCamera } from '../hooks/useCamera';
import { useMediaPipePose } from '../hooks/useMediaPipePose';
import { useSessionManager } from '../hooks/useSessionManager';
import { usePoseReliability } from '../hooks/usePoseReliability';
import { PoseOverlay } from '../components/monitoring/PoseOverlay';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatusIndicator } from '../components/ui/Badge';
import { SPORT_CONFIGS } from '../types';
import { ANGLE_THRESHOLDS } from '../constants';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Square, 
  Video, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  Zap,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { getJointAngles, calculateForwardLean, calculateSymmetry, analyzeSquatForm, analyzeRunningForm, analyzeBasketballForm } from '../utils/calculations';
import { formatDuration } from '../utils/calculations';
import type { Landmark, MovementFlag, MovementMetrics } from '../types';

type SquatPhase = 'needs-standing' | 'standing' | 'bottom';
type MetricAccumulator = Partial<Record<keyof MovementMetrics, { total: number; count: number }>>;

export function LiveMonitoring() {
  const { selectedSport, settings, updateSettings, navigate, addSession } = useApp();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [currentFlags, setCurrentFlags] = useState<MovementFlag[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [jointAngles, setJointAngles] = useState<{ joint: string; angle: number; confidence: number }[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const squatPhaseRef = useRef<SquatPhase>('needs-standing');
  const metricTotalsRef = useRef<MetricAccumulator>({});
  const activeFlagKeysRef = useRef<Set<string>>(new Set());

  const camera = useCamera({ autoStart: false });
  const sessionManager = useSessionManager();
  // Keep latest save callbacks in refs so an unmount cleanup can persist the
  // in-flight session even if it runs after the component has re-rendered.
  const isMonitoringRef = useRef(false);
  const endSessionRef = useRef(sessionManager.endSession);
  const addSessionRef = useRef(addSession);
  useEffect(() => { isMonitoringRef.current = isMonitoring; }, [isMonitoring]);
  useEffect(() => { endSessionRef.current = sessionManager.endSession; }, [sessionManager.endSession]);
  useEffect(() => { addSessionRef.current = addSession; }, [addSession]);
  // Persist the session if the component unmounts while monitoring is active
  // (sidebar navigation, reload, tab close) — otherwise the session is lost.
  useEffect(() => {
    return () => {
      if (isMonitoringRef.current) {
        const completed = endSessionRef.current();
        if (completed) addSessionRef.current(completed);
      }
    };
  }, []);

  // Step 1: collect raw landmarks from MediaPipe (no analysis yet)
  const onRawPoseResults = useCallback((results: { landmarks: Landmark[]; timestamp: number }) => {
    if (!results.landmarks || results.landmarks.length === 0) {
      setLandmarks([]);
      return;
    }
    setLandmarks(results.landmarks);
  }, []);

  const pose = useMediaPipePose({
    videoRef: camera.videoRef,
    enabled: isMonitoring,
    onResults: onRawPoseResults,
  });

  // Step 2: classify tracking reliability from landmark state
  const reliability = usePoseReliability({
    landmarks,
    sport: selectedSport,
    cameraActive: !!camera.stream,
    cameraLoading: camera.isLoading,
    cameraError: camera.error,
    detectorLoading: pose.isLoading,
    detectorError: pose.error,
  });

  // Step 3: run movement analysis only when reliable — driven by landmark/reliability changes
  useEffect(() => {
    if (!reliability.isReliable || !selectedSport || landmarks.length === 0) {
      setCurrentFlags([]);
      setJointAngles([]);
      if (isMonitoring) activeFlagKeysRef.current.clear();
      return;
    }

    const angles = getJointAngles(landmarks, selectedSport);
    setJointAngles(angles);

    const forwardLean = calculateForwardLean(landmarks);
    const symmetry = calculateSymmetry(landmarks);

    let flags: MovementFlag[] = [];
    if (selectedSport === 'strength') {
      flags = analyzeSquatForm(angles, forwardLean, symmetry);
    } else if (selectedSport === 'running') {
      flags = analyzeRunningForm(angles, landmarks);
    } else if (selectedSport === 'basketball') {
      flags = analyzeBasketballForm(angles, landmarks);
    }

    setCurrentFlags(flags);

    if (!isMonitoring) return;

    const kneeAngles = angles.filter(angle => angle.joint.endsWith('_knee'));
    const hipAngles = angles.filter(angle => angle.joint.endsWith('_hip'));
    const ankleAngles = angles.filter(angle => angle.joint.endsWith('_ankle'));
    const average = (values: typeof angles) =>
      values.length > 0 ? values.reduce((sum, value) => sum + value.angle, 0) / values.length : undefined;

    const frameMetrics: Partial<MovementMetrics> = {
      ...(average(kneeAngles) !== undefined ? { avgKneeAngle: average(kneeAngles) } : {}),
      ...(average(hipAngles) !== undefined ? { avgHipAngle: average(hipAngles) } : {}),
      ...(average(ankleAngles) !== undefined ? { avgAnkleAngle: average(ankleAngles) } : {}),
      ...(forwardLean !== null ? { forwardLean } : {}),
      ...(symmetry !== null ? { symmetryScore: symmetry } : {}),
    };
    const sessionMetrics: Partial<MovementMetrics> = {};

    for (const [key, value] of Object.entries(frameMetrics) as [keyof MovementMetrics, number][]) {
      const accumulator = metricTotalsRef.current[key] ?? { total: 0, count: 0 };
      accumulator.total += value;
      accumulator.count += 1;
      metricTotalsRef.current[key] = accumulator;
      sessionMetrics[key] = accumulator.total / accumulator.count;
    }

    if (Object.keys(sessionMetrics).length > 0) {
      sessionManager.updateMetrics(sessionMetrics);
    }

    if (selectedSport === 'strength') {
      const kneeAngle = average(kneeAngles);
      if (kneeAngle !== undefined) {
        const { kneeAngleDeep, kneeAngleStanding } = ANGLE_THRESHOLDS.squat;

        if (squatPhaseRef.current === 'needs-standing' && kneeAngle >= kneeAngleStanding) {
          squatPhaseRef.current = 'standing';
        } else if (squatPhaseRef.current === 'standing' && kneeAngle <= kneeAngleDeep) {
          squatPhaseRef.current = 'bottom';
        } else if (squatPhaseRef.current === 'bottom' && kneeAngle >= kneeAngleStanding) {
          squatPhaseRef.current = 'standing';
          sessionManager.incrementRepCount();
          setRepCount(count => count + 1);
        }
      }
    }

    const activeFlagKeys = new Set<string>();
    for (const flag of flags) {
      if (flag.category === 'Form' && flag.type === 'info') continue;
      const key = `${flag.type}:${flag.category}:${flag.joint ?? ''}`;
      activeFlagKeys.add(key);
      if (!activeFlagKeysRef.current.has(key)) {
        sessionManager.addFlag(flag);
      }
    }
    activeFlagKeysRef.current = activeFlagKeys;
  }, [
    landmarks,
    selectedSport,
    reliability.isReliable,
    isMonitoring,
    sessionManager.updateMetrics,
    sessionManager.incrementRepCount,
    sessionManager.addFlag,
  ]);

  useEffect(() => {
    if (!isMonitoring || !sessionStartTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - sessionStartTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isMonitoring, sessionStartTime]);

  const handleStartMonitoring = async () => {
    if (!camera.stream) {
      await camera.startCamera();
    }
    setIsMonitoring(true);
    setSessionStartTime(Date.now());
    setElapsedTime(0);
    setRepCount(0);
    setCurrentFlags([]);
    squatPhaseRef.current = 'needs-standing';
    metricTotalsRef.current = {};
    activeFlagKeysRef.current.clear();
    sessionManager.startSession(selectedSport || 'strength');
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    camera.stopCamera();

    const completedSession = sessionManager.endSession();
    if (completedSession) {
      addSession(completedSession);
    }
  };

  const toggleCamera = async () => {
    if (camera.stream) {
      if (isMonitoring) {
        // Stopping the camera also ends the active session so it is not lost.
        setIsMonitoring(false);
        const completed = sessionManager.endSession();
        if (completed) addSession(completed);
      }
      camera.stopCamera();
    } else {
      await camera.startCamera();
    }
  };

  if (!selectedSport) {
    return (
      <div className="text-center py-20">
        <Video className="w-16 h-16 text-olive-600 mx-auto mb-4" />
        <h2 className="text-xl font-display font-semibold text-text-primary mb-2">No Sport Selected</h2>
        <p className="text-text-muted mb-6">Please select a sport to start monitoring</p>
        <Button onClick={() => navigate('sports-selection')}>
          Select Sport
        </Button>
      </div>
    );
  }

  const sportConfig = SPORT_CONFIGS[selectedSport];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sportConfig.gradient} flex items-center justify-center`}>
              {selectedSport === 'strength' && <Activity className="w-5 h-5 text-text-primary" />}
              {selectedSport === 'running' && <Activity className="w-5 h-5 text-text-primary" />}
              {selectedSport === 'basketball' && <Activity className="w-5 h-5 text-text-primary" />}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">{sportConfig.name}</h1>
              <p className="text-text-muted">{sportConfig.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator 
            status={isMonitoring 
              ? (reliability.status === 'ready' ? 'active' : 'connecting') 
              : camera.stream ? 'connecting' : 'idle'
            } 
            label={isMonitoring 
              ? reliability.statusLabel 
              : camera.stream ? 'Camera Ready' : 'Idle'
            }
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="relative aspect-video bg-ivory-100">
              <video
                ref={camera.videoRef}
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
                playsInline
                muted
                autoPlay
              />
              
              <PoseOverlay
                videoRef={camera.videoRef}
                landmarks={landmarks}
                sport={selectedSport}
                showSkeleton={showSkeleton}
                showAngles={showAngles}
                showConfidence={settings.showConfidence}
              />

              {/* Overlay Controls */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant={camera.stream ? 'success' : 'default'} dot size="sm">
                  {camera.stream ? 'Camera Active' : 'No Camera'}
                </Badge>
                {isMonitoring && (
                  <Badge variant="primary" dot size="sm">
                    AI Tracking
                  </Badge>
                )}
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {pose.fps} FPS
                </Badge>
              </div>

              {/* Error State */}
              <AnimatePresence>
                {camera.error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-cream-100/80 backdrop-blur-sm"
                  >
                    <div className="text-center p-6">
                      <CameraOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400 font-medium">{camera.error}</p>
                      <p className="text-text-muted text-sm mt-2">Please check your camera permissions</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State */}
              <AnimatePresence>
                {(camera.isLoading || pose.isLoading) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-cream-100/80 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-brown-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-text-secondary">
                        {camera.isLoading ? 'Starting camera...' : 'Loading AI model...'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No Camera State */}
              {!camera.stream && !camera.isLoading && !camera.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-cream-100/80">
                  <div className="text-center p-6">
                    <Camera className="w-16 h-16 text-olive-600 mx-auto mb-4" />
                    <p className="text-text-secondary mb-4">Camera not active</p>
                    <Button onClick={toggleCamera} leftIcon={<Camera className="w-4 h-4" />}>
                      Start Camera
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-olive-200/50 flex flex-wrap items-center gap-3">
              <Button
                onClick={toggleCamera}
                variant={camera.stream ? 'secondary' : 'primary'}
                leftIcon={camera.stream ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              >
                {camera.stream ? 'Stop Camera' : 'Start Camera'}
              </Button>

              <Button
                onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
                variant={isMonitoring ? 'danger' : 'accent'}
                disabled={!camera.stream}
                leftIcon={isMonitoring ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setShowSkeleton(!showSkeleton)}
                  className={`p-2 rounded-lg transition-colors ${showSkeleton ? 'bg-brown-500/20 text-brown-500' : 'bg-cream-200 text-text-muted'}`}
                  title="Toggle skeleton"
                >
                  {showSkeleton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowAngles(!showAngles)}
                  className={`p-2 rounded-lg transition-colors ${showAngles ? 'bg-brown-500/20 text-brown-500' : 'bg-cream-200 text-text-muted'}`}
                  title="Toggle angles"
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Metrics Panel */}
        <div className="space-y-4">
          {/* Session Timer */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Session Time</p>
                <p className="text-3xl font-display font-bold text-text-primary mt-1">
                  {formatDuration(elapsedTime)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-cream-200">
                <Clock className="w-6 h-6 text-brown-500" />
              </div>
            </div>
          </Card>

          {/* Rep Count (for strength) */}
          {selectedSport === 'strength' && (
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Squat Count</p>
                  <p className="text-3xl font-display font-bold text-text-primary mt-1">{repCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-cream-200">
                  <Zap className="w-6 h-6 text-olive-500" />
                </div>
              </div>
            </Card>
          )}

          {/* Joint Angles */}
          <Card>
            <h3 className="font-semibold text-text-primary mb-3">Joint Angles</h3>
            {jointAngles.length === 0 ? (
              <p className="text-olive-500 text-sm">No data available</p>
            ) : (
              <div className="space-y-2">
                {jointAngles.map((angle) => (
                  <div key={angle.joint} className="flex items-center justify-between p-2 rounded-lg bg-cream-200/50">
                    <span className="text-sm text-text-secondary capitalize">{angle.joint.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-text-primary">{angle.angle.toFixed(1)}°</span>
                      <Badge variant={angle.confidence > 0.7 ? 'success' : 'warning'} size="sm">
                        {(angle.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Movement Flags */}
          <Card>
            <h3 className="font-semibold text-text-primary mb-3">Movement Feedback</h3>
            {currentFlags.length === 0 ? (
              <p className="text-olive-500 text-sm">No flags detected</p>
            ) : (
              <div className="space-y-2">
                {currentFlags.map((flag) => (
                  <motion.div
                    key={flag.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      flag.type === 'warning' 
                        ? 'bg-yellow-500/10 border-yellow-500/30' 
                        : flag.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {flag.type === 'warning' || flag.type === 'critical' ? (
                        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${flag.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-text-primary">{flag.category}</p>
                        <p className="text-xs text-text-muted mt-0.5">{flag.message}</p>
                        {flag.joint && flag.angle !== undefined && (
                          <p className="text-xs text-olive-500 mt-1">
                            {flag.joint}: {flag.angle.toFixed(1)}° (threshold: {flag.threshold}°)
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Confidence Indicator */}
          {landmarks.length > 0 && (
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Tracking Confidence</p>
                  <p className="text-xl font-display font-bold text-text-primary mt-1">
                    {(landmarks.reduce((sum, l) => sum + (l.visibility || 0), 0) / landmarks.length * 100).toFixed(0)}%
                  </p>
                </div>
                <Badge variant="primary" dot size="sm">Live</Badge>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <Card variant="panel" className="border-yellow-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-muted">
            <span className="text-yellow-300 font-medium">Educational Feedback Only:</span> This system provides movement analysis for educational purposes. 
            It does not generate medical diagnoses or predict injury probability. Always consult a qualified professional.
          </p>
        </div>
      </Card>
    </div>
  );
}