'use client'

import { useState } from 'react'

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const stripMarkdown = (text) =>
  text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')

const severityStyle = {
  fix:  { border: 'border-l-red-500',   bg: 'bg-red-50',   badge: 'bg-red-100 text-red-700'    },
  warn: { border: 'border-l-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  ok:   { border: 'border-l-green-500', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
}

/* ─── ScoreRing ───────────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  const verdict =
    score >= 85 ? 'Strong' : score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor'

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">ATS Match Score</p>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 100 100)"
        />
        <text x="100" y="93" textAnchor="middle" fontSize="44" fontWeight="700" fill="#111827">{score}</text>
        <text x="100" y="117" textAnchor="middle" fontSize="14" fill="#9ca3af">/ 100</text>
      </svg>
      <span
        className="text-sm font-semibold px-4 py-1 rounded-full"
        style={{ background: color + '22', color }}
      >
        {verdict}
      </span>
    </div>
  )
}

/* ─── CopyButton ──────────────────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="shrink-0 text-xs px-3 py-1.5 rounded-md border border-gray-300 bg-white
                 hover:bg-gray-50 hover:border-gray-400 transition-colors whitespace-nowrap
                 font-medium text-gray-600"
    >
      {copied ? '✓ Copied!' : 'Copy to clipboard'}
    </button>
  )
}

/* ─── AnalysisResults ─────────────────────────────────────────────────── */
export default function AnalysisResults({ result }) {
  if (!result) return null

  return (
    <div className="space-y-10">
      <div className="border-t border-gray-200 pt-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <ScoreRing score={result.score} />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Matched Keywords</h3>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {result.keywords?.matched?.length ?? 0} matched
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords?.matched?.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">{kw}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Missing Keywords</h3>
                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  {result.keywords?.missing?.length ?? 0} missing
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords?.missing?.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Insights</h2>
        <div className="space-y-3">
          {result.insights?.map((ins, i) => {
            const s = severityStyle[ins.severity] ?? severityStyle.ok
            return (
              <div key={i} className={`border-l-4 ${s.border} ${s.bg} rounded-r-xl p-5`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full tracking-wide ${s.badge}`}>
                    {ins.severity.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{ins.title}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{ins.body}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Suggested Rewrites</h2>
        <div className="space-y-4">
          {result.rewrites?.map((rw, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-red-50 px-5 py-4">
                <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1.5">Before</p>
                <p className="text-sm text-gray-700 leading-relaxed">{stripMarkdown(rw.original)}</p>
              </div>
              <div className="bg-green-50 px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1.5">After</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{stripMarkdown(rw.rewritten)}</p>
                </div>
                <CopyButton text={stripMarkdown(rw.rewritten)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
