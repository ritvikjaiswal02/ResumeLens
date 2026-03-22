'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const stripMarkdown = (t) =>
  t.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')

const SEV = {
  fix:  { color: 'var(--danger)',  raw: '#f87171', bg: 'rgba(248,113,113,0.06)', label: 'Fix'     },
  warn: { color: 'var(--warn)',    raw: '#fb923c', bg: 'rgba(251,146,60,0.06)',  label: 'Warning' },
  ok:   { color: 'var(--success)', raw: '#4ade80', bg: 'rgba(74,222,128,0.06)', label: 'Good'    },
}

/* ─── Score Ring ─── */
function ScoreRing({ score, delta }) {
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    setDrawn(false)
    const t = setTimeout(() => setDrawn(true), 80)
    return () => clearTimeout(t)
  }, [score])

  const r      = 52
  const circ   = 2 * Math.PI * r
  const offset = drawn ? circ - (score / 100) * circ : circ
  const raw    = score >= 85 ? '#e9b94c' : score >= 70 ? '#4ade80' : score >= 40 ? '#fb923c' : '#f87171'
  const verdict = score >= 85 ? 'Strong Match' : score >= 70 ? 'Good Match' : score >= 40 ? 'Needs Work' : 'Poor Match'

  const deltaColor  = delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--dim)'
  const deltaBg     = delta > 0 ? 'rgba(74,222,128,0.1)' : delta < 0 ? 'rgba(248,113,113,0.1)' : 'var(--surface-3)'
  const deltaBorder = delta > 0 ? 'rgba(74,222,128,0.3)' : delta < 0 ? 'rgba(248,113,113,0.3)' : 'var(--border)'
  const deltaLabel  = delta > 0 ? `↑ +${delta} pts` : delta < 0 ? `↓ ${delta} pts` : '→ No change'

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
            fill="var(--foreground)" fontFamily="system-ui, sans-serif"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}>
            {score}
          </text>
          <text x="68" y="80" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
            / 100
          </text>
        </svg>
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-2">
        <p className="text-[0.68rem] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--muted-foreground)' }}>
          ATS Match Score
        </p>
        <Badge variant="outline" className="font-bold rounded-full w-fit text-sm px-3 py-0.5"
          style={{ color: raw, background: raw + '18', borderColor: raw + '35' }}>
          {verdict}
        </Badge>

        {/* Delta pill — only shown after re-analysis */}
        {delta != null && (
          <span
            className="text-[0.72rem] font-black rounded-full px-2.5 py-0.5 w-fit transition-all duration-500 anim-chip"
            style={{ color: deltaColor, background: deltaBg, border: `1px solid ${deltaBorder}` }}>
            {deltaLabel}
          </span>
        )}

        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
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
        <div className="w-1 h-6 rounded-full shrink-0" style={{ background: countColor ?? 'var(--gold)' }} />
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold tracking-tight">{children}</h2>
            {count != null && (
              <Badge variant="outline" className="text-[0.7rem] font-bold rounded-full"
                style={{ color: countColor, background: countColor + '18', borderColor: countColor + '30' }}>
                {count}
              </Badge>
            )}
          </div>
          {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>}
        </div>
      </div>
    </div>
  )
}

/* ─── Export report ─── */
function buildReportText(result) {
  const matched = result.keywords?.matched ?? []
  const missing = result.keywords?.missing ?? []
  const verdict = result.score >= 85 ? 'Strong Match'
    : result.score >= 70 ? 'Good Match'
    : result.score >= 40 ? 'Needs Work' : 'Poor Match'
  const hr   = '─'.repeat(48)
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const lines = [
    'ResumeLens — ATS Analysis Report', `Generated ${date}`, hr, '',
    `ATS Match Score: ${result.score}/100 — ${verdict}`, '',
    `✓ Matched Keywords (${matched.length}): ${matched.join(', ') || 'None'}`,
    `✗ Missing Keywords (${missing.length}): ${missing.join(', ') || 'None'}`, '',
  ]
  if (result.rewrites?.length > 0) {
    lines.push(hr, 'SUGGESTED REWRITES', hr, '')
    result.rewrites.forEach((rw, i) => {
      lines.push(`${i + 1}. BEFORE:`, `   ${stripMarkdown(rw.original)}`, '', `   AFTER:`, `   ${stripMarkdown(rw.rewritten)}`, '')
    })
  }
  if (result.insights?.length > 0) {
    lines.push(hr, 'INSIGHTS', hr, '')
    result.insights.forEach(ins => { lines.push(`[${(ins.severity ?? 'info').toUpperCase()}] ${ins.title}`, ins.body, '') })
  }
  lines.push(hr, 'Generated by ResumeLens')
  return lines.join('\n')
}

