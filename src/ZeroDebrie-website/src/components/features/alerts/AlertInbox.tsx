'use client'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { toast } from '@/components/molecules/Toast'
import { SEEDED_ALERTS } from '@/lib/alerts/seed'
import { useAlerts } from '@/store/alerts'
import type { Alert } from '@/schemas/alert'
import { cn } from '@/lib/utils'

const SEV: Record<string, number> = { CRITICAL: 0, critical: 0, WARNING: 1, warning: 1, INFO: 2, info: 2 }

export function AlertInbox() {
  const qc = useQueryClient()
  const { data: live = [] } = useQuery({ queryKey: ['alerts'], queryFn: api.listAlerts })
  const realtime = useAlerts((s) => s.alerts)

  const all: Alert[] = useMemo(() => {
    const merged = [...SEEDED_ALERTS, ...live, ...realtime]
    const seen = new Set<string>()
    return merged
      .filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)))
      .sort((a, b) => {
        const dSev = (SEV[a.severity] ?? 0) - (SEV[b.severity] ?? 0)
        if (dSev !== 0) return dSev
        const tB = b.createdAt ? new Date(b.createdAt).getTime() : (b.timestamp || 0)
        const tA = a.createdAt ? new Date(a.createdAt).getTime() : (a.timestamp || 0)
        return tB - tA
      })
  }, [live, realtime])

  const ack = useMutation({
    mutationFn: api.ackAlert,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Alert acknowledged')
    },
  })

  const sevTone = (s: Alert['severity']): 'danger' | 'warning' | 'info' =>
    s === 'critical' ? 'danger' : s === 'warning' ? 'warning' : 'info'

  return (
    <Card className="rounded-xl border border-border/60 bg-surface p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">{all.length} alerts</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {all.map((a) => (
          <li key={a.id} className={cn("flex items-start justify-between gap-4 py-4 px-5 rounded-lg border-l-4 border-y border-r border-y-border border-r-border",
            a.severity === 'critical' || a.severity === 'CRITICAL' ? "bg-red-500/10 border-l-red-500" :
            a.severity === 'warning' || a.severity === 'WARNING' ? "bg-amber-500/10 border-l-amber-500" :
            "bg-surface border-l-cyan-500/40 border-y-border/40 border-r-border/40"
          )}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium border",
                  a.severity === 'critical' || a.severity === 'CRITICAL' ? "bg-red-500/20 text-red-400 border-red-500/40" :
                  a.severity === 'warning' || a.severity === 'WARNING' ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                  "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                )}>
                  {a.severity.toUpperCase()}
                </span>
              </div>
              <div className="font-medium text-sm text-fg">{a.title}</div>
              <p className="mt-0.5 text-xs text-muted">{a.description}</p>
              {typeof a.collisionProbability === 'number' && (
                <p className="mt-1 font-mono text-xs text-muted">
                  Pc {a.collisionProbability.toExponential(2)}
                  {typeof a.missDistanceKm === 'number' && ` · miss ${a.missDistanceKm} km`}
                </p>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <div className="text-xs text-muted whitespace-nowrap font-mono">
                {new Date(a.createdAt || a.timestamp || 0).toLocaleString()}
              </div>
              {a.acknowledgedAt
                ? <span className="text-xs text-success-500 bg-success-500/10 border border-success-500/30 px-2 py-0.5 rounded-full font-medium">Acked</span>
                : <Button size="sm" variant="secondary" onClick={() => ack.mutate(a.id)}>
                    Acknowledge
                  </Button>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
