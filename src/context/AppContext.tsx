import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type { PageType, SportType, UserSettings, Session, UserProfile } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants';
import { generateDemoSessions } from '../utils/demoData';

interface AppContextType {
  currentPage: PageType;
  navigate: (page: PageType) => void;
  selectedSport: SportType | null;
  selectSport: (sport: SportType) => void;
  clearSport: () => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  sessions: Session[];
  addSession: (session: Session) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  // Demo data mode
  demoMode: boolean;
  demoSessions: Session[];
  setDemoMode: (on: boolean) => void;
  loadDemoData: () => void;
  clearDemoData: () => void;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    } catch {
      return false;
    }
  });
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      const storedPage = localStorage.getItem('athlete-guard-page') as PageType | null;
      if (storedAuth && storedPage && storedPage !== 'login') {
        return storedPage;
      }
      return storedAuth ? 'dashboard' : 'login';
    } catch {
      return 'login';
    }
  });
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [realSessions, setRealSessions] = useState<Session[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return stored ? (JSON.parse(stored) as Session[]) : [];
    } catch {
      return [];
    }
  });
  const [demoSessions, setDemoSessions] = useState<Session[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DEMO_SESSIONS);
      return stored ? (JSON.parse(stored) as Session[]) : [];
    } catch {
      return [];
    }
  });
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
    } catch {
      return false;
    }
  });

  // Active dataset shown to Dashboard/Analytics/History
  const sessions = useMemo<Session[]>(
    () => (demoMode ? demoSessions : realSessions),
    [demoMode, demoSessions, realSessions]
  );

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(storedSettings) }));
      }
    } catch (error) {
      console.error('Failed to load app data:', error);
    }
  }, []);

  // Persist real sessions
  useEffect(() => {
    try {
      // Avoid overwriting existing storage during initial hydration issues; only persist if state changed meaningfully
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(realSessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }, [realSessions]);

  // Persist demo sessions
  useEffect(() => {
    try {
      if (demoSessions.length === 0) {
        localStorage.removeItem(STORAGE_KEYS.DEMO_SESSIONS);
      } else {
        localStorage.setItem(STORAGE_KEYS.DEMO_SESSIONS, JSON.stringify(demoSessions));
      }
    } catch (error) {
      console.error('Failed to save demo sessions:', error);
    }
  }, [demoSessions]);

  // Persist demo mode
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(demoMode));
    } catch {}
  }, [demoMode]);

  const navigate = useCallback((page: PageType) => {
    setCurrentPage(page);
    try {
      localStorage.setItem('athlete-guard-page', page);
    } catch {}
  }, []);

  const login = useCallback((email: string, name?: string) => {
    const profile: UserProfile = {
      email,
      name: name || (email.includes('@') ? email.split('@')[0] : 'Athlete'),
      loginTime: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      localStorage.setItem('athlete-guard-page', 'dashboard');
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
    setUser(profile);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem('athlete-guard-page');
    } catch (error) {
      console.error('Failed to clear user profile:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
    setSelectedSport(null);
    setCurrentPage('login');
  }, []);

  const selectSport = useCallback((sport: SportType) => {
    setSelectedSport(sport);
  }, []);

  const clearSport = useCallback(() => {
    setSelectedSport(null);
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return newSettings;
    });
  }, []);

  const addSession = useCallback((session: Session) => {
    // Real sessions always go to the real store, regardless of demo mode view.
    setRealSessions(prev => {
      // Avoid duplicates (e.g. StrictMode double-invoke or race conditions)
      if (prev.some(s => s.id === session.id)) {
        return prev;
      }
      const updated = [session, ...prev].slice(0, 100);
      try {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save session:', error);
      }
      return updated;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    if (demoMode) {
      setDemoSessions(prev => {
        const updated = prev.filter(s => s.id !== id);
        try {
          localStorage.setItem(STORAGE_KEYS.DEMO_SESSIONS, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to delete demo session:', error);
        }
        return updated;
      });
    } else {
      setRealSessions(prev => {
        const updated = prev.filter(s => s.id !== id);
        try {
          localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to delete session:', error);
        }
        return updated;
      });
    }
  }, [demoMode]);

  const clearAllSessions = useCallback(() => {
    if (demoMode) {
      setDemoSessions([]);
      try {
        localStorage.removeItem(STORAGE_KEYS.DEMO_SESSIONS);
      } catch {}
    } else {
      setRealSessions([]);
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      } catch {}
    }
  }, [demoMode]);

  const setDemoMode = useCallback((on: boolean) => {
    setDemoModeState(on);
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(on));
    } catch {}
  }, []);

  const loadDemoData = useCallback(() => {
    const data = generateDemoSessions();
    setDemoSessions(data);
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_SESSIONS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save demo sessions:', error);
    }
    setDemoModeState(true);
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
    } catch {}
  }, []);

  const clearDemoData = useCallback(() => {
    setDemoSessions([]);
    setDemoModeState(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.DEMO_SESSIONS);
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'false');
    } catch {}
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        selectedSport,
        selectSport,
        clearSport,
        settings,
        updateSettings,
        sessions,
        addSession,
        deleteSession,
        clearAllSessions,
        demoMode,
        demoSessions,
        setDemoMode,
        loadDemoData,
        clearDemoData,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}