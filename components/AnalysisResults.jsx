'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const stripMarkdown = (t) =>
  t.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')

const SEV = {
  fix:  { color: 'var(--danger)',  raw: '#f87171', bg: 'rgba(248,113,113,0.06)', label: 'Fix'     },
  warn: { color: 'var(--warn)',    raw: '#fb923c', bg: 'rgba(251,146,60,0.06)',  label: 'Warning' },
  ok:   { color: 'var(--success)', raw: '#4ade80', bg: 'rgba(74,222,128,0.06)', label: 'Good'    },
}

/* ─── Compact Score Ring (for dashboard header) ─── */
function ScoreRing({ score }) {
  const [drawn, setDrawn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 120); return () => clearTimeout(t) }, [])

  const r     = 52
  const circ  = 2 * Math.PI * r
  const offset = drawn ? circ - (score / 100) * circ : circ
  const raw   = score >= 85 ? '#e9b94c' : score >= 70 ? '#4ade80' : score >= 40 ? '#fb923c' : '#f87171'
  const verdict = score >= 85 ? 'Strong Match' : score >= 70 ? 'Good Match' : score >= 40 ? 'Needs Work' : 'Poor Match'

  return (
    <div className="flex items-center gap-5">
      {/* Ring */}
      <div className="relative shrink-0">
        <div className="absolute inset-[-10px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${raw}22 0%, transparent 70%)`,
            opacity: drawn ? 1 : 0, transition: 'opacity 0.6s ease',
            animation: drawn ? 'glowPulse 2.4s ease-in-out infinite' : 'none',
          }} />
        <svg width="136" height="136" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="8" />
          <circle cx="68" cy="68" r={r}
            fill="none" stroke={raw} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 68 68)"
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.4, 0.64, 1)' }} />
          <text x="68" y="62" textAnchor="middle" fontSize="34" fontWeight="700"
            fill="var(--foreground)" fontFamily="var(--font-display, Georgia), serif"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}>
            {score}
          </text>
          <text x="68" y="80" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
            / 100
          </text>
        </svg>
      </div>
      {/* Score label */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-muted-foreground/60">
          ATS Match Score
        </p>
        <Badge variant="outline" className="font-bold rounded-full w-fit text-sm px-3 py-0.5"
          style={{ color: raw, background: raw + '18', borderColor: raw + '35' }}>
          {verdict}
        </Badge>
        <p className="text-xs text-muted-foreground/60">
          {score >= 85 ? 'Excellent keyword alignment'
            : score >= 70 ? 'Good alignment, a few gaps'
            : score >= 40 ? 'Several keywords missing'
            : 'Major keyword gaps found'}
        </p>
      </div>
    </div>
  )
}

