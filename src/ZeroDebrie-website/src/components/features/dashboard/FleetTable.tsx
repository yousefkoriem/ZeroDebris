'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Card, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'

export function FleetTable() {
  const router = useRouter()
  const { data = [] } = useQuery({ queryKey: ['spacecraft'], queryFn: api.listSpacecraft })
  return (
    <Card className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-base font-semibold">Orbital Assets</CardTitle>
      </div>
      <table className="mt-3 w-full text-sm" aria-label="Orbital Assets">
        <thead>
          <tr className="border-b border-border text-muted text-xs uppercase tracking-wide">
            <th className="py-2 px-3 text-left">Spacecraft</th>
            <th className="py-2 px-3 text-left">Status</th>
            <th className="py-2 px-3 text-left">Mission ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr
              key={s.id}
              tabIndex={0}
              role="button"
              onClick={() => router.push(`/spacecraft/${s.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/spacecraft/${s.id}`) }}
              className="border-b border-border/50 even:bg-elevated/20 hover:bg-cyan-500/5 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
            >
              <td className="py-3 px-4">{s.name}</td>
              <td className="py-3 px-4">
                {s.status === 'NOMINAL' ? (
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    NOMINAL
                  </span>
                ) : s.status === 'WARNING' ? (
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    WARNING
                  </span>
                ) : (
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-border text-muted border border-border">
                    {s.status}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 font-mono text-xs text-muted">
                m{s.id.replace(/\D/g, '') || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
