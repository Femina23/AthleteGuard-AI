import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  BarChart3, 
  Dumbbell, 
  Activity, 
  Trophy, 
  Video, 
  AlertTriangle, 
  History, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'sports-selection', label: 'Sports', icon: Dumbbell },
  { id: 'live-monitoring', label: 'Live AI', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'injury-risk', label: 'Movement', icon: AlertTriangle },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function TopNav() {
  const { currentPage, navigate, isAuthenticated, logout, user, demoMode, demoSessions, loadDemoData, setDemoMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ivory-100/90 backdrop-blur-md border-b border-olive-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-brown-500 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-cream-100" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">AthleteGuard AI</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-brown-500 text-cream-100' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-cream-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            {isAuthenticated ? (
              <div className="flex items-center ml-2 pl-2 border-l border-olive-200/50 gap-2">
                <button
                  onClick={() => {
                    if (demoSessions.length === 0) {
                      loadDemoData();
                    } else {
                      setDemoMode(!demoMode);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    demoMode
                      ? 'bg-amber-500/20 text-amber-900 border-amber-500/40 shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-cream-200 border-olive-300/40'
                  }`}
                  title={demoMode ? 'Click to disable Demo View' : 'Click to load simulated demo data'}
                >
                  <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-amber-500 animate-pulse' : 'bg-olive-400'}`} />
                  <span>{demoMode ? 'Demo Mode: ON' : 'Load Demo'}</span>
                </button>
                <span className="text-xs text-text-secondary font-medium hidden lg:inline max-w-[120px] truncate" title={user?.email}>
                  {user?.name || user?.email?.split('@')[0] || 'Athlete'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-brown-500 hover:text-brown-600 hover:bg-brown-500/10 border border-brown-500/30 transition-colors shadow-sm"
                  title="Sign Out of AthleteGuard AI"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold bg-brown-500 hover:bg-brown-600 text-cream-100 transition-colors shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-cream-200 text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-ivory-100 border-t border-olive-200/50 px-4 py-3 space-y-1">
          {isAuthenticated && (
            <button
              onClick={() => {
                if (demoSessions.length === 0) {
                  loadDemoData();
                } else {
                  setDemoMode(!demoMode);
                }
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium border mb-2 transition-all ${
                demoMode
                  ? 'bg-amber-500/20 text-amber-900 border-amber-500/40'
                  : 'text-text-secondary border-olive-200/50 hover:bg-cream-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-amber-500 animate-pulse' : 'bg-olive-400'}`} />
                Demo Data Mode
              </span>
              <span className="text-xs font-semibold">{demoMode ? 'Active (Click to Turn Off)' : 'Disabled (Click to Activate)'}</span>
            </button>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.id as any); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-brown-500 text-cream-100' : 'text-text-secondary hover:bg-cream-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-olive-200/50">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Sign Out ({user?.name || user?.email || 'Athlete'})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('login');
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-brown-500 text-cream-100 transition-all"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}