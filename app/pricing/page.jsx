'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const FREE_FEATURES = [
  { text: '2 analyses per month', included: true },
  { text: 'ATS Score (0–100)', included: true },
  { text: 'Keyword Match', included: true },
  { text: 'ATS Compatibility Check', included: true },
  { text: 'AI Bullet Rewrites', included: true },
  { text: 'Career Insights', included: true },
  { text: 'Cover Letter Generator', included: false },
  { text: 'Cold Outreach Generator', included: false },
  { text: 'Interview Prep', included: false },
]

const PRO_FEATURES = [
  { text: 'Unlimited analyses', included: true, highlight: true },
  { text: 'ATS Score (0–100)', included: true },
  { text: 'Keyword Match', included: true },
  { text: 'ATS Compatibility Check', included: true },
  { text: 'AI Bullet Rewrites', included: true },
  { text: 'Career Insights', included: true },
  { text: 'Cover Letter Generator', included: true, highlight: true },
  { text: 'Cold Outreach Generator', included: true, highlight: true },
  { text: 'Interview Prep', included: true, highlight: true },
]

export default function PricingPage() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/usage', { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then(r => r.json())
      .then(d => { if (d.plan === 'pro') setIsPro(true) })
      .catch(() => {})
  }, [session])

  const handleUpgrade = async () => {
    if (!session) { router.push('/analyze'); return }

    setUpgradeLoading(true)
    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const order = await orderRes.json()
      if (!orderRes.ok) { setUpgradeLoading(false); return }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'ResumeLens',
        description: 'Pro Plan — Unlimited Analyses',
        prefill: { email: user?.email },
        theme: { color: '#e9b94c' },
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
              setUpgradeSuccess(true)
            }
          } catch { /* silent */ }
          setUpgradeLoading(false)
        },
        modal: { ondismiss: () => setUpgradeLoading(false) },
      })
      rzp.open()
    } catch {
      setUpgradeLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border/60"
        style={{ background: 'rgba(13,13,17,0.8)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight"
            style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
            Resume<span style={{ color: 'var(--gold)' }}>Lens</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm font-medium"
              style={{ color: 'var(--gold)' }}>Pricing</Link>
            <Link href="/analyze" className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--muted-foreground)' }}>
              {user ? 'Dashboard' : 'Sign In'}
            </Link>
            {!user && (
              <Link href="/analyze"
                className="text-sm font-bold px-4 py-1.5 rounded-lg"
                style={{ background: 'var(--gold)', color: '#0d0d11' }}>
                Get Started Free
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden pt-20 pb-12 text-center px-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(233,185,76,0.08) 0%, transparent 68%)' }} />
        </div>
        <div className="relative max-w-xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--gold)' }}>Pricing</p>
          <h1 className="text-4xl font-display font-bold mb-3 tracking-tight">
            Simple pricing.
          </h1>
          <p className="text-xl font-display mb-2" style={{ color: 'var(--muted-foreground)' }}>
            One plan. Everything unlocked.
          </p>
          <p className="text-sm" style={{ color: 'var(--dim)' }}>
            Start free, upgrade when you're ready.
          </p>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

          {/* Free Card */}
          <div className="rounded-2xl p-7" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: 'var(--muted-foreground)' }}>Free</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>/month</span>
              </div>
              <p className="text-sm mt-2" style={{ color: 'var(--dim)' }}>
                No credit card required
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  {f.included ? (
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      style={{ color: 'var(--success)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      style={{ color: 'var(--dim)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm" style={{ color: f.included ? 'var(--foreground)' : 'var(--dim)' }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/analyze"
              className="block w-full h-11 rounded-xl text-sm font-bold text-center leading-[2.75rem] transition-all"
              style={{ background: 'var(--surface-2)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              Get Started Free
            </Link>
          </div>

          {/* Pro Card */}
          <div className="rounded-2xl p-7 relative"
            style={{
              background: 'var(--card)',
              border: '1.5px solid var(--gold)',
              boxShadow: '0 0 40px rgba(233,185,76,0.1)',
            }}>
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="text-[0.65rem] font-black tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: 'var(--gold)', color: '#0d0d11' }}>
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold tracking-widest uppercase mb-3"
                style={{ color: 'var(--gold)' }}>Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>/month</span>
              </div>
              <p className="text-sm mt-2" style={{ color: 'var(--dim)' }}>
                Cancel anytime
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    style={{ color: 'var(--gold)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium"
                    style={{ color: f.highlight ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                    {f.text}
                    {f.highlight && (
                      <span className="ml-2 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(233,185,76,0.12)', color: 'var(--gold)' }}>
                        PRO
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {isPro || upgradeSuccess ? (
              <div className="w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'rgba(233,185,76,0.12)', color: 'var(--gold)', border: '1px solid rgba(233,185,76,0.3)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                You're on Pro
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgradeLoading || loading}
                className="w-full h-11 rounded-xl text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'var(--gold)', color: '#0d0d11' }}>
                {upgradeLoading ? 'Opening payment…' : 'Upgrade to Pro — ₹499/month'}
              </button>
            )}
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs mt-8" style={{ color: 'var(--dim)' }}>
          No contracts. Cancel anytime. Secure payment via Razorpay.
        </p>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t text-center py-8 text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--dim)' }}>
        ResumeLens © 2026 · Built for job seekers
      </footer>
    </div>
  )
}