function ExportToolbar({ result }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="no-print flex items-center justify-end gap-2">
      <Button variant="outline" size="sm"
        onClick={() => { navigator.clipboard.writeText(buildReportText(result)); setCopied(true); setTimeout(() => setCopied(false), 2500) }}
        className="h-8 text-xs font-semibold gap-1.5 border-border transition-all"
        style={copied ? { borderColor: 'rgba(74,222,128,0.4)', color: 'var(--success)', background: 'rgba(74,222,128,0.08)' } : {}}>
        {copied ? '✓ Copied!' : 'Copy Report'}
      </Button>
      <Button variant="outline" size="sm" onClick={() => window.print()}
        className="h-8 text-xs font-semibold gap-1.5 border-border">
        Save as PDF
      </Button>
    </div>
  )
}

/* ─── ATS Compatibility Check ─── */
const ATS_ORDER = { error: 0, warning: 1, good: 2 }
const ATS_CFG = {
  error:   { raw: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.35)', glow: '0 0 0 1px rgba(248,113,113,0.15)', label: 'Error',   icon: '✕' },
  warning: { raw: '#fb923c', bg: 'rgba(251,146,60,0.06)',  border: 'rgba(251,146,60,0.28)',  glow: 'none',                            label: 'Warning', icon: '⚠' },
  good:    { raw: '#4ade80', bg: 'rgba(74,222,128,0.05)',  border: 'rgba(74,222,128,0.15)',  glow: 'none',                            label: 'Good',    icon: '✓' },
}

