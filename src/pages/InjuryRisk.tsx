import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  AlertTriangle, 
  Shield, 
  Info, 
  CheckCircle2,
  TrendingDown,
  Activity
} from 'lucide-react';
import { getSessionStats } from '../utils/storage';

export function InjuryRisk() {
  const { sessions } = useApp();
  const stats = getSessionStats(sessions);

  const warningFlags = sessions.flatMap(s => s.flags.filter(f => f.type === 'warning' || f.type === 'critical'));

  const categoryCounts = warningFlags.reduce((acc, flag) => {
    acc[flag.category] = (acc[flag.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">Movement Risk Awareness</h1>
        <p className="text-text-muted mt-1">Understand your movement patterns and form indicators</p>
      </motion.div>

      {/* Disclaimer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="panel" className="border-yellow-500/30">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-300">Important: Educational Purpose Only</h3>
              <p className="text-sm text-text-muted mt-1">
                This system provides educational movement feedback based on measurable pose features. 
                It does NOT generate medical diagnoses, predict injury probability, or claim to calculate 
                true biomechanical forces. Movement flags indicate form deviations that may warrant attention 
                during training. Always consult a qualified healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Movement Flags', value: warningFlags.length, icon: AlertTriangle, color: 'text-yellow-400' },
          { label: 'Sessions Analyzed', value: sessions.length, icon: Activity, color: 'text-brown-500' },
          { label: 'Flag Categories', value: Object.keys(categoryCounts).length, icon: Info, color: 'text-olive-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-cream-200 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Movement Categories */}
      {Object.keys(categoryCounts).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Flag Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="p-4 rounded-xl bg-cream-200/50 border border-olive-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary capitalize">{category}</span>
                    <Badge variant="warning" size="sm">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Flags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Recent Movement Flags</h3>
          
          {warningFlags.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-400 font-medium">No movement flags recorded</p>
              <p className="text-sm text-olive-500 mt-1">Your form looks good! Keep monitoring to track patterns.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {warningFlags.slice(0, 20).map((flag, index) => (
                <motion.div
                  key={flag.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    flag.type === 'critical' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${flag.type === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-text-primary">{flag.category}</span>
                          <Badge variant={flag.type === 'critical' ? 'danger' : 'warning'} size="sm">
                            {flag.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary">{flag.message}</p>
                        {flag.joint && flag.angle !== undefined && (
                          <p className="text-xs text-olive-500 mt-1">
                            Joint: {flag.joint} | Measured: {flag.angle.toFixed(1)}° | Threshold: {flag.threshold}°
                          </p>
                        )}
                        <p className="text-xs text-olive-600 mt-1">
                          {new Date(flag.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Movement Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Movement Guidelines</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Squat Form',
                items: [
                  'Keep knee angle above 90° at bottom for proper depth',
                  'Maintain forward lean under 45° to protect spine',
                  'Keep knee symmetry within 15° between sides',
                  'Engage core and keep chest up throughout movement',
                ],
              },
              {
                title: 'Running Form',
                items: [
                  'Maintain knee flexion within 20-120° range',
                  'Keep stride symmetry within 15°',
                  'Land softly with controlled knee angle',
                  'Maintain hip extension for efficient propulsion',
                ],
              },
              {
                title: 'Basketball Landing',
                items: [
                  'Bend knees to at least 70° on landing',
                  'Land evenly on both feet (symmetry < 10°)',
                  'Avoid stiff-legged landings',
                  'Keep center of mass over base of support',
                ],
              },
            ].map((guide) => (
              <div key={guide.title} className="p-4 rounded-xl bg-cream-200/30 border border-olive-200/50">
                <h4 className="font-semibold text-text-primary mb-2">{guide.title}</h4>
                <ul className="space-y-1">
                  {guide.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-olive-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}