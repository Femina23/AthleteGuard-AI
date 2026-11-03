import { useState, useCallback } from 'react';
import type { Session, SportType, MovementMetrics, MovementFlag } from '../types';
import { generateSessionId } from '../utils/calculations';

interface UseSessionManagerReturn {
  sessions: Session[];
  currentSession: Session | null;
  isRecording: boolean;
  startSession: (sport: SportType) => void;
  endSession: () => Session | null;
  updateMetrics: (metrics: Partial<MovementMetrics>) => void;
  addFlag: (flag: MovementFlag) => void;
  incrementRepCount: () => void;
  deleteSession: (id: string) => void;
  clearHistory: () => void;
}

export function useSessionManager(): UseSessionManagerReturn {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startSession = useCallback((sport: SportType) => {
    const now = Date.now();
    const newSession: Session = {
      id: generateSessionId(),
      sport,
      startTime: now,
      endTime: now,
      duration: 0,
      metrics: {},
      flags: [],
      repCount: 0,
    };

    setCurrentSession(newSession);
    setIsRecording(true);
  }, []);

  const endSession = useCallback((): Session | null => {
    if (!currentSession) return null;

    const endTime = Date.now();
    const completedSession: Session = {
      ...currentSession,
      endTime,
      duration: endTime - currentSession.startTime,
    };

    setCurrentSession(null);
    setIsRecording(false);

    return completedSession;
  }, [currentSession]);

  const updateMetrics = useCallback((metrics: Partial<MovementMetrics>) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        metrics: { ...prev.metrics, ...metrics },
      };
    });
  }, []);

  const addFlag = useCallback((flag: MovementFlag) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        flags: [...prev.flags, flag].slice(-50),
      };
    });
  }, []);

  const incrementRepCount = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        repCount: prev.repCount + 1,
      };
    });
  }, []);

  // No longer persists real sessions; retained for API compatibility (no-ops)
  const deleteSession = useCallback((_id: string) => {
    // Intentionally left as no-op. Real session deletion is handled by AppContext.
  }, []);

  const clearHistory = useCallback(() => {
    // Intentionally left as no-op. Real history clearing is handled by AppContext.
  }, []);

  return {
    sessions,
    currentSession,
    isRecording,
    startSession,
    endSession,
    updateMetrics,
    addFlag,
    incrementRepCount,
    deleteSession,
    clearHistory,
  };
}