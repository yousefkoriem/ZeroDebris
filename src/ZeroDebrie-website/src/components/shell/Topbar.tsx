'use client'
import { useEffect, useState } from 'react'
import { Command, Search } from 'lucide-react'
import { Kbd } from '@/components/atoms/Kbd'
import { ConnectionPing } from '@/components/molecules/ConnectionPing'
import { useUI } from '@/store/ui'
import { useTelemetry } from '@/store/telemetry'
import { fmtCairo } from '@/lib/format'

export function Topbar() {
  const setOpen    = useUI((s) => s.setCommandOpen)
  const eolMode    = useUI((s) => s.eolMode)
  const lastTickAt = useTelemetry((s) => s.lastTickAt)
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    setNow(new Date().toISOString())
    const id = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(id)
  }, [])

  const stale = lastTickAt && Date.now() - lastTickAt > 30_000

  return (
    <header className="flex items-center justify-between border-b border-border/40 bg-surface/80 backdrop-blur-md px-6 py-3">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted hover:text-fg"
      >
        <Search size={14} /> Quick command…
        <span className="flex items-center gap-1 ml-2">
          <Kbd><Command size={10} /></Kbd><Kbd>K</Kbd>
        </span>
      </button>
      <div className="flex items-center gap-4">
        {eolMode ? (
          <span className="text-danger-500 font-semibold tracking-wider animate-pulse font-mono text-xs">
            ⚠ EOL MODE ACTIVE
          </span>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-400" />
            {stale ? 'STALE' : 'CONNECTED'}
          </div>
        )}
        <div className="font-mono text-sm text-cyan-400 font-medium flex gap-4 min-w-[200px] justify-end">
          {now ? (
            <>
              <span>UTC {now.slice(11, 19)}</span>
              <span>Cairo {fmtCairo(now)}</span>
            </>
          ) : (
            <>
              <span>UTC --:--:--</span>
              <span>Cairo --:--:--</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
