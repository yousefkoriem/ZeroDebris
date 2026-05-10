import type { Alert } from '@/schemas/alert'

const HOUR = 3_600_000

export const SEEDED_ALERTS: Alert[] = [
  {
    id: 'seed-conj-1',
    createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    severity: 'critical',
    source: 'acas',
    title: 'Conjunction Warning: COSMOS-1408 fragment approaching',
    description: 'Probability: 1.2×10⁻⁶ · Avoidance maneuver scheduled T-4h',
    collisionProbability: 1.2e-6,
    missDistanceKm: 0.4,
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    id: 'seed-fuel-1',
    createdAt: new Date(Date.now() - 5 * HOUR).toISOString(),
    severity: 'warning',
    source: 'subsystem',
    title: 'Fuel reserve below 25% operational threshold',
    description: 'Current: 22.1% · EOL reserve protected · No action required',
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    id: 'seed-aos-1',
    createdAt: new Date().toISOString(),
    severity: 'info',
    source: 'subsystem',
    title: 'AOS Acquired · Ground station CAIRO-1',
    description: 'Telemetry stream open · expected pass duration 11m 24s',
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
  {
    id: 'seed-ndvi-1',
    createdAt: new Date(Date.now() - 3 * HOUR).toISOString(),
    severity: 'info',
    source: 'subsystem',
    title: 'NDVI pass complete · 1,240 km² processed',
    description: 'Nile Delta sector · imagery routed to processing pipeline',
    acknowledgedBy: null,
    acknowledgedAt: null,
  },
]
