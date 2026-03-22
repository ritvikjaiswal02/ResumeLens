'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { getUsage } from '@/lib/api'
import AnalysisResults from '@/components/AnalysisResults'

const JD_MAX = 3000
const FILE_MAX_BYTES = 5 * 1024 * 1024

/* ─── Helpers ─── */
const truncate = (str, n) => (str.length > n ? str.slice(0, n) + '…' : str)

/* ─── PdfUploadZone ─── */
function PdfUploadZone({ file, onFile, onClear, fileError }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') { onFile(null, 'Only PDF files are accepted.'); return }
    if (f.size > FILE_MAX_BYTES)       { onFile(null, 'File too large. Max size is 5MB.'); return }
    onFile(f, null)
  }

  if (file) {
    return (
      <div style={{
        minHeight: '300px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '12px',
        border: '2px solid rgba(74,222,128,0.35)',
        background: 'rgba(74,222,128,0.05)',
        borderRadius: '14px',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(74,222,128,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="26" height="26" fill="none" stroke="var(--success)" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <div style={{ textAlign: 'center', padding: '0 16px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)', marginBottom: '4px' }}>Ready to analyze</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--dim)', marginTop: '2px' }}>{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <button onClick={onClear} style={{
          fontSize: '0.75rem', color: 'var(--danger)', background: 'none',
          border: 'none', cursor: 'pointer', padding: '4px 8px',
        }}>
          Remove file
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div
        className="upload-zone"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        style={{
          minHeight: '300px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          background: dragging ? 'rgba(233,185,76,0.05)' : 'var(--surface-2)',
          borderRadius: '14px', cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: dragging ? 'scale(1.01)' : 'scale(1)',
        }}
      >
        <div className="scan-line" />
        <div style={{
          width: '56px', height: '56px', borderRadius: '12px',
          background: 'rgba(233,185,76,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '4px',
        }}>
          <svg width="26" height="26" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M13 3v5a1 1 0 001 1h5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 13h6M9 17h4" />
          </svg>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', textAlign: 'center', padding: '0 24px', lineHeight: 1.6 }}>
          Drop your resume PDF here, or{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>click to browse</span>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>PDF only · max 5 MB</p>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />
      </div>
      {fileError && (
        <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '2px' }}>{fileError}</p>
      )}
    </div>
  )
}

/* ─── AuthModal ─── */
function AuthModal({ onClose, signInWithGoogle, signInWithEmail }) {
  const [magicEmail, setMagicEmail]     = useState('')
  const [magicSent, setMagicSent]       = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)

  const handleMagicLink = async () => {
    if (!magicEmail.trim()) return
    setMagicLoading(true)
    await signInWithEmail(magicEmail.trim())
    setMagicSent(true)
    setMagicLoading(false)
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      paddingTop: '80px', paddingLeft: '16px', paddingRight: '16px',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '380px',
        position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--dim)', fontSize: '1.1rem', lineHeight: 1,
          padding: '4px', borderRadius: '6px',
        }}>✕</button>

        <h2 className="font-display" style={{
          fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px',
        }}>Sign in to ResumeLens</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '28px' }}>
          Get 2 free analyses per month
        </p>

        <button onClick={signInWithGoogle} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: '11px', fontSize: '0.875rem', fontWeight: 600,
          color: 'var(--text)', cursor: 'pointer', marginBottom: '20px',
          transition: 'border-color 0.2s',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--dim)', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {magicSent ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(74,222,128,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <svg width="20" height="20" fill="none" stroke="var(--success)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>Check your email</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--dim)' }}>{magicEmail}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="email" placeholder="you@example.com"
              value={magicEmail} onChange={(e) => setMagicEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
              style={{
                width: '100%', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '11px 14px',
                fontSize: '0.875rem', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={handleMagicLink}
              disabled={magicLoading || !magicEmail.trim()}
              style={{
                width: '100%', background: 'var(--accent)', color: '#0d0d11',
                border: 'none', borderRadius: '10px', padding: '11px',
                fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
                opacity: magicLoading || !magicEmail.trim() ? 0.45 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {magicLoading ? 'Sending…' : 'Send magic link'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── PaywallModal ─── */
function PaywallModal({ onClose, onUpgrade, upgradeLoading }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      paddingTop: '80px', paddingLeft: '16px', paddingRight: '16px',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '380px',
        position: 'relative', textAlign: 'center',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--dim)', fontSize: '1.1rem', lineHeight: 1, padding: '4px',
        }}>✕</button>

        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'rgba(233,185,76,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <svg width="24" height="24" fill="none" stroke="var(--accent)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h2 className="font-display" style={{
          fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px',
        }}>
          Monthly limit reached
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '28px', lineHeight: 1.65 }}>
          You&apos;ve used your 2 free analyses. Upgrade to Pro for unlimited analyses — ₹499/month.
        </p>

        <button
          onClick={onUpgrade}
          disabled={upgradeLoading}
          style={{
            width: '100%', background: 'var(--accent)', color: '#0d0d11',
            border: 'none', borderRadius: '10px', padding: '13px',
            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
            marginBottom: '12px',
            opacity: upgradeLoading ? 0.6 : 1, transition: 'opacity 0.2s',
          }}
        >
          {upgradeLoading ? 'Opening payment…' : 'Upgrade to Pro — ₹499/month'}
        </button>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.8125rem', color: 'var(--dim)',
        }}>
          Come back next month
        </button>
      </div>
    </div>
  )
}

