'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity, Globe2, ListChecks, AlertTriangle, FileBarChart,
  Settings, Satellite, Leaf,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard',        label: 'Dashboard',       icon: Activity },
  { href: '/spacecraft',       label: 'Orbital Assets',  icon: Satellite },     // ← renamed
  { href: '/missions',         label: 'Missions',        icon: ListChecks },
  { href: '/sustainability',   label: 'Sustainability',  icon: Leaf },          // ← NEW
  { href: '/alerts',           label: 'Alerts',          icon: AlertTriangle },
  { href: '/map',              label: 'Orbit View',      icon: Globe2 },
  { href: '/reports',          label: 'Reports',         icon: FileBarChart },
  { href: '/settings/profile', label: 'Settings',        icon: Settings },
] as const

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="glass m-3 rounded-xl p-3 flex flex-col gap-1 min-h-[calc(100vh-1.5rem)]">
      <div className="py-5 px-4 mb-2 border-b border-border/40">
        <span className="text-cyan-400 font-bold tracking-widest text-sm">OBSERVER-1</span>
      </div>
      {nav.map(({ href, label, icon: I }) => {
        const active = path?.startsWith(href)
        const isSustainability = href === '/sustainability'
        const isSettings = href === '/settings/profile'
        return (
          <React.Fragment key={href}>
            {(isSustainability || isSettings) && (
              <div className="border-t border-border/40 my-3" />
            )}
            <Link
              href={href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm transition border border-transparent',
                active
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
                  : 'text-muted hover:text-fg hover:bg-elevated/60',
              )}
            >
              <I size={16} className="mr-3" aria-hidden /> {label}
            </Link>
          </React.Fragment>
        )
      })}
    </aside>
  )
}