function AtsSection({ result }) {
  const [showAllGood, setShowAllGood] = useState(false)
  const items = result.ats_structure ?? []
  if (!items.length) return null

  const sorted    = [...items].sort((a, b) => (ATS_ORDER[a.type] ?? 1) - (ATS_ORDER[b.type] ?? 1))
  const nonGood   = sorted.filter(i => i.type !== 'good')
  const goodItems = sorted.filter(i => i.type === 'good')
  const visibleGood    = showAllGood ? goodItems : goodItems.slice(0, 2)
  const hiddenGoodCount = goodItems.length - 2

  const errorCount   = nonGood.filter(i => i.type === 'error').length
  const warningCount = nonGood.filter(i => i.type === 'warning').length

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold tracking-tight">ATS Compatibility Check</h2>
              {errorCount > 0 && (
                <Badge variant="outline" className="text-[0.7rem] font-bold rounded-full"
                  style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)' }}>
                  {errorCount} error{errorCount > 1 ? 's' : ''}
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant="outline" className="text-[0.7rem] font-bold rounded-full"
                  style={{ color: '#fb923c', background: 'rgba(251,146,60,0.1)', borderColor: 'rgba(251,146,60,0.3)' }}>
                  {warningCount} warning{warningCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Evaluated from resume text — focuses on structure and clarity, not visual layout
            </p>
          </div>
        </div>
      </div>

      {/* Headline summary */}
      {result.ats_summary && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl mb-4"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: 'var(--gold)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
          </svg>
          <div>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--foreground)' }}>
              {result.ats_summary}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--dim)' }}>
              Fixing these issues can improve your ATS score.
            </p>
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="flex flex-col gap-2.5">

        {/* Errors + warnings */}
        {nonGood.map((item, i) => {
          const cfg = ATS_CFG[item.type] ?? ATS_CFG.warning
          return (
            <div key={i} className="rounded-xl px-4 py-4 flex items-start gap-3 transition-all"
              style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, boxShadow: cfg.glow }}>
              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[0.6rem] font-black mt-0.5"
                style={{ background: cfg.raw + '25', color: cfg.raw, border: `1px solid ${cfg.raw}55` }}>
                {cfg.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[0.62rem] font-black tracking-[0.1em] uppercase"
                    style={{ color: cfg.raw }}>{cfg.label}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</span>
                </div>
                <p className="text-[0.84rem] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}

        {/* Good items (max 2, rest collapsed) */}
        {visibleGood.map((item, i) => {
          const cfg = ATS_CFG.good
          return (
            <div key={`good-${i}`} className="rounded-xl px-4 py-3.5 flex items-start gap-3"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[0.6rem] font-black mt-0.5"
                style={{ background: cfg.raw + '20', color: cfg.raw }}>
                {cfg.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[0.62rem] font-black tracking-[0.1em] uppercase"
                    style={{ color: cfg.raw }}>{cfg.label}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</span>
                </div>
                <p className="text-[0.84rem] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}

        {/* Show more / less toggle for good items */}
        {goodItems.length > 2 && (
          <button
            onClick={() => setShowAllGood(v => !v)}
            className="text-xs font-semibold text-left px-2 py-1 transition-colors w-fit"
            style={{ color: 'var(--success)' }}>
            {showAllGood
              ? '↑ Show fewer strengths'
              : `+ ${hiddenGoodCount} more strength${hiddenGoodCount > 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── AnalysisResults ─── */
export default function AnalysisResults({ result, previousResult, comparisonSummary, reanalyzing }) {
  if (!result) return null

  const matched = result.keywords?.matched ?? []
  const missing = result.keywords?.missing ?? []
  const delta   = previousResult != null ? result.score - previousResult.score : null

  return (
    <div className="flex flex-col gap-8" style={{ position: 'relative' }}>

      {/* ── Inline re-analyzing overlay ── */}
      {reanalyzing && (
        <div className="absolute inset-0 z-20 rounded-xl flex items-start justify-center pt-24 pointer-events-none"
          style={{ background: 'rgba(13,13,17,0.6)', backdropFilter: 'blur(2px)' }}>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <svg className="spin shrink-0 w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--surface-3)" strokeWidth="3" />
              <circle cx="12" cy="12" r="9" stroke="var(--gold)" strokeWidth="3"
                strokeDasharray="14 42" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              Re-analyzing your resume…
            </span>
          </div>
        </div>
      )}

      {/* ── What Changed — shown after re-analysis ── */}
      {comparisonSummary && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl anim-fade-up"
          style={{
            background: delta > 0 ? 'rgba(74,222,128,0.06)' : delta < 0 ? 'rgba(248,113,113,0.06)' : 'var(--surface-2)',
            border: `1px solid ${delta > 0 ? 'rgba(74,222,128,0.2)' : delta < 0 ? 'rgba(248,113,113,0.2)' : 'var(--border)'}`,
          }}>
          {/* Icon */}
          <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: delta > 0 ? 'rgba(74,222,128,0.15)' : delta < 0 ? 'rgba(248,113,113,0.15)' : 'var(--surface-3)' }}>
            {delta > 0
              ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 10V3M3 6l3.5-3.5L10 6" stroke="var(--success)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : delta < 0
              ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 3v7M3 7l3.5 3.5L10 7" stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9" stroke="var(--dim)" strokeWidth="1.8" strokeLinecap="round"/></svg>
            }
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--dim)' }}>
              What Changed
            </p>
            <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--foreground)' }}>
              {comparisonSummary}
            </p>
          </div>
        </div>
      )}

      {/* ── Export toolbar ── */}
      <ExportToolbar result={result} />

      {/* ══ 1. SCORE + KEYWORDS ══ */}
      <Card className="border-border/70 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-row divide-x divide-border/50">

            {/* Score ring — keyed to score so it re-animates on change */}
            <div className="flex items-center justify-center px-8 py-7 lg:w-72 shrink-0">
              <ScoreRing key={result.score} score={result.score} delta={delta} />
            </div>

            {/* Keywords */}
            <div className="flex flex-1 divide-x divide-border/50 min-w-0">

              {/* Matched */}
              <div className="flex-1 p-5 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--muted-foreground)' }}>
                    Matched
                  </p>
                  <Badge variant="outline" className="text-[0.68rem] font-bold rounded-full"
                    style={{ color: 'var(--success)', background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.25)' }}>
                    {matched.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matched.map((kw, i) => {
                    const isNew    = previousResult && !(previousResult.keywords?.matched ?? []).includes(kw)
                    const label    = isNew ? `✦ ${kw}` : kw
                    const truncated = label.length > 32 ? label.slice(0, 30) + '…' : label
                    return (
                      <span key={kw} className="anim-chip" style={{ animationDelay: `${i * 30}ms` }}>
                        <Badge variant="outline"
                          title={kw}
                          className="text-[0.7rem] font-medium rounded-full cursor-default max-w-[190px]"
                          style={isNew
                            ? { color: 'var(--success)', background: 'rgba(74,222,128,0.18)', borderColor: 'rgba(74,222,128,0.4)', fontWeight: 700 }
                            : { color: 'var(--success)', background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.18)' }}>
                          <span className="truncate block">{truncated}</span>
                        </Badge>
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Missing */}
              <div className="flex-1 p-5 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.08em]" style={{ color: 'var(--muted-foreground)' }}>
                    Missing
                  </p>
                  <Badge variant="outline" className="text-[0.68rem] font-bold rounded-full"
                    style={{ color: 'var(--danger)', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.25)' }}>
                    {missing.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map((kw, i) => {
                    const truncated = kw.length > 32 ? kw.slice(0, 30) + '…' : kw
                    return (
                      <span key={kw} className="anim-chip" style={{ animationDelay: `${i * 30}ms` }}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline"
                              className="text-[0.7rem] font-medium rounded-full cursor-default max-w-[190px]"
                              style={{ color: 'var(--danger)', background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.18)' }}>
                              <span className="truncate block">{truncated}</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs border-border"
                            style={{ background: 'var(--card)', color: 'var(--foreground)', maxWidth: '240px' }}>
                            Add &quot;{kw}&quot; to your resume
                          </TooltipContent>
                        </Tooltip>
                      </span>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══ 2. ATS COMPATIBILITY CHECK ══ */}
      <AtsSection result={result} />

      {/* ══ 4. REWRITES ══ */}
      {result.rewrites?.length > 0 && (
        <div>
          <SectionTitle count={result.rewrites.length} countColor="var(--success)"
            sub="Copy and paste these directly into your resume">
            Suggested Rewrites
          </SectionTitle>
          <div className="flex flex-col gap-5">
            {result.rewrites.map((rw, i) => (
              <Card key={i} className="border-border/70 overflow-hidden">
                <div className="flex flex-row divide-x divide-border/40">
                  <div className="flex-1 px-5 py-5 min-w-0" style={{ background: 'rgba(248,113,113,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[0.62rem] font-black tracking-[0.12em] uppercase" style={{ color: 'var(--danger)' }}>Before</span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(248,113,113,0.14)' }} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {stripMarkdown(rw.original)}
                    </p>
                  </div>
                  <div className="flex-1 px-5 py-5 min-w-0 flex flex-col" style={{ background: 'rgba(74,222,128,0.05)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[0.62rem] font-black tracking-[0.12em] uppercase" style={{ color: 'var(--success)' }}>After</span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(74,222,128,0.14)' }} />
                      <CopyButton text={stripMarkdown(rw.rewritten)} />
                    </div>
                    <p className="text-[0.9375rem] leading-relaxed font-medium flex-1" style={{ color: 'var(--foreground)' }}>
                      {stripMarkdown(rw.rewritten)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══ 5. INSIGHTS ══ */}
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
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{ins.title}</span>
                    </div>
                    <p className="text-[0.84rem] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{ins.body}</p>
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
