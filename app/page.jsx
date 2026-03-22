import Link from 'next/link'
import { redirect } from 'next/navigation'

/* ─── Landing Page (Server Component) ─── */
export default function LandingPage({ searchParams }) {
  if (searchParams?.error_code) {
    redirect(`/analyze?auth_error=true`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,13,17,0.82)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-s)',
      }}>
        <div style={{
          maxWidth: '1080px', margin: '0 auto',
          padding: '0 24px', height: '62px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span className="font-display" style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            Resume<span style={{ color: 'var(--accent)' }}>Lens</span>
          </span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link href="/analyze" style={{
              color: 'var(--muted)', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 500,
              padding: '7px 14px', borderRadius: '8px',
            }}>
              Sign In
            </Link>
            <Link href="/analyze" style={{
              background: 'var(--accent)', color: '#0d0d11',
              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700,
              padding: '8px 18px', borderRadius: '8px', letterSpacing: '-0.01em',
            }}>
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="grid-bg" style={{ position: 'relative', padding: '96px 24px 112px', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(233,185,76,0.1) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <span className="anim-fade-up" style={{
            display: 'inline-block',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--accent)',
            border: '1px solid rgba(233,185,76,0.28)',
            background: 'rgba(233,185,76,0.07)',
            padding: '5px 14px', borderRadius: '100px',
            marginBottom: '32px',
          }}>
            Free ATS Resume Analyzer
          </span>

          <h1 className="font-display anim-fade-up d-100" style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 4.75rem)',
            fontWeight: 700, lineHeight: 1.08,
            letterSpacing: '-0.035em', marginBottom: '26px',
          }}>
            Stop getting ghosted<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>
              by ATS filters.
            </em>
          </h1>

          <p className="anim-fade-up d-200" style={{
            fontSize: '1.1rem', color: 'var(--muted)',
            maxWidth: '540px', margin: '0 auto 44px',
            lineHeight: 1.75,
          }}>
            Paste any job description. Upload your resume. Get your ATS score,
            missing keywords, and AI-rewritten bullets in under 30 seconds.
          </p>

          <div className="anim-fade-up d-300" style={{
            display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <Link href="/analyze" style={{
              background: 'var(--accent)', color: '#0d0d11',
              fontWeight: 700, fontSize: '0.9375rem',
              padding: '14px 28px', borderRadius: '10px',
              textDecoration: 'none', letterSpacing: '-0.01em',
              boxShadow: '0 0 32px rgba(233,185,76,0.28)',
            }}>
              Analyze My Resume →
            </Link>
            <a href="#how-it-works" style={{
              color: 'var(--muted)', fontWeight: 500, fontSize: '0.9375rem',
              padding: '14px 24px', borderRadius: '10px',
              textDecoration: 'none', border: '1px solid var(--border)',
            }}>
              See how it works
            </a>
          </div>

          {/* Floating score preview mockup */}
          <div className="anim-fade-up d-400" style={{
            marginTop: '60px',
            display: 'inline-flex', alignItems: 'center', gap: '0',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '18px', padding: '0', overflow: 'hidden',
          }}>
            {/* Score mini ring */}
            <div style={{
              padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px',
              borderRight: '1px solid var(--border)',
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="19" fill="none" stroke="var(--surface-3)" strokeWidth="3.5" />
                <circle cx="24" cy="24" r="19" fill="none" stroke="#4ade80" strokeWidth="3.5"
                  strokeDasharray="119.4" strokeDashoffset="35.8"
                  strokeLinecap="round" transform="rotate(-90 24 24)" />
                <text x="24" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">73</text>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--dim)', marginBottom: '2px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>ATS Score</p>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4ade80' }}>Good Match</p>
              </div>
            </div>
            {/* Keyword chips */}
            <div style={{ padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '240px' }}>
              {['React', 'TypeScript', 'Node.js'].map(k => (
                <span key={k} style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: '100px',
                  background: 'rgba(74,222,128,0.1)', color: 'var(--success)',
                  border: '1px solid rgba(74,222,128,0.18)',
                }}>{k}</span>
              ))}
              {['Docker', 'K8s'].map(k => (
                <span key={k} style={{
                  fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: '100px',
                  background: 'rgba(248,113,113,0.1)', color: 'var(--danger)',
                  border: '1px solid rgba(248,113,113,0.18)',
                }}>{k}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '14px',
            }}>Process</p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700,
              letterSpacing: '-0.03em', lineHeight: 1.12,
            }}>
              Three steps.<br />
              <span style={{ color: 'var(--muted)', fontWeight: 300, fontStyle: 'italic' }}>Under a minute.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            {[
              {
                step: '01',
                title: 'Upload your resume',
                desc: 'Drop your PDF. Works with any format — including Canva and design-tool exports. Max 5MB.',
                icon: (
                  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 3v5a1 1 0 001 1h5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6M9 17h4" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Paste the job description',
                desc: 'Copy from LinkedIn, Indeed, or anywhere. Paste the full description — the more detail, the better.',
                icon: (
                  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Get score, gaps & rewrites',
                desc: 'Instant ATS score, every missing keyword, and AI bullet rewrites in the exact language of the job.',
                icon: (
                  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '32px 28px', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '18px', right: '22px',
                  fontSize: '2.75rem', fontWeight: 900, lineHeight: 1,
                  color: 'var(--border)', fontFamily: 'var(--font-display)',
                  userSelect: 'none',
                }}>
                  {step}
                </div>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: 'rgba(233,185,76,0.1)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '22px',
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '10px', color: 'var(--text)' }}>{title}</h3>
                <p style={{ fontSize: '0.8375rem', color: 'var(--muted)', lineHeight: 1.72 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="font-display" style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 700,
              letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: '16px',
            }}>
              Everything you need to<br />
              <span style={{ color: 'var(--accent)' }}>beat the ATS.</span>
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: '460px', margin: '0 auto', lineHeight: 1.72, fontSize: '0.9375rem' }}>
              No generic advice. Results specific to your resume and this exact job posting.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            {[
              {
                accent: 'var(--accent)', accentDim: 'rgba(233,185,76,0.1)',
                title: 'ATS Keyword Score',
                desc: 'A 0–100 score showing exactly how well your resume matches this job\'s ATS filter. Based on real keyword overlap.',
                icon: (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                  </svg>
                ),
              },
              {
                accent: 'var(--danger)', accentDim: 'rgba(248,113,113,0.1)',
                title: 'Gap Analysis',
                desc: 'Know which keywords are missing and why they matter for this specific role. No guessing, no filler advice.',
                icon: (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                accent: 'var(--success)', accentDim: 'rgba(74,222,128,0.1)',
                title: 'AI Bullet Rewrites',
                desc: 'AI-rewritten versions of your weakest bullets using the job\'s own language. Copy and paste directly into your resume.',
                icon: (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
              },
            ].map(({ accent, accentDim, title, desc, icon }) => (
              <div key={title} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '32px 28px',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: accentDim, color: accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '22px',
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '10px' }}>{title}</h3>
                <p style={{ fontSize: '0.8375rem', color: 'var(--muted)', lineHeight: 1.72 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '88px 24px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <h2 className="font-display" style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontWeight: 700,
            letterSpacing: '-0.035em', lineHeight: 1.08, marginBottom: '20px',
          }}>
            More callbacks<br />start here.
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '0.9375rem', lineHeight: 1.7 }}>
            Free to start. 2 analyses per month. No credit card required.
          </p>
          <Link href="/analyze" style={{
            display: 'inline-block',
            background: 'var(--accent)', color: '#0d0d11',
            fontWeight: 700, fontSize: '0.9375rem',
            padding: '14px 32px', borderRadius: '10px',
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: '0 0 40px rgba(233,185,76,0.3)',
          }}>
            Analyze My Resume — Free →
          </Link>
          <p style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--dim)' }}>
            Joined by 500+ job seekers getting more callbacks
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '24px', textAlign: 'center',
        fontSize: '0.8rem', color: 'var(--dim)',
        borderTop: '1px solid var(--border-s)',
      }}>
        ResumeLens © 2026 · Built for job seekers
      </footer>

    </div>
  )
}
