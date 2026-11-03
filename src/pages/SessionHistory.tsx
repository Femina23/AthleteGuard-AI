import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  History, 
  Trash2, 
  Calendar, 
  Clock, 
  Activity, 
  AlertTriangle,
  Download,
  Search
} from 'lucide-react';
import { SPORT_CONFIGS } from '../types';
import { formatDuration, formatDate } from '../utils/calculations';

export function SessionHistory() {
  const { sessions, deleteSession, clearAllSessions, navigate, demoMode, loadDemoData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session => {
    const sportName = (SPORT_CONFIGS[session.sport as keyof typeof SPORT_CONFIGS]?.name ?? '').toLowerCase();
    return sportName.includes(searchQuery.toLowerCase());
  });

  const handleExport = () => {
    const payload = demoMode
      ? { demoData: true, note: 'Simulated demo records for academic presentation only. Not real athlete data.', sessions }
      : sessions;
    const data = JSON.stringify(payload, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `athlete-guard-${demoMode ? 'demo-' : ''}sessions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">Session History</h1>
        {demoMode && <Badge variant="primary" size="sm" className="ml-2">DEMO DATA</Badge>}
          <p className="text-text-muted mt-1">Review and manage your past training sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={sessions.length === 0}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="danger" size="sm" onClick={clearAllSessions} disabled={sessions.length === 0}>
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-olive-500" />
          <input
            type="text"
            placeholder="Search by sport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-cream-200 border border-olive-200 rounded-xl text-text-primary placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="text-center py-16">
          <History className="w-16 h-16 text-olive-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
            {sessions.length === 0 ? 'No Sessions Recorded' : 'No Matching Sessions'}
          </h3>
          <p className="text-text-muted max-w-md mx-auto">
            {sessions.length === 0 
              ? 'Start your first monitoring session to build your history.'
              : 'Try adjusting your search query.'}
          </p>
          {sessions.length === 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button onClick={() => navigate('sports-selection')}>
                Start Training
              </Button>
              <Button variant="secondary" onClick={loadDemoData}>
                Load Demo Data
              </Button>
            </div>


          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session, index) => {
            const sportConfig = SPORT_CONFIGS[session.sport as keyof typeof SPORT_CONFIGS] ?? { name: session.sport, gradient: 'from-olive-500 to-accent-700' };
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sportConfig.gradient} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-text-primary font-bold">
                        {sportConfig.name.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary">{sportConfig.name}</h3>
                        <Badge variant="primary" size="sm">{session.repCount} reps</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(session.duration)}
                        </span>
                        {session.flags.filter(f => f.type === 'warning').length > 0 && (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <AlertTriangle className="w-4 h-4" />
                            {session.flags.filter(f => f.type === 'warning').length} flags
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Metrics */}
                  {Object.keys(session.metrics).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-olive-200/50">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(session.metrics).map(([key, value]) => (
                          <div key={key} className="text-center p-2 rounded-lg bg-cream-200/50">
                            <p className="text-xs text-olive-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm font-semibold text-text-primary">
                              {typeof value === 'number' ? value.toFixed(1) : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flags */}
                  {session.flags.filter(f => f.type === 'warning').length > 0 && (
                    <div className="mt-4 pt-4 border-t border-olive-200/50">
                      <p className="text-xs text-olive-500 mb-2">Movement Flags:</p>
                      <div className="flex flex-wrap gap-2">
                        {session.flags.filter(f => f.type === 'warning').map(flag => (
                          <Badge key={flag.id} variant="warning" size="sm">
                            {flag.category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
