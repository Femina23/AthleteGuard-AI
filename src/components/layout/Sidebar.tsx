import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Dumbbell, 
  Trophy, 
  Video, 
  Activity, 
  AlertTriangle, 
  History, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SPORT_CONFIGS } from '../../types';
import { Badge } from '../ui/Badge';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'sports-selection', label: 'Sports', icon: Dumbbell, href: '/sports-selection' },
  { id: 'live-monitoring', label: 'Live AI', icon: Video, href: '/live-monitoring' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'injury-risk', label: 'Movement Risk', icon: AlertTriangle, href: '/injury-risk' },
  { id: 'history', label: 'History', icon: History, href: '/history' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
] as const;

export function Sidebar() {
  const { currentPage, navigate, selectedSport, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: typeof currentPage) => {
    navigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 glass-panel p-2 rounded-xl"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="w-6 h-6 text-text-primary" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ x: mobileOpen ? -300 : 0 }}
          animate={{ x: mobileOpen ? 0 : (collapsed ? -80 : 0) }}
          exit={{ x: -300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`fixed lg:relative left-0 top-0 z-40 h-screen bg-cream-100/95 backdrop-blur-xl border-r border-olive-200/50 flex flex-col transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-72'
          } ${mobileOpen ? 'w-72' : ''}`}
          aria-label="Main navigation"
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-olive-200/50">
            <motion.div
              key={collapsed ? 'collapsed' : 'expanded'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brown-500 to-olive-500">
                <Dumbbell className="w-5 h-5 text-dark-950" />
              </div>
              {!collapsed && (
                <span className="font-display font-bold text-xl text-text-primary">AthleteGuard AI</span>
              )}
            </motion.div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden p-1 rounded-lg hover:bg-cream-200 text-text-muted hover:text-text-primary transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Navigation">
            <ul className="space-y-1" role="list">
              {navigationItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id as typeof currentPage)}
                      className={`w-full sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            {!collapsed && (
              <>
                <div className="my-4 border-t border-olive-200/50" />
                <div className="px-3 mb-2">
                  <p className="text-xs font-semibold text-olive-500 uppercase tracking-wider mb-3">Quick Sports</p>
                  <ul className="space-y-1" role="list">
                    {(Object.values(SPORT_CONFIGS) as Array<{ id: string; name: string; icon: string; gradient: string }>).map((sport) => (
                      <li key={sport.id}>
                        <button
                          onClick={() => {
                            navigate('live-monitoring');
                            // We'll need to handle sport selection differently
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-cream-200/50 transition-all duration-200 text-sm"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${sport.gradient}`}>
                            <span className="text-text-primary font-medium text-xs">{sport.icon}</span>
                          </div>
                          <span>{sport.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </nav>

          <div className="p-3 border-t border-olive-200/50 space-y-2">
            {!collapsed && (
              <div className="space-y-2">
                <Badge variant="primary" dot className="w-full justify-center">
                  AI Monitoring Ready
                </Badge>
                <div className="text-xs text-olive-500 text-center">
                  MediaPipe Pose Landmarker
                </div>
              </div>
            )}
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-red-700 hover:bg-red-500/10 rounded-xl transition-all duration-200 text-sm font-medium ${
                collapsed ? 'justify-center px-2' : ''
              }`}
              title="Sign Out of AthleteGuard AI"
            >
              <LogOut className="w-4 h-4 text-brown-500" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}
