'use client'
import { FileText, Download } from 'lucide-react'
import { Card, CardTitle } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { RoleGate } from '@/components/RoleGate'

type Report = { id: string; title: string; date: string; size: string; href: string }

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })

const DAY = 86_400_000

const STATIC_REPORTS: Report[] = [
  {
    id: 'r1',
    title: 'Orbit Lifetime Report',
    date: fmtDate(new Date()),
    size: '2.4 MB · PDF',
    href: '/api/reports/mission-day',
  },
  {
    id: 'r2',
    title: 'Debris Conjunction Assessment',
    date: fmtDate(new Date(Date.now() - DAY)),
    size: '1.1 MB · PDF',
    href: '/api/reports/mission-day',
  },
  {
    id: 'r3',
    title: 'EOL Compliance Report — IADC 25yr',
    date: fmtDate(new Date(Date.now() - 3 * DAY)),
    size: '890 KB · PDF',
    href: '/api/reports/mission-day',
  },
]

export default function ReportsPage() {
  const downloadPdf = () => { window.location.href = '/api/reports/mission-day' }
  const downloadCsv = () => { window.location.href = '/api/reports/telemetry-csv?id=eo-1' }

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted mt-1">Access historic mission data and generate logs.</p>
      </header>

      {/* ── Recent reports (static) ── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-4">Recent reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATIC_REPORTS.map((r) => (
            <div key={r.id} className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <FileText size={24} className="text-cyan-400" aria-hidden />
                  <span className="text-xs font-medium uppercase tracking-wide bg-surface border border-border rounded-full px-2 py-0.5 text-muted">PDF</span>
                </div>
                <h3 className="font-semibold text-base mt-3">{r.title}</h3>
                <p className="text-xs text-muted mt-1 font-mono">{r.date} · {r.size}</p>
              </div>
              <div className="border-t border-border/40 mt-4 pt-4">
                <a href={r.href} className="block w-full">
                  <Button variant="secondary" className="w-full justify-center gap-2">
                    <Download size={14} /> Download
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Generate new ── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted mb-4">Generate new</h2>
        <RoleGate
          perm="report.generate"
          fallback={<p className="text-muted text-sm">You don't have permission to generate reports.</p>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 transition">
              <div className="flex items-start justify-between">
                <FileText size={24} className="text-cyan-400" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide bg-surface border border-border rounded-full px-2 py-0.5 text-muted">PDF</span>
              </div>
              <h3 className="font-semibold text-base mt-3">Mission day</h3>
              <p className="my-2 text-sm text-muted">Operator log + KPIs + alerts for the last 24 h.</p>
              <div className="border-t border-border/40 mt-4 pt-4">
                <Button onClick={downloadPdf} className="w-full justify-center">Generate PDF</Button>
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 transition">
              <div className="flex items-start justify-between">
                <FileText size={24} className="text-cyan-400" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide bg-surface border border-border rounded-full px-2 py-0.5 text-muted">CSV</span>
              </div>
              <h3 className="font-semibold text-base mt-3">Telemetry</h3>
              <p className="my-2 text-sm text-muted">100-row sample window. Signed-URL extension for production.</p>
              <div className="border-t border-border/40 mt-4 pt-4">
                <Button variant="secondary" onClick={downloadCsv} className="w-full justify-center gap-2">
                  <Download size={14} /> Download CSV
                </Button>
              </div>
            </div>
          </div>
        </RoleGate>
      </section>
    </div>
  )
}
