import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { 
  Settings as SettingsIcon, 
  Camera, 
  Monitor, 
  Bell, 
  Shield, 
  Save,
  RotateCcw,
  Activity
} from 'lucide-react';

export function Settings() {
  const { settings, updateSettings, demoMode, demoSessions, setDemoMode, loadDemoData, clearDemoData } = useApp();

  const handleSave = () => {
    // Settings are auto-saved through context
  };

  const handleReset = () => {
    updateSettings({
      cameraId: '',
      resolution: { width: 1280, height: 720 },
      fps: 30,
      showSkeleton: true,
      showAngles: true,
      showConfidence: true,
      voiceFeedback: false,
      theme: 'dark',
      sensitivity: 'medium',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">Settings</h1>
        <p className="text-text-muted mt-1">Configure your preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brown-500/10">
                <Camera className="w-5 h-5 text-brown-500" />
              </div>
              <h2 className="font-display font-semibold text-lg text-text-primary">Camera Settings</h2>
            </div>

            <div className="space-y-4">
              <Select
                label="Resolution"
                value={`${settings.resolution.width}x${settings.resolution.height}`}
                onChange={(e) => {
                  const [w, h] = e.target.value.split('x').map(Number);
                  updateSettings({ resolution: { width: w, height: h } });
                }}
                options={[
                  { value: '640x480', label: '640 × 480 (Standard)' },
                  { value: '1280x720', label: '1280 × 720 (HD)' },
                  { value: '1920x1080', label: '1920 × 1080 (Full HD)' },
                ]}
              />

              <Select
                label="Target FPS"
                value={settings.fps.toString()}
                onChange={(e) => updateSettings({ fps: Number(e.target.value) })}
                options={[
                  { value: '15', label: '15 FPS' },
                  { value: '30', label: '30 FPS' },
                  { value: '60', label: '60 FPS' },
                ]}
              />

              <Select
                label="Detection Sensitivity"
                value={settings.sensitivity}
                onChange={(e) => updateSettings({ sensitivity: e.target.value as any })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
              />
            </div>
          </Card>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-olive-500/10">
                <Monitor className="w-5 h-5 text-olive-500" />
              </div>
              <h2 className="font-display font-semibold text-lg text-text-primary">Display Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-200/50">
                <div>
                  <p className="text-text-primary font-medium">Show Skeleton Overlay</p>
                  <p className="text-sm text-text-muted">Display pose skeleton on video</p>
                </div>
                <button
                  onClick={() => updateSettings({ showSkeleton: !settings.showSkeleton })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.showSkeleton ? 'bg-brown-500' : 'bg-cream-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.showSkeleton ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-200/50">
                <div>
                  <p className="text-text-primary font-medium">Show Joint Angles</p>
                  <p className="text-sm text-text-muted">Display angle measurements on overlay</p>
                </div>
                <button
                  onClick={() => updateSettings({ showAngles: !settings.showAngles })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.showAngles ? 'bg-brown-500' : 'bg-cream-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.showAngles ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-200/50">
                <div>
                  <p className="text-text-primary font-medium">Show Confidence</p>
                  <p className="text-sm text-text-muted">Display landmark confidence scores</p>
                </div>
                <button
                  onClick={() => updateSettings({ showConfidence: !settings.showConfidence })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.showConfidence ? 'bg-brown-500' : 'bg-cream-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.showConfidence ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-200/50">
                <div>
                  <p className="text-text-primary font-medium">Voice Feedback</p>
                  <p className="text-sm text-text-muted">Audio cues for rep counting</p>
                </div>
                <button
                  onClick={() => updateSettings({ voiceFeedback: !settings.voiceFeedback })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.voiceFeedback ? 'bg-brown-500' : 'bg-cream-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.voiceFeedback ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-200/50">
                <div>
                  <p className="text-text-primary font-medium">Theme</p>
                  <p className="text-sm text-text-muted">Application color theme</p>
                </div>
                <Select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })}
                  options={[
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                  ]}
                  className="w-32"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Privacy & Data */}
        {/* Demo Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brown-500/10">
                <Activity className="w-5 h-5 text-brown-500" />
              </div>
              <h2 className="font-display font-semibold text-lg text-text-primary">Demo Data Mode</h2>
              {demoMode && <Badge variant="primary" size="sm">DEMO DATA</Badge>}
            </div>
            <p className="text-text-muted text-sm mb-4">
              Load clearly labelled simulated workout records for presentations. Demo records are stored separately and never mix with real sessions.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={demoMode ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => (demoSessions.length === 0 ? loadDemoData() : setDemoMode(!demoMode))}
              >
                {demoSessions.length === 0 ? 'Load Demo Data' : demoMode ? 'Disable Demo View' : 'Enable Demo View'}
              </Button>
              {demoSessions.length > 0 && (
                <>
                  <Button variant="secondary" size="sm" onClick={loadDemoData}>
                    Reload Demo Data
                  </Button>
                  <Button variant="danger" size="sm" onClick={clearDemoData}>
                    Remove Demo Data
                  </Button>
                </>
              )}
            </div>
            <p className="text-xs text-olive-500 mt-3">
              {demoSessions.length === 0
                ? 'No demo records loaded. Real sessions are shown.'
                : `${demoSessions.length} demo records ${demoMode ? 'active (shown across Dashboard, Analytics, History)' : 'loaded but hidden'}.`}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="font-display font-semibold text-lg text-text-primary">Privacy & Data</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cream-200/50 border border-olive-200/50">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-primary font-medium">Local Processing</p>
                    <p className="text-sm text-text-muted mt-1">
                      All pose detection runs in your browser. No webcam footage is uploaded to any server.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cream-200/50 border border-olive-200/50">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-primary font-medium">Local Storage</p>
                    <p className="text-sm text-text-muted mt-1">
                      Session data is stored locally in your browser. Clear browsing data to remove.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="danger" className="w-full" onClick={() => {
                if (confirm('Are you sure you want to clear all data?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}>
                Clear All Data
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <SettingsIcon className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="font-display font-semibold text-lg text-text-primary">About</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Application</span>
                <span className="text-text-primary font-medium">AthleteGuard AI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Version</span>
                <span className="text-text-primary font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">AI Engine</span>
                <span className="text-text-primary font-medium">MediaPipe Pose Landmarker</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Framework</span>
                <span className="text-text-primary font-medium">React + Vite + TypeScript</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Purpose</span>
                <Badge variant="info" size="sm">Educational</Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-3"
      >
        <Button variant="secondary" onClick={handleReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}