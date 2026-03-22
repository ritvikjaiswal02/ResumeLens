'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str

function ScoreBadge({ score }) {
  const color = score >= 70
    ? 'bg-green-100 text-green-700'
    : score >= 40
    ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700'
  return (
    <span className={`text-lg font-bold px-3 py-1 rounded-lg ${color}`}>{score}</span>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function SkeletonCard() {
  return (
    <div className="animate-pulse border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-64" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-8 w-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const { user, session, loading: authLoading } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/analyze'); return }
    if (!session) return

    fetch('/api/history', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAnalyses(data.analyses || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [session, user, authLoading, router])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
              ResumeLens
            </Link>
            <Link href="/analyze" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors hidden sm:block">
              Analyze
            </Link>
          </div>
          {user && (
            <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[200px]">
              {user.email}
            </span>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Analysis History</h1>
          <p className="text-sm text-gray-500 mt-1">Click any analysis to view the full results</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Failed to load history. Please refresh.
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Empty */}
        {!loading && !error && analyses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No analyses yet. Analyze your first resume to see history here.</p>
            <Link href="/analyze"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Analyze a Resume
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && !error && analyses.length > 0 && (
          <div className="space-y-3">
            {analyses.map((a) => (
              <Link key={a.id} href={`/history/${a.id}`}
                className="block border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {a.resume_name}
                    </p>
                    {a.jd_snippet && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {truncate(a.jd_snippet, 80)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">{formatDate(a.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <ScoreBadge score={a.score} />
                    <span className="text-xs text-gray-400 capitalize">{a.verdict?.replace('_', ' ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
