import type { Session, UserSettings } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../constants';
export function loadSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function getSessionStats(sessions: Session[]) {
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalReps = sessions.reduce((sum, s) => sum + s.repCount, 0);
  
  const sportDistribution = sessions.reduce((acc, s) => {
    acc[s.sport] = (acc[s.sport] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalFlags = sessions.reduce((sum, s) => sum + s.flags.filter(f => f.type === 'warning').length, 0);

  return {
    totalSessions,
    totalDuration,
    totalReps,
    sportDistribution,
    totalFlags,
    avgSessionDuration: totalSessions > 0 ? totalDuration / totalSessions : 0,
  };
}

export function getSportSessions(sessions: Session[], sport: Session['sport']): Session[] {
  return sessions.filter(s => s.sport === sport);
}

export function getRecentSessions(sessions: Session[], count: number = 10): Session[] {
  return sessions.slice(0, count);
}

export function getSessionsByDateRange(sessions: Session[], startDate: number, endDate: number): Session[] {
  return sessions.filter(s => s.startTime >= startDate && s.startTime <= endDate);
}