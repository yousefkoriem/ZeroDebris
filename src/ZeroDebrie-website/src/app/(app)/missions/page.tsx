import { ListChecks } from 'lucide-react'
import { Card, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/lib/utils'

type MissionStatus = 'ACTIVE' | 'SCHEDULED' | 'STANDBY'
type Mission = {
  id: string
  name: string
  description: string
  status: MissionStatus
  startsAt: string
}

const MISSIONS: Mission[] = [
  {
    id: 'eo-main',
    name: 'Earth Observation Main',
    description: 'Hi-res multispectral imaging · 2m GSD',
    status: 'ACTIVE',
    startsAt: '2025-09-12T00:00:00Z',
  },
  {
    id: 'nile-ndvi',
    name: 'Nile Delta NDVI',
    description: 'Agricultural vegetation index monitoring',
    status: 'ACTIVE',
    startsAt: '2025-09-20T03:15:00Z',
  },
  {
    id: 'suez',
    name: 'Suez Canal Monitoring',
    description: 'Shipping lane congestion & anomaly detection',
    status: 'SCHEDULED',
    startsAt: '2025-10-05T08:00:00Z',
  },
  {
    id: 'disaster',
    name: 'Disaster Response Imaging',
    description: 'Rapid response flood & fire mapping protocol',
    status: 'STANDBY',
    startsAt: '2025-09-15T00:00:00Z',
  },
]

const tone = (s: MissionStatus): 'success' | 'info' | 'warning' =>
  s === 'ACTIVE' ? 'success' : s === 'SCHEDULED' ? 'info' : 'warning'

export default function MissionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Missions</h1>
        <p className="text-sm text-muted mt-1">Manage active and scheduled observation protocols.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MISSIONS.map((m) => (
          <div key={m.id} className={cn(
            "rounded-xl border p-5 cursor-pointer transition flex flex-col justify-between group",
            m.status === 'ACTIVE' ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500" :
            m.status === 'SCHEDULED' ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500" :
            "border-border/60 bg-surface hover:border-cyan-500/40 hover:bg-elevated/60"
          )}>
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted">{m.description}</p>
                </div>
                <div className={cn("rounded-full px-2 py-0.5 text-xs font-medium border",
                  m.status === 'ACTIVE' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                  m.status === 'SCHEDULED' ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  "bg-surface border-border text-muted"
                )}>
                  {m.status}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">
                Start · {new Date(m.startsAt).toISOString().replace('T', ' ').slice(0, 16)} UTC
              </span>
              <span className="text-muted group-hover:text-cyan-400 transition-colors">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
