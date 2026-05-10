'use client'
import { useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'
import { Card, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/molecules/Modal'
import { useUI } from '@/store/ui'
import { useAlerts } from '@/store/alerts'
import type { Alert } from '@/schemas/alert'
import { cn } from '@/lib/utils'

// ── Section 1 helper ──
function Gauge({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 56
  const c = 2 * Math.PI * r
  const dash = (value / 100) * c
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 160 160" className="w-40 h-40" role="img" aria-label={`${label} ${value}%`}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="#1F2937" strokeWidth="12" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 80 80)"
          className="transition-all duration-1000 ease-out"
        />
        <text x="80" y="88" textAnchor="middle" className="font-mono fill-fg text-3xl font-bold">
          {value}%
        </text>
      </svg>
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
    </div>
  )
}

// ── Section 4 helper ──
function Stepper() {
  const stages = [
    { id: 'launch',  label: 'LAUNCH',              done: true,  current: false },
    { id: 'ops',     label: 'MISSION OPS',         done: true,  current: true  },
    { id: 'deorbit', label: 'DEORBIT BURN',        done: false, current: false },
    { id: 'burnup',  label: 'ATMOSPHERIC BURN-UP', done: false, current: false },
  ]
  return (
    <div className="flex items-start justify-between w-full">
      {stages.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
              s.current ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" :
              s.done ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" :
              "border-border bg-surface text-muted"
            )}>
              {s.done ? '✓' : i + 1}
            </div>
            <span className={cn(
              "text-xs text-center mt-2 max-w-[80px] font-medium uppercase tracking-wide",
              (s.current || s.done) ? "text-cyan-400" : "text-muted"
            )}>
              {s.label}
            </span>
          </div>
          {i < stages.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-2 -mt-6 transition-colors duration-300",
              s.done ? "bg-cyan-500" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── EOL countdown ──
function CountdownTimer({ from }: { from: number }) {
  const [remaining, setRemaining] = useState(from)
  useEffect(() => {
    const id = setInterval(() => setRemaining((v) => Math.max(0, v - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = Math.floor(remaining / 3600).toString().padStart(2, '0')
  const m = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0')
  const s = (remaining % 60).toString().padStart(2, '0')
  return (
    <span className="font-mono text-2xl text-danger-500 animate-pulse" aria-live="polite">
      T-{h}:{m}:{s}
    </span>
  )
}

export default function SustainabilityPage() {
  const eolMode    = useUI((s) => s.eolMode)
  const setEOLMode = useUI((s) => s.setEOLMode)
  const addAlert   = useAlerts((s) => s.addAlert)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const lastCheck = new Date(Date.now()).toISOString().slice(11, 19)
  const nextCheck = new Date(Date.now() + 6 * 3_600_000).toISOString().slice(11, 19)

  const fireEOL = () => {
    setEOLMode(true)
    setConfirmOpen(false)
    const now = new Date().toISOString()
    const base = { acknowledgedBy: null, acknowledgedAt: null }
    const events: Alert[] = [
      {
        id: crypto.randomUUID(), createdAt: now,
        severity: 'critical', source: 'manual',
        title: 'EOL Sequence Initiated',
        description: 'Operator-confirmed end-of-life maneuver started.',
        ...base,
      },
      {
        id: crypto.randomUUID(), createdAt: now,
        severity: 'warning', source: 'subsystem',
        title: 'Deorbit burn scheduled T-71:59:00',
        description: 'Final retrograde burn on next perigee pass.',
        ...base,
      },
      {
        id: crypto.randomUUID(), createdAt: now,
        severity: 'info', source: 'subsystem',
        title: 'Passivation venting complete',
        description: 'Residual propellant vented · batteries safed.',
        ...base,
      },
    ]
    events.forEach(addAlert)
  }

  const wrapperClass =
    'flex flex-col gap-6 ' +
    (eolMode ? 'border-2 border-danger-500 rounded-xl p-4 animate-pulse shadow-glow-danger' : '')

  return (
    <div className={wrapperClass}>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf size={20} className="text-success-500" />
          <h1 className="text-xl font-semibold">Sustainability Center</h1>
        </div>
        {eolMode && <CountdownTimer from={72 * 3600} />}
      </header>

      {/* ── Section 1 · Fuel Reserve Gauge ── */}
      <Card className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Fuel reserve allocation</h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-6 place-items-center">
          <Gauge value={20} color="#00D4FF" label="Operational" />
          <Gauge value={80} color="#F59E0B" label="EOL Reserve" />
        </div>
      </Card>

      {/* ── Section 2 · Orbit Lifetime ── */}
      <Card className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Orbit lifetime</h2>
        </div>
        <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Current altitude</dt>
            <dd className="text-sm font-mono font-medium text-fg">598.5 km</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Predicted reentry</dt>
            <dd className="text-sm font-mono font-medium text-fg">1.8 years</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">IADC 25-yr rule</dt>
            <dd><Badge tone="success" dot>PASS</Badge></dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Drag coefficient</dt>
            <dd className="text-sm font-mono font-medium text-fg">2.2</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0 md:border-b-0">
            <dt className="text-sm text-muted">Solar flux index (F10.7)</dt>
            <dd className="text-sm font-mono font-medium text-fg">150</dd>
          </div>
        </dl>
      </Card>

      {/* ── Section 3 · Debris Mitigation Status ── */}
      <Card className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Debris mitigation status</h2>
        </div>
        <dl className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Collision probability</dt>
            <dd className="text-sm font-mono font-medium text-success-500">1.2 × 10⁻⁷</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Autonomous avoidance</dt>
            <dd><Badge tone="success" dot>ACTIVE</Badge></dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Passivation status</dt>
            <dd><Badge tone="success" dot>READY</Badge></dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
            <dt className="text-sm text-muted">Last conjunction check</dt>
            <dd className="text-sm font-mono font-medium text-fg">{lastCheck} UTC</dd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0 md:border-b-0">
            <dt className="text-sm text-muted">Next scheduled check</dt>
            <dd className="text-sm font-mono font-medium text-fg">{nextCheck} UTC (+6h)</dd>
          </div>
        </dl>
      </Card>

      {/* ── Section 4 · EOL Timeline ── */}
      <Card className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">End-of-Life timeline</h2>
        </div>
        <div className="mt-6"><Stepper /></div>
      </Card>

      {/* ── Section 5 · Initiate EOL ── */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={eolMode}
          className="w-full py-4 rounded-xl border-2 border-red-500/60 bg-red-500/10 text-red-400 font-bold text-lg uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {eolMode && <span className="animate-pulse w-3 h-3 rounded-full bg-red-400" />}
          INITIATE EOL SEQUENCE
        </button>
      </div>

      <Modal open={confirmOpen} onOpenChange={setConfirmOpen}>
        <div className="p-1">
          <div className="mb-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-fg">⚠️ Confirm EOL sequence</h2>
          </div>
        <p className="text-sm text-muted">
          <strong className="text-danger-500">WARNING:</strong> This will begin the deorbit sequence.
          Egypt Observer-1 will perform its final retrograde burn within 72 hours and atmospheric
          burn-up will follow. This action is <strong>irreversible</strong>.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={fireEOL}>Confirm · Initiate</Button>
        </div>
        </div>
      </Modal>
    </div>
  )
}
