'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const PASSES = [
  {
    id: 'sprint',
    name: '1-Month Sprint',
    price: '₹149',
    duration: '30 Days Access',
    pitch: 'Everything you need to apply, network, and secure interviews this month.',
    buttonLabel: 'Get 30 Days Access',
    highlight: false,
  },
  {
    id: 'season',
    name: 'Placement Season',
    price: '₹299',
    duration: '90 Days Access',
    pitch: 'Survive the entire placement season. Unlimited applications, unlimited interview prep.',
    buttonLabel: 'Get 90 Days Access',
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: '₹799',
    duration: 'Forever',
    pitch: 'Never worry about resume updates again. Perfect for working professionals.',
    buttonLabel: 'Get Lifetime Access',
    highlight: false,
  },
]

const PRO_FEATURES = [
  'Unlimited AI Bullet Rewrites',
  'PDF Cover Letter Generator',
  'Cold Outreach & LinkedIn DM Generator',
  'Interview Prep (STAR Method questions)',
  'Resume & JD History Tracking',
]

export default function PricingPage() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [activeLoading, setActiveLoading] = useState(null) // plan id or null
  const [isPro, setIsPro] = useState(false)
  const [successPlan, setSuccessPlan] = useState(null)

  useEffect(() => {
    if (!session) return
    fetch('/api/usage', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then(r => r.json())
      .then(d => { if (d.plan === 'pro') setIsPro(true) })
      .catch(() => {})
  }, [session])

  const handleBuy = async (planId) => {
    if (!session) { router.push('/analyze'); return }
    setActiveLoading(planId)
    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: planId }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok) { setActiveLoading(null); return }

      const pass = PASSES.find(p => p.id === planId)
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'ResumeLens',
        description: pass?.name || 'Pro Pass',
        prefill: { email: user?.email },
        theme: { color: '#f59e0b' },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify(response),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              setIsPro(true)
              setSuccessPlan(planId)
            }
          } catch { /* silent */ }
          setActiveLoading(null)
        },
        modal: { ondismiss: () => setActiveLoading(null) },
      })
      rzp.open()
    } catch {
      setActiveLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-200 no-underline">
            Resume<span className="text-amber-400">Lens</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-medium text-amber-400">Pricing</Link>
            <Link href="/analyze" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              {user ? 'Dashboard' : 'Sign In'}
            </Link>
            {!user && (
              <Link href="/analyze"
                className="text-sm font-bold px-4 py-1.5 rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors">
                Get Started Free
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="pt-20 pb-10 text-center px-6">
        <p className="text-xs font-black tracking-[0.2em] uppercase text-amber-400 mb-4">Pricing</p>
        <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
          Simple, One-Time Pricing.
        </h1>
        <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          No recurring subscriptions. No auto-pay. Buy a pass for the time you need,
          and secure your interviews.
        </p>
      </div>

      {/* ── Free Tier Banner ── */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="flex items-start gap-4 px-6 py-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/30">
          <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-400 mb-1">Always Free</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every account includes unlimited ATS scoring, keyword matching, and{' '}
              <span className="font-semibold text-amber-400">1 Golden Ticket</span>
              {' '}— a free credit to generate a Cover Letter, Cold DM, or Interview Prep.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3 Pass Cards ── */}
      <div className="max-w-4xl mx-auto px-6 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PASSES.map((pass) => (
            <div key={pass.id} className={`relative rounded-2xl p-6 flex flex-col ${
              pass.highlight
                ? 'border-2 border-amber-500 bg-slate-800/70 shadow-[0_0_40px_rgba(245,158,11,0.12)]'
                : 'border border-slate-700/60 bg-slate-800/50'
            }`}>
              {/* Badge */}
              {pass.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[0.6rem] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-amber-500 text-slate-900">
                    {pass.badge}
                  </span>
                </div>
              )}

              {/* Duration tag */}
              <div className="mb-4">
                <span className={`text-[0.65rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                  pass.highlight
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    : 'bg-slate-700/60 text-slate-400 border border-slate-600/40'
                }`}>
                  {pass.duration}
                </span>
              </div>

              {/* Name + price */}
              <p className="text-sm font-semibold text-slate-400 mb-1">{pass.name}</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-bold text-slate-100">{pass.price}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">one-time</span>
              </div>

              {/* Pitch */}
              <p className="text-xs text-slate-400 leading-relaxed mt-3 mb-6 flex-1">
                {pass.pitch}
              </p>

              {/* CTA */}
              {isPro || successPlan === pass.id ? (
                <div className="flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold
                  bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Active
                </div>
              ) : (
                <button
                  onClick={() => handleBuy(pass.id)}
                  disabled={activeLoading !== null || loading}
                  className={`w-full h-10 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    pass.highlight
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                  }`}>
                  {activeLoading === pass.id ? 'Opening payment…' : pass.buttonLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── What's Included ── */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/30 px-8 py-8">
          <h2 className="text-base font-bold text-slate-200 mb-6">All Pro Passes Include:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRO_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Secure payment via Razorpay · No auto-renewal · No hidden charges
        </p>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 text-center py-8 text-xs text-slate-600">
        ResumeLens © 2026 · Built for job seekers
      </footer>
    </div>
  )
}
