import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TopNav } from '../components/layout/TopNav';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SPORT_CONFIGS } from '../types';
import { Dumbbell, Activity, Trophy, Video, BarChart3, Shield, Zap, Brain, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Landing() {
  const { navigate, selectSport } = useApp();
  const [hoveredSport, setHoveredSport] = useState<string | null>(null);

  const features = [
    { icon: Video, title: 'Real-Time AI Pose Detection', description: 'MediaPipe-powered landmark tracking with live skeleton overlay' },
    { icon: Dumbbell, title: 'Multi-Sport Analysis', description: 'Squat, running, and basketball movement monitoring' },
    { icon: Brain, title: 'Movement Risk Awareness', description: 'Explainable rule-based feedback on form and posture' },
    { icon: BarChart3, title: 'Performance Analytics', description: 'Track sessions, reps, and trends over time' },
    { icon: Shield, title: 'Privacy First', description: 'All processing happens in your browser. No data uploaded.' },
    { icon: Zap, title: 'Instant Feedback', description: 'Real-time metrics and movement alerts during workouts' },
  ];

  const sports = [
    { id: 'strength', name: 'Strength Training', icon: Dumbbell, color: 'from-brown-500 to-brown-700', description: 'Squat form analysis', features: ['Rep counting', 'Knee & hip angles', 'Posture feedback', 'Symmetry analysis'] },
    { id: 'running', name: 'Running', icon: Activity, color: 'from-olive-500 to-olive-700', description: 'Cadence & stride analysis', features: ['Cadence estimation', 'Stride symmetry', 'Knee flexion', 'Ankle angles'] },
    { id: 'basketball', name: 'Basketball', icon: Trophy, color: 'from-brown-400 to-olive-600', description: 'Jump & landing mechanics', features: ['Jump detection', 'Landing knee flexion', 'Landing symmetry', 'Takeoff angle'] },
  ];

  const handleSportClick = (sportId: string) => {
    selectSport(sportId as any);
    navigate('live-monitoring');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <TopNav />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-200 via-cream-100 to-ivory-100" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="primary" className="mb-6 bg-brown-500/10 text-brown-500 border-brown-500/20">
              AI-Powered Sports Performance
            </Badge>
            
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl mb-6 text-text-primary leading-tight">
              Your Movement.
              <br />
              <span className="text-brown-500">Your Progress.</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
              Real-time pose detection, form analysis, and movement awareness for strength training, running, and basketball. 
              All processing happens in your browser. No data uploaded.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button size="lg" onClick={() => navigate('dashboard')} className="bg-brown-500 hover:bg-brown-600 text-cream-100">
                Enter Athlete Studio
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('live-monitoring')} className="border-olive-300 text-text-primary hover:bg-cream-200">
                Try Live Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sports Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Choose Your Sport
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Select an activity to begin AI-powered movement analysis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onMouseEnter={() => setHoveredSport(sport.id)}
              onMouseLeave={() => setHoveredSport(null)}
            >
              <Card 
                hover 
                className="cursor-pointer overflow-hidden"
                onClick={() => handleSportClick(sport.id)}
              >
                <div className={`h-32 rounded-xl bg-gradient-to-br ${sport.color} flex items-center justify-center mb-4`}>
                  <sport.icon className="w-12 h-12 text-cream-100" />
                </div>
                <h3 className="font-display font-semibold text-xl text-text-primary mb-2">{sport.name}</h3>
                <p className="text-text-secondary text-sm mb-4">{sport.description}</p>
                
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: hoveredSport === sport.id ? 'auto' : 0,
                    opacity: hoveredSport === sport.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-olive-200/50">
                    <p className="text-xs text-olive-500 font-medium mb-2">Analysis Features:</p>
                    <ul className="space-y-1">
                      {sport.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="w-4 h-4 text-olive-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <div className="mt-4 flex items-center text-brown-500 text-sm font-medium">
                  Start Analysis <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Select Sport', desc: 'Choose your activity from strength, running, or basketball' },
            { step: '02', title: 'Start Camera', desc: 'Allow camera access and begin AI pose detection' },
            { step: '03', title: 'Get Feedback', desc: 'Receive real-time form analysis and movement tips' },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-brown-500/10 border-2 border-brown-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-bold text-brown-500 text-xl">{item.step}</span>
              </div>
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Movement Tips */}
      <div className="bg-cream-200/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
              Movement Tips
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Squat Form', tips: ['Keep chest up', 'Knees track over toes', 'Hip below parallel', 'Core engaged'] },
              { title: 'Running Form', tips: ['Midfoot strike', 'Cadence 170-180', 'Arms at 90°', 'Upright posture'] },
              { title: 'Landing Mechanics', tips: ['Bend knees on landing', 'Land softly', 'Even weight distribution', 'Core braced'] },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card>
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-3">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.tips.map((tip) => (
                      <li key={tip} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-olive-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card variant="panel" className="border-highlight-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-olive-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-olive-700 font-medium">Important Disclaimer</p>
              <p className="text-sm text-text-secondary mt-1">
                AthleteGuard AI provides educational movement feedback only. It does not generate medical diagnoses, 
                predict injury probability, or claim to calculate true biomechanical forces. Always consult a qualified 
                professional for medical advice.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-olive-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-muted text-sm">
            © 2026 AthleteGuard AI. Built for educational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
