'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AnalysisResults from '@/components/AnalysisResults'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function AnalysisDetailPage() {
  const { id } = useParams()
  const router  = useRouter()
  const { user, session, loading: authLoading } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/analyze'); return }
    if (!session) return

    fetch(`/api/history/${id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        setAnalysis(data.analysis)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [id, session, user, authLoading, router])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
              ResumeLens
            </Link>
            <Link href="/history" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors hidden sm:block">
              ← History
            </Link>
          </div>
          {user && (
            <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[200px]">
              {user.email}
            </span>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                      strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Not found */}
        {notFound && (
          <div className="text-center py-24">
            <p className="text-gray-500 mb-4">Analysis not found.</p>
            <Link href="/history"
              className="text-indigo-600 font-medium hover:underline">
              ← Back to History
            </Link>
          </div>
        )}

        {/* Result */}
        {analysis && (
          <div>
            {/* Meta row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{analysis.resume_name}</h1>
                <p className="text-sm text-gray-400 mt-0.5">Analyzed on {formatDate(analysis.created_at)}</p>
              </div>
              <Link href="/analyze"
                className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg
                           hover:bg-indigo-700 transition-colors whitespace-nowrap self-start sm:self-auto">
                Analyze Again
              </Link>
            </div>

            <AnalysisResults result={analysis.result} />

            <div className="flex justify-center pt-8 mt-10 border-t border-gray-100">
              <Link href="/history"
                className="px-6 py-2.5 border border-indigo-500 text-indigo-600 font-semibold
                           rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                ← Back to History
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
