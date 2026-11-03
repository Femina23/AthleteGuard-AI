import type { Session, SportType, MovementMetrics, MovementFlag } from '../types';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMetrics(sport: SportType, rng: () => number): MovementMetrics {
  if (sport === 'strength') {
    return {
      avgKneeAngle: 85 + rng() * 25,
      avgHipAngle: 80 + rng() * 25,
      avgAnkleAngle: 70 + rng() * 20,
      forwardLean: 10 + rng() * 25,
      symmetryScore: 2 + rng() * 12,
    };
  }
  if (sport === 'running') {
    return {
      cadence: 155 + rng() * 25,
      avgKneeAngle: 140 + rng() * 20,
      avgHipAngle: 165 + rng() * 15,
      avgAnkleAngle: 90 + rng() * 20,
      symmetryScore: 1 + rng() * 8,
    };
  }
  return {
    jumpCount: 4 + Math.floor(rng() * 12),
    landingQuality: 60 + rng() * 35,
    avgKneeAngle: 90 + rng() * 30,
    symmetryScore: 2 + rng() * 10,
  };
}

function buildFlags(sport: SportType, rng: () => number, startTime: number): MovementFlag[] {
  const pool =
    sport === 'strength'
      ? [
          { type: 'info' as const, category: 'Depth', message: 'Good squat depth achieved', joint: 'knee', angle: 88, threshold: 90 },
          { type: 'warning' as const, category: 'Posture', message: 'Excessive forward lean detected (32.4°). Keep chest up.', joint: 'torso', angle: 32, threshold: 45 },
          { type: 'warning' as const, category: 'Symmetry', message: 'Asymmetric movement detected (12.1° difference). Distribute weight evenly.', joint: 'knee', angle: 12, threshold: 15 },
          { type: 'info' as const, category: 'Form', message: 'No movement flags detected' },
        ]
      : sport === 'running'
      ? [
          { type: 'info' as const, category: 'Form', message: 'No movement flags detected' },
          { type: 'warning' as const, category: 'Symmetry', message: 'Stride asymmetry detected (14.2° difference).', joint: 'knee', angle: 14, threshold: 15 },
          { type: 'warning' as const, category: 'Knee Extension', message: 'Excessive knee extension (125.0°). Increase knee flexion.', joint: 'left_knee', angle: 125, threshold: 120 },
        ]
      : [
          { type: 'info' as const, category: 'Form', message: 'No movement flags detected' },
          { type: 'warning' as const, category: 'Landing Mechanics', message: 'Insufficient knee flexion on landing (62.0°). Bend knees more to absorb impact.', joint: 'knee', angle: 62, threshold: 70 },
          { type: 'warning' as const, category: 'Landing Symmetry', message: 'Asymmetric landing detected (11.5° difference). Land evenly on both feet.', joint: 'knee', angle: 11.5, threshold: 10 },
        ];

  const count = Math.floor(rng() * 4); // 0-3 flags
  const flags: MovementFlag[] = [];
  for (let f = 0; f < count; f++) {
    const p = pool[Math.floor(rng() * pool.length)];
    flags.push({
      id: `demo-flag-${startTime}-${f}`,
      type: p.type,
      category: p.category,
      message: p.message,
      joint: p.joint,
      angle: p.angle,
      threshold: p.threshold,
      timestamp: startTime + f * 60000,
    });
  }
  if (flags.length === 0) {
    flags.push({ id: `demo-flag-${startTime}-ok`, type: 'info', category: 'Form', message: 'No movement flags detected', timestamp: startTime });
  }
  return flags;
}

export function generateDemoSessions(now: number = Date.now()): Session[] {
  const rng = mulberry32(20261023);
  const sports: SportType[] = ['strength', 'running', 'basketball'];
  const total = 22;
  const sessions: Session[] = [];
  for (let i = 0; i < total; i++) {
    const sport = sports[i % 3];
    const dayOffset = Math.floor((i / total) * 28) + (i % 3);
    const startTime = now - (29 - dayOffset) * 86400000 - Math.floor(rng() * 3600000 * 6);
    const durationMin = 8 + Math.floor(rng() * 35);
    const duration = durationMin * 60000;
    const endTime = startTime + duration;
    const repCount =
      sport === 'strength' ? 12 + Math.floor(rng() * 24) : sport === 'running' ? 0 : 4 + Math.floor(rng() * 12);
    sessions.push({
      id: `demo_session_${i}_${sport}`,
      sport,
      startTime,
      endTime,
      duration,
      metrics: buildMetrics(sport, rng),
      flags: buildFlags(sport, rng, startTime),
      repCount,
    });
  }
  return sessions.sort((a, b) => b.startTime - a.startTime);
}