/* ─── CopyButton ─── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button variant="outline" size="sm"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="shrink-0 h-8 text-xs font-semibold border-border transition-all"
      style={copied ? { borderColor: 'rgba(74,222,128,0.4)', color: 'var(--success)', background: 'rgba(74,222,128,0.08)' } : {}}>
      {copied ? '✓ Copied' : 'Copy'}
    </Button>
  )
}

/* ─── Section header ─── */
function SectionTitle({ children, count, countColor, sub }) {
  return (
    <div className="flex items-start justify-between mb-5 gap-4">
      <div className="flex items-center gap-3">
        {/* Amber accent bar */}
        <div className="w-1 h-6 rounded-full shrink-0" style={{ background: countColor ?? 'var(--gold)' }} />
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-bold tracking-tight">{children}</h2>
            {count != null && (
              <Badge variant="outline" className="text-[0.7rem] font-bold rounded-full"
                style={{ color: countColor, background: countColor + '18', borderColor: countColor + '30' }}>
                {count}
              </Badge>
            )}
          </div>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

/* ─── AnalysisResults ─── */
export default function AnalysisResults({ result }) {
  if (!result) return null

  const matched = result.keywords?.matched ?? []
  const missing = result.keywords?.missing ?? []

  return (
    <div className="flex flex-col gap-10">

      {/* ══ 1. DASHBOARD HEADER — Score + Keywords in one horizontal band ══ */}
      <Card className="border-border/70 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-row divide-x divide-border/50">

            {/* Score ring */}
            <div className="flex items-center justify-center px-8 py-7 lg:w-72 shrink-0">
              <ScoreRing score={result.score} />
            </div>

            {/* Keyword columns */}
            <div className="flex flex-1 divide-x divide-border/50 min-w-0">

              {/* Matched */}
              <div className="flex-1 p-5 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Matched
                  </p>
                  <Badge variant="outline" className="text-[0.68rem] font-bold rounded-full"
                    style={{ color: 'var(--success)', background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.25)' }}>
                    {matched.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matched.map((kw, i) => (
                    <span key={kw} className="anim-chip" style={{ animationDelay: `${i * 30}ms` }}>
                      <Badge variant="outline" className="text-[0.7rem] font-medium rounded-full cursor-default"
                        style={{ color: 'var(--success)', background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.18)' }}>
                        {kw}
                      </Badge>
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div className="flex-1 p-5 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Missing
                  </p>
                  <Badge variant="outline" className="text-[0.68rem] font-bold rounded-full"
                    style={{ color: 'var(--danger)', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.25)' }}>
                    {missing.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map((kw, i) => (
                    <span key={kw} className="anim-chip" style={{ animationDelay: `${i * 30}ms` }}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-[0.7rem] font-medium rounded-full cursor-default"
                            style={{ color: 'var(--danger)', background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.18)' }}>
                            {kw}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs border-border"
                          style={{ background: 'var(--card)', color: 'var(--foreground)' }}>
                          Add &quot;{kw}&quot; to your resume
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══ 2. REWRITES — hero section, most prominent ══ */}
      {result.rewrites?.length > 0 && (
        <div>
          <SectionTitle
            count={result.rewrites.length}
            countColor="var(--success)"
            sub="Copy and paste these directly into your resume"
          >
            Suggested Rewrites
          </SectionTitle>

          <div className="flex flex-col gap-5">
            {result.rewrites.map((rw, i) => (
              <Card key={i} className="border-border/70 overflow-hidden">
                <div className="flex flex-row divide-x divide-border/40">
                  {/* Before — left half */}
                  <div className="flex-1 px-5 py-5 min-w-0"
                    style={{ background: 'rgba(248,113,113,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[0.62rem] font-black tracking-[0.12em] uppercase"
                        style={{ color: 'var(--danger)' }}>Before</span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(248,113,113,0.14)' }} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stripMarkdown(rw.original)}
                    </p>
                  </div>

                  {/* After — right half */}
                  <div className="flex-1 px-5 py-5 min-w-0 flex flex-col"
                    style={{ background: 'rgba(74,222,128,0.05)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[0.62rem] font-black tracking-[0.12em] uppercase"
                        style={{ color: 'var(--success)' }}>After</span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(74,222,128,0.14)' }} />
                      <CopyButton text={stripMarkdown(rw.rewritten)} />
                    </div>
                    <p className="text-[0.9375rem] text-foreground/95 leading-relaxed font-medium flex-1">
                      {stripMarkdown(rw.rewritten)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══ 3. INSIGHTS ══ */}
      {result.insights?.length > 0 && (
        <div>
          <SectionTitle count={result.insights.length} countColor="var(--gold)">
            Insights
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {result.insights.map((ins, i) => {
              const s = SEV[ins.severity] ?? SEV.ok
              return (
                <div key={i} className="rounded-r-xl overflow-hidden"
                  style={{ borderLeft: `3px solid ${s.raw}`, background: s.bg }}>
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-[0.62rem] font-black tracking-[0.1em] uppercase rounded-full"
                        style={{ color: s.color, background: s.raw + '1a', borderColor: s.raw + '35' }}>
                        {s.label}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">{ins.title}</span>
                    </div>
                    <p className="text-[0.84rem] text-muted-foreground leading-relaxed">{ins.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
