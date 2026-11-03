import { motion } from 'framer-motion';
import { Sun, Moon, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function Header() {
  const { currentPage, navigate, settings, updateSettings, logout, user } = useApp();
  const { settings: localSettings } = useSettings();

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    landing: { title: 'Welcome to AthleteGuard AI', subtitle: 'Your AI-powered sports performance companion' },
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your training progress' },
    'sports-selection': { title: 'Select Sport', subtitle: 'Choose your activity for AI monitoring' },
    'live-monitoring': { title: 'Live AI Monitoring', subtitle: 'Real-time pose detection and form analysis' },
    analytics: { title: 'Performance Analytics', subtitle: 'Detailed insights into your movement patterns' },
    'injury-risk': { title: 'Movement Risk Awareness', subtitle: 'Understand your movement patterns' },
    history: { title: 'Session History', subtitle: 'Review your past training sessions' },
    settings: { title: 'Settings', subtitle: 'Configure your preferences' },
  };

  const pageInfo = pageTitles[currentPage] || pageTitles.landing;

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-olive-200/50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:block"
            >
              <h1 className="font-display font-bold text-xl text-text-primary">
                {pageInfo.title}
              </h1>
              <p className="text-sm text-text-muted">{pageInfo.subtitle}</p>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              aria-label={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button variant="ghost" size="sm" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="primary" dot size="sm">
                AI Active
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-text-secondary hover:text-text-primary gap-1.5"
              title="Sign Out of AthleteGuard AI"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Sign Out</span>
            </Button>

            <div className="relative">
              <button 
                onClick={logout}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-cream-200 transition-colors"
                title="Account / Sign out"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brown-500 to-olive-500 flex items-center justify-center text-cream-100 font-medium text-xs">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AG'}
                </div>
                <span className="hidden md:block text-sm font-medium text-text-primary">
                  {user?.name || user?.email?.split('@')[0] || 'Athlete'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}