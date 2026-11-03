import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  Target,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getSessionStats, getSportSessions } from '../utils/storage';
import { SPORT_CONFIGS } from '../types';

const COLORS = ['#00b8d4', '#33cc00', '#f97316'];

export function Analytics() {
  const { sessions, navigate, demoMode } = useApp();
  const stats = getSessionStats(sessions);

  const sportData = Object.entries(stats.sportDistribution).map(([sport, count]) => ({
    name: (SPORT_CONFIGS[sport as keyof typeof SPORT_CONFIGS]?.name ?? sport),
    value: count,
  }));

  const timeSeriesData = sessions
    .slice(0, 20)
    .reverse()
    .map((session, index) => ({
      session: `S${index + 1}`,
      duration: Math.round(session.duration / 60000),
      reps: session.repCount,
      flags: session.flags.filter(f => f.type === 'warning').length,
    }));

  const strengthSessions = getSportSessions(sessions, 'strength');
  const runningSessions = getSportSessions(sessions, 'running');
  const basketballSessions = getSportSessions(sessions, 'basketball');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">Performance Analytics</h1>
        {demoMode && <Badge variant="primary" size="sm" className="ml-2">DEMO DATA</Badge>}
        <p className="text-text-muted mt-1">Deep insights into your training data</p>
      </motion.div>

      {sessions.length === 0 ? (
        <Card className="text-center py-16">
          <BarChart3 className="w-16 h-16 text-olive-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">No Data Available</h3>
          <p className="text-text-muted max-w-md mx-auto">
            Complete some training sessions to see your analytics here. Start monitoring to generate real data.
          </p>
          <Button className="mt-6" onClick={() => navigate('sports-selection')}>
            Start Training
          </Button>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Sessions', value: stats.totalSessions, icon: Activity, color: 'text-brown-500' },
              { label: 'Avg Duration', value: `${Math.round(stats.avgSessionDuration / 60000)}m`, icon: Clock, color: 'text-olive-500' },
              { label: 'Total Reps', value: stats.totalReps, icon: Target, color: 'text-yellow-400' },
              { label: 'Movement Flags', value: stats.totalFlags, icon: AlertTriangle, color: 'text-red-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Duration Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Session Duration Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="session" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                      />
                      <Line type="monotone" dataKey="duration" stroke="#00b8d4" strokeWidth={2} dot={{ fill: '#00b8d4' }} name="Duration (min)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Repetition Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Repetition Count</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="session" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                      />
                      <Bar dataKey="reps" fill="#33cc00" name="Reps" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Sport Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Sport Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sportData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Movement Flags Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <h3 className="font-display font-semibold text-lg text-text-primary mb-4">Movement Flags Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="session" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                      />
                      <Bar dataKey="flags" fill="#f87171" name="Flags" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sport-Specific Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { sport: 'strength', sessions: strengthSessions, label: 'Strength Training' },
              { sport: 'running', sessions: runningSessions, label: 'Running' },
              { sport: 'basketball', sessions: basketballSessions, label: 'Basketball' },
            ].map(({ sport, sessions: sportSessions, label }, index) => (
              <motion.div
                key={sport}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card>
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-4">{label}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Sessions</span>
                      <span className="text-text-primary font-semibold">{sportSessions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Total Time</span>
                      <span className="text-text-primary font-semibold">
                        {Math.round(sportSessions.reduce((sum, s) => sum + s.duration, 0) / 60000)}m
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Total Reps</span>
                      <span className="text-text-primary font-semibold">
                        {sportSessions.reduce((sum, s) => sum + s.repCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Flags</span>
                      <span className="text-text-primary font-semibold">
                        {sportSessions.reduce((sum, s) => sum + s.flags.filter(f => f.type === 'warning').length, 0)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
