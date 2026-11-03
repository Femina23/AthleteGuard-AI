import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Activity, 
  Dumbbell, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Zap, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getSessionStats } from '../utils/storage';
import { SPORT_CONFIGS } from '../types';

export function Dashboard() {
  const { navigate, sessions, selectSport, demoMode, loadDemoData } = useApp();
  const stats = getSessionStats(sessions);

  const recentSessions = sessions.slice(0, 5);

  const quickActions = [
    { label: 'Start Squat Analysis', sport: 'strength' as const, icon: Dumbbell, color: 'from-cyan-500 to-blue-600' },
    { label: 'Start Running Analysis', sport: 'running' as const, icon: Activity, color: 'from-green-500 to-emerald-600' },
    { label: 'Start Basketball Analysis', sport: 'basketball' as const, icon: Trophy, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">
            Welcome back, Athlete
          </h1>
          {demoMode && <Badge variant="primary" size="sm" className="ml-2">DEMO DATA</Badge>}
          <p className="text-text-muted mt-1">Here's your training overview</p>
        </div>
        <Button onClick={() => navigate('sports-selection')}>
          New Session
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: Activity, color: 'text-brown-500' },
          { label: 'Activity Time', value: `${Math.floor(stats.totalDuration / 60000)}m`, icon: Clock, color: 'text-olive-500' },
          { label: 'Total Reps', value: stats.totalReps, icon: Zap, color: 'text-yellow-400' },
          { label: 'Movement Flags', value: stats.totalFlags, icon: AlertTriangle, color: 'text-red-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <h2 className="font-display font-semibold text-lg text-text-primary mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.sport}
                onClick={() => {
                  selectSport(action.sport);
                  navigate('live-monitoring');
                }}
                className="flex items-center gap-4 p-4 rounded-xl bg-cream-200/50 border border-olive-200/50 hover:border-brown-500/30 hover:bg-cream-200 transition-all duration-200 text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary group-hover:text-brown-500 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-sm text-olive-500">Start monitoring</p>
                </div>
                <ArrowRight className="w-4 h-4 text-olive-500 group-hover:text-brown-500 transition-colors" />
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-text-primary">Recent Sessions</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('history')}>
              View All
            </Button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-olive-600 mx-auto mb-4" />
              <p className="text-text-muted">No sessions recorded yet</p>
              <p className="text-sm text-olive-600 mt-1 mb-4">Start your first workout or load demo data to explore</p>
              <Button size="sm" variant="secondary" onClick={loadDemoData}>
                Load Demo Data (22 Records)
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => {
                  const sportConfig = SPORT_CONFIGS[session.sport as keyof typeof SPORT_CONFIGS] ?? { name: session.sport, gradient: 'from-olive-500 to-accent-700' };
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-cream-200/30 hover:bg-cream-200/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sportConfig.gradient} flex items-center justify-center`}>
                      <span className="text-text-primary text-xs font-bold">
                        {sportConfig.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary">{sportConfig.name}</p>
                      <p className="text-sm text-text-muted">
                        {new Date(session.startTime).toLocaleDateString()} • {Math.floor(session.duration / 60000)}m {Math.floor((session.duration % 60000) / 1000)}s
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.repCount > 0 && (
                        <Badge variant="primary" size="sm">{session.repCount} reps</Badge>
                      )}
                      {session.flags.filter(f => f.type === 'warning').length > 0 && (
                        <Badge variant="warning" size="sm" dot>
                          {session.flags.filter(f => f.type === 'warning').length} flags
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Sport Distribution */}
      {stats.totalSessions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h2 className="font-display font-semibold text-lg text-text-primary mb-4">Sport Distribution</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(stats.sportDistribution).map(([sport, count]) => {
                const config = SPORT_CONFIGS[sport as keyof typeof SPORT_CONFIGS] ?? { name: sport };
                return (
                  <div key={sport} className="text-center p-4 rounded-xl bg-cream-200/30">
                    <p className="text-3xl font-display font-bold text-text-primary">{count}</p>
                    <p className="text-sm text-text-muted mt-1">{config.name}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