/* ─── Analyze Page ─── */
export default function AnalyzePage() {
  const topRef = useRef(null)
  const { user, session, loading: authLoading, signOut, signInWithGoogle, signInWithEmail } = useAuth()
  const [authError, setAuthError] = useState(false)

  const [resumeFile, setResumeFile]         = useState(null)
  const [fileError, setFileError]           = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading]               = useState(false)
  const [result, setResult]                 = useState(null)
  const [error, setError]                   = useState('')
  const [showAuthModal, setShowAuthModal]   = useState(false)
  const [showPaywall, setShowPaywall]       = useState(false)
  const [usage, setUsage]                   = useState(null)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)

  useEffect(() => {
    setAuthError(new URLSearchParams(window.location.search).get('auth_error') === 'true')
  }, [])

  useEffect(() => {
    if (!session) { setUsage(null); return }
    getUsage(session.access_token).then(setUsage)
  }, [session])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  const handleUpgrade = async () => {
    if (!session) return
    setUpgradeLoading(true)
    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ResumeLens',
        description: 'Pro Plan — Unlimited Analyses',
        order_id: orderData.order_id,
        prefill: { email: user?.email || '' },
        theme: { color: '#e9b94c' },
        handler: async (response) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            setShowPaywall(false)
            getUsage(session.access_token).then(setUsage)
            setUpgradeSuccess(true)
            setTimeout(() => setUpgradeSuccess(false), 4000)
          } else {
            alert('Payment verification failed. Please contact support.')
          }
          setUpgradeLoading(false)
        },
        modal: { ondismiss: () => setUpgradeLoading(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        console.error('[razorpay] payment failed:', response.error)
        alert('Payment failed: ' + response.error.description)
        setUpgradeLoading(false)
      })
      rzp.open()
    } catch (err) {
      console.error('[razorpay] upgrade error:', err)
      alert('Something went wrong. Please try again.')
      setUpgradeLoading(false)
    }
  }

  const handleFile  = (f, err) => { setResumeFile(f); setFileError(err || '') }
  const handleClear = ()        => { setResumeFile(null); setFileError('') }

  const handleReset = () => {
    setResumeFile(null); setFileError('')
    setJobDescription(''); setResult(null); setError('')
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAnalyze = async () => {
    if (!user) { setShowAuthModal(true); return }

    setError(''); setResult(null); setLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription)

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()

      if (res.status === 403) {
        setShowPaywall(true)
        getUsage(session.access_token).then(setUsage)
      } else if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setResult(data)
        getUsage(session.access_token).then(setUsage)
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const atLimit    = usage?.plan === 'free' && usage?.analyses_used >= 2
  const canAnalyze = resumeFile !== null && jobDescription.trim().length > 0 && !loading && !atLimit
  const hasModal   = showAuthModal || showPaywall

  return (
    <div ref={topRef} style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>

      {/* Toast banners */}
      {authError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
          background: 'rgba(248,113,113,0.15)', borderBottom: '1px solid rgba(248,113,113,0.3)',
          color: 'var(--danger)', fontSize: '0.8125rem', textAlign: 'center',
          padding: '10px 16px', backdropFilter: 'blur(8px)',
        }}>
          Sign-in failed — your session may have expired. Please try again.
        </div>
      )}
      {upgradeSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
          background: 'rgba(74,222,128,0.12)', borderBottom: '1px solid rgba(74,222,128,0.3)',
          color: 'var(--success)', fontSize: '0.8125rem', textAlign: 'center',
          padding: '10px 16px', backdropFilter: 'blur(8px)',
        }}>
          You&apos;re now on Pro. Unlimited analyses unlocked. ✓
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          signInWithGoogle={signInWithGoogle}
          signInWithEmail={signInWithEmail}
        />
      )}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={handleUpgrade}
          upgradeLoading={upgradeLoading}
        />
      )}

      <div style={{ pointerEvents: hasModal ? 'none' : 'auto', userSelect: hasModal ? 'none' : 'auto' }}>

        {/* ── Navbar ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(13,13,17,0.82)', backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border-s)',
        }}>
          <div style={{
            maxWidth: '1040px', margin: '0 auto',
            padding: '0 24px', height: '62px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link href="/" className="font-display" style={{
                fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em',
                color: 'var(--text)', textDecoration: 'none',
              }}>
                Resume<span style={{ color: 'var(--accent)' }}>Lens</span>
              </Link>
              {user && (
                <Link href="/history" style={{
                  fontSize: '0.875rem', fontWeight: 500,
                  color: 'var(--muted)', textDecoration: 'none',
                  display: 'none',
                }}
                  className="sm-block"
                >
                  History
                </Link>
              )}
            </div>

            {authLoading ? null : user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {usage && (
                  usage.plan === 'pro' ? (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
                      color: 'var(--success)', background: 'rgba(74,222,128,0.1)',
                      border: '1px solid rgba(74,222,128,0.25)',
                      padding: '4px 10px', borderRadius: '100px',
                    }}>
                      Pro · unlimited
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '100px',
                      border: '1px solid',
                      ...(usage.analyses_used === 0
                        ? { color: 'var(--muted)', background: 'var(--surface-2)', borderColor: 'var(--border)' }
                        : usage.analyses_used === 1
                        ? { color: 'var(--warn)', background: 'rgba(251,146,60,0.1)', borderColor: 'rgba(251,146,60,0.25)' }
                        : { color: 'var(--danger)', background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.25)' }),
                    }}>
                      {usage.analyses_used} / 2 analyses
                    </span>
                  )
                )}
                <span style={{ fontSize: '0.8125rem', color: 'var(--dim)' }}>{truncate(user.email, 22)}</span>
                <button onClick={signOut} style={{
                  fontSize: '0.8125rem', fontWeight: 600,
                  color: 'var(--muted)', background: 'none',
                  border: '1px solid var(--border)',
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => { e.target.style.color = 'var(--danger)'; e.target.style.borderColor = 'rgba(248,113,113,0.4)' }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border)' }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} style={{
                fontSize: '0.875rem', fontWeight: 600,
                color: 'var(--text)', background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                padding: '7px 18px', borderRadius: '8px', cursor: 'pointer',
              }}>
                Sign in
              </button>
            )}
          </div>
        </nav>

        <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Hero */}
          <div className="anim-fade-up" style={{ marginBottom: '44px' }}>
            <p style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '12px',
            }}>
              ATS Analyzer
            </p>
            <h1 className="font-display" style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 700,
              letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px',
            }}>
              Know exactly what&apos;s missing.
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', maxWidth: '520px', lineHeight: 1.7 }}>
              Upload your resume PDF and paste a job description. Get your ATS score,
              missing keywords, and AI-rewritten bullet points in seconds.
            </p>
          </div>

          {/* Upload + JD Grid */}
          <div className="anim-fade-up d-100" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px', marginBottom: '20px',
          }}>
            {/* PDF Upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Resume PDF
              </label>
              <PdfUploadZone file={resumeFile} onFile={handleFile} onClear={handleClear} fileError={fileError} />
            </div>

            {/* Job Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Job Description
              </label>
              <textarea
                style={{
                  width: '100%', minHeight: '300px',
                  border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '16px',
                  fontSize: '0.875rem', lineHeight: 1.7,
                  resize: 'vertical', outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body, system-ui)',
                }}
                placeholder="Paste the job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={JD_MAX}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--dim)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {jobDescription.length} / {JD_MAX}
              </span>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="anim-fade-up d-200" style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              title={atLimit ? "You've used both free analyses this month. Upgrade to continue." : undefined}
              style={{
                width: '100%', maxWidth: '420px',
                background: canAnalyze ? 'var(--accent)' : 'var(--surface-3)',
                color: canAnalyze ? '#0d0d11' : 'var(--dim)',
                border: 'none', borderRadius: '12px',
                padding: '15px 24px', fontSize: '0.9375rem', fontWeight: 700,
                cursor: canAnalyze ? 'pointer' : 'not-allowed',
                letterSpacing: '-0.01em',
                transition: 'all 0.2s',
                boxShadow: canAnalyze ? '0 0 28px rgba(233,185,76,0.25)' : 'none',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    width: '17px', height: '17px', borderRadius: '50%',
                    border: '2px solid rgba(13,13,17,0.25)',
                    borderTopColor: '#0d0d11',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Analyzing your resume…
                </span>
              ) : 'Analyze My Resume'}
            </button>

            {atLimit && (
              <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
                Monthly limit reached.{' '}
                <button onClick={() => setShowPaywall(true)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline',
                  fontSize: '0.8rem',
                }}>
                  Upgrade for unlimited
                </button>
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '28px', padding: '16px 18px',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: '12px', color: 'var(--danger)',
              fontSize: '0.875rem', lineHeight: 1.6,
            }}>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="anim-fade-in">
              <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
                marginBottom: '44px',
              }} />
              <AnalysisResults result={result} />
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '36px', marginTop: '44px', borderTop: '1px solid var(--border-s)' }}>
                <button onClick={handleReset} style={{
                  background: 'none', border: '1px solid var(--border)',
                  color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem',
                  padding: '10px 24px', borderRadius: '10px', cursor: 'pointer',
                  transition: 'all 0.2s', letterSpacing: '-0.01em',
                }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(233,185,76,0.08)'; e.target.style.borderColor = 'rgba(233,185,76,0.4)' }}
                  onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.borderColor = 'var(--border)' }}
                >
                  ↑ Analyze Another Resume
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
