'use client'

import { useState, useEffect } from 'react'

/* ─── Helpers ─── */
const stripMarkdown = (text) =>
  text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')

const severityConfig = {
  fix:  { color: 'var(--danger)',  bg: 'rgba(248,113,113,0.06)',  borderColor: '#f87171',  label: 'Fix'     },
  warn: { color: 'var(--warn)',    bg: 'rgba(251,146,60,0.06)',   borderColor: '#fb923c',  label: 'Warning' },
  ok:   { color: 'var(--success)', bg: 'rgba(74,222,128,0.06)',   borderColor: '#4ade80',  label: 'Good'    },
}

/* ─── ScoreRing ─── */
function ScoreRing({ score }) {
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 120)
    return () => clearTimeout(t)
  }, [])

  const radius       = 76
  const circumference = 2 * Math.PI * radius
  const targetOffset  = circumference - (score / 100) * circumference
  const currentOffset = drawn ? targetOffset : circumference

  const color = score >= 85
    ? 'var(--accent)'
    : score >= 70
    ? 'var(--success)'
    : score >= 40
    ? 'var(--warn)'
    : 'var(--danger)'

  const rawColor = score >= 85 ? '#e9b94c'
    : score >= 70 ? '#4ade80'
    : score >= 40 ? '#fb923c'
    : '#f87171'

  const verdict = score >= 85 ? 'Strong Match'
    : score >= 70 ? 'Good Match'
    : score >= 40 ? 'Needs Work'
    : 'Poor Match'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
      <p style={{
        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--dim)',
      }}>
        ATS Match Score
      </p>

      <div style={{ position: 'relative' }}>
        {/* Ambient glow behind ring */}
        <div style={{
          position: 'absolute', inset: '-12px', borderRadius: '50%',
          background: `radial-gradient(circle, ${rawColor}28 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'opacity 0.8s ease',
          opacity: drawn ? 1 : 0,
          animation: drawn ? 'glowPulse 2.4s ease-in-out infinite' : 'none',
        }} />

        <svg width="196" height="196" viewBox="0 0 196 196">
          {/* Track */}
          <circle cx="98" cy="98" r={radius} fill="none" stroke="var(--surface-3)" strokeWidth="11" />
          {/* Tick marks */}
          {[0, 25, 50, 75].map((pct) => {
            const angle = (pct / 100) * 360 - 90
            const rad   = angle * (Math.PI / 180)
            const x1 = 98 + (radius - 7) * Math.cos(rad)
            const y1 = 98 + (radius - 7) * Math.sin(rad)
            const x2 = 98 + (radius + 7) * Math.cos(rad)
            const y2 = 98 + (radius + 7) * Math.sin(rad)
            return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="1.5" />
          })}
          {/* Progress arc */}
          <circle
            cx="98" cy="98" r={radius}
            fill="none" stroke={rawColor} strokeWidth="11"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            strokeLinecap="round"
            transform="rotate(-90 98 98)"
            style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.4, 0.64, 1)' }}
          />
          {/* Score number */}
          <text x="98" y="88" textAnchor="middle" fontSize="50" fontWeight="700"
            fill="var(--text)" fontFamily="var(--font-display, Georgia), serif"
            style={{ transition: 'opacity 0.5s ease', opacity: drawn ? 1 : 0 }}>
            {score}
          </text>
          <text x="98" y="112" textAnchor="middle" fontSize="12" fill="var(--dim)">
            out of 100
          </text>
        </svg>
      </div>

      <span style={{
        fontSize: '0.8125rem', fontWeight: 700,
        padding: '5px 16px', borderRadius: '100px',
        background: rawColor + '1a', color,
        letterSpacing: '-0.01em',
        border: `1px solid ${rawColor}33`,
      }}>
        {verdict}
      </span>
    </div>
  )
}

/* ─── CopyButton ─── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      style={{
        flexShrink: 0, fontSize: '0.75rem', fontWeight: 600,
        padding: '6px 14px', borderRadius: '8px',
        border: `1px solid ${copied ? 'rgba(74,222,128,0.35)' : 'var(--border)'}`,
        background: copied ? 'rgba(74,222,128,0.1)' : 'var(--surface-3)',
        color: copied ? 'var(--success)' : 'var(--muted)',
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.2s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

/* ─── SectionHeader ─── */
function SectionHeader({ title, count, countColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
      <h2 className="font-display" style={{
        fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>
      {count != null && (
        <span style={{
          fontSize: '0.72rem', fontWeight: 700,
          padding: '2px 9px', borderRadius: '100px',
          background: countColor + '18', color: countColor,
          border: `1px solid ${countColor}30`,
        }}>
          {count}
        </span>
      )}
    </div>
  )
}

/* ─── AnalysisResults ─── */
export default function AnalysisResults({ result }) {
  if (!result) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>

      {/* ── Score + Keywords ── */}
      <div>
        <div style={{
          display: 'flex', flexDirection: 'row', gap: '28px',
          alignItems: 'flex-start', flexWrap: 'wrap',
        }}>
          {/* Score Ring */}
          <ScoreRing score={result.score} />

          {/* Keyword Cards */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', minWidth: 0 }}>

            {/* Matched */}
            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Matched
                </h3>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                  background: 'rgba(74,222,128,0.12)', color: 'var(--success)',
                  border: '1px solid rgba(74,222,128,0.2)',
                }}>
                  {result.keywords?.matched?.length ?? 0}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.keywords?.matched?.map((kw, i) => (
                  <span key={kw} className="anim-chip" style={{ animationDelay: `${i * 35}ms` }}>
                    <span style={{
                      display: 'inline-block', fontSize: '0.72rem', fontWeight: 600,
                      padding: '3px 9px', borderRadius: '100px',
                      background: 'rgba(74,222,128,0.1)', color: 'var(--success)',
                      border: '1px solid rgba(74,222,128,0.2)',
                    }}>
                      {kw}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Missing
                </h3>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                  background: 'rgba(248,113,113,0.12)', color: 'var(--danger)',
                  border: '1px solid rgba(248,113,113,0.2)',
                }}>
                  {result.keywords?.missing?.length ?? 0}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.keywords?.missing?.map((kw, i) => (
                  <span key={kw} className="anim-chip" style={{ animationDelay: `${i * 35}ms` }}>
                    <span style={{
                      display: 'inline-block', fontSize: '0.72rem', fontWeight: 600,
                      padding: '3px 9px', borderRadius: '100px',
                      background: 'rgba(248,113,113,0.1)', color: 'var(--danger)',
                      border: '1px solid rgba(248,113,113,0.2)',
                    }}>
                      {kw}
                    </span>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Insights ── */}
      {result.insights?.length > 0 && (
        <div>
          <SectionHeader title="Insights" count={result.insights.length} countColor="var(--accent)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.insights.map((ins, i) => {
              const cfg = severityConfig[ins.severity] ?? severityConfig.ok
              return (
                <div key={i} style={{
                  borderLeft: `3px solid ${cfg.borderColor}`,
                  background: cfg.bg,
                  borderRadius: '0 12px 12px 0',
                  padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: cfg.color, background: cfg.color.replace('var(--', '').replace(')', '') + '1a',
                      padding: '2px 8px', borderRadius: '100px',
                      border: `1px solid ${cfg.borderColor}30`,
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{ins.title}</span>
                  </div>
                  <p style={{ fontSize: '0.8375rem', color: 'var(--muted)', lineHeight: 1.7 }}>{ins.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Rewrites ── */}
      {result.rewrites?.length > 0 && (
        <div>
          <SectionHeader title="Suggested Rewrites" count={result.rewrites.length} countColor="var(--success)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result.rewrites.map((rw, i) => (
              <div key={i} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '14px', overflow: 'hidden',
              }}>
                {/* Before */}
                <div style={{
                  padding: '18px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(248,113,113,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'var(--danger)',
                    }}>Before</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(248,113,113,0.15)' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.72 }}>
                    {stripMarkdown(rw.original)}
                  </p>
                </div>
                {/* After */}
                <div style={{
                  padding: '18px 20px',
                  background: 'rgba(74,222,128,0.04)',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'var(--success)',
                      }}>After</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(74,222,128,0.15)' }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.72 }}>
                      {stripMarkdown(rw.rewritten)}
                    </p>
                  </div>
                  <CopyButton text={stripMarkdown(rw.rewritten)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
