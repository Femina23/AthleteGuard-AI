import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SPORT_CONFIGS } from '../types';
import { Dumbbell, Activity, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

export function SportsSelection() {
  const { navigate, selectedSport, selectSport } = useApp();

  const sports = Object.values(SPORT_CONFIGS);

  const handleSelect = (sportId: typeof sports[0]['id']) => {
    selectSport(sportId);
  };

  const handleStart = () => {
    if (selectedSport) {
      navigate('live-monitoring');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary">Select Your Sport</h1>
        <p className="text-text-muted mt-1">Choose the activity you want to monitor</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sports.map((sport, index) => (
          <motion.div
            key={sport.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              className={`cursor-pointer transition-all duration-300 ${
                selectedSport === sport.id ? 'border-brown-500 shadow-[0_0_30px_rgba(0,184,212,0.2)]' : ''
              }`}
              onClick={() => handleSelect(sport.id)}
            >
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center mx-auto mb-4`}>
                  {sport.id === 'strength' && <Dumbbell className="w-10 h-10 text-text-primary" />}
                  {sport.id === 'running' && <Activity className="w-10 h-10 text-text-primary" />}
                  {sport.id === 'basketball' && <Trophy className="w-10 h-10 text-text-primary" />}
                </div>
                
                <h3 className="font-display font-semibold text-xl text-text-primary mb-2">{sport.name}</h3>
                <p className="text-text-muted text-sm mb-4">{sport.description}</p>
                
                <div className="space-y-2">
                  {sport.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-brown-500" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>

                {selectedSport === sport.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <Badge variant="primary" dot>Selected</Badge>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <Button
          size="lg"
          disabled={!selectedSport}
          onClick={handleStart}
        >
          Start Live Monitoring
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
