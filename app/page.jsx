import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function LandingPage({ searchParams }) {
  if (searchParams?.error_code) {
    redirect(`/analyze?auth_error=true`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border/60"
        style={{ background: 'rgba(13,13,17,0.8)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-xl font-bold tracking-tight">
            Resume<span style={{ color: 'var(--gold)' }}>Lens</span>
          </span>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/analyze">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="font-bold"
              style={{ background: 'var(--gold)', color: '#0d0d11' }}>
              <Link href="/analyze">Get Started Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="grid-bg relative overflow-hidden px-6 pt-24 pb-28">
        {/* Radial amber glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[520px] w-[720px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(233,185,76,0.11) 0%, transparent 68%)' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="anim-fade-up mb-7">
            <Badge variant="outline"
              className="border-[var(--gold)]/30 text-[var(--gold)] bg-[var(--gold)]/7 px-3 py-1 text-[0.7rem] tracking-[0.14em] uppercase font-bold rounded-full">
              Free ATS Resume Analyzer
            </Badge>
          </div>

          <h1 className="font-display anim-fade-up d-100 mb-6"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 4.75rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.035em' }}>
            Stop getting ghosted<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 300 }}>
              by ATS filters.
            </em>
          </h1>

          <p className="anim-fade-up d-200 text-muted-foreground mb-10 mx-auto max-w-lg leading-relaxed"
            style={{ fontSize: '1.0625rem' }}>
            Paste any job description. Upload your resume. Get your ATS score,
            missing keywords, and AI-rewritten bullets in under 30 seconds.
          </p>

          <div className="anim-fade-up d-300 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="font-bold text-[0.9375rem] px-7 h-12"
              style={{ background: 'var(--gold)', color: '#0d0d11', boxShadow: '0 0 32px rgba(233,185,76,0.3)' }}>
              <Link href="/analyze">Analyze My Resume →</Link>
            </Button>
            <Button variant="outline" size="lg" asChild
              className="text-muted-foreground border-border h-12 px-6 hover:text-foreground">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>

          {/* Score preview card */}
          <div className="anim-fade-up d-400 mt-14 inline-flex">
            <Card className="border-border/80 overflow-hidden">
              <CardContent className="p-0 flex items-stretch divide-x divide-border/60">
                {/* Mini score ring */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <svg width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="var(--surface-3)" strokeWidth="3.5" />
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#4ade80" strokeWidth="3.5"
                      strokeDasharray="125.7" strokeDashoffset="37.7"
                      strokeLinecap="round" transform="rotate(-90 25 25)" />
                    <text x="25" y="30" textAnchor="middle" fontSize="13" fontWeight="700"
                      fill="var(--foreground)" fontFamily="var(--font-display, Georgia), serif">73</text>
                  </svg>
                  <div className="text-left">
                    <p className="text-[0.68rem] font-semibold tracking-wide uppercase text-muted-foreground/60 mb-0.5">ATS Score</p>
                    <p className="text-sm font-bold" style={{ color: '#4ade80' }}>Good Match</p>
                  </div>
                </div>
                {/* Keyword chips */}
                <div className="flex flex-wrap items-center gap-1.5 px-5 py-4 max-w-[230px]">
                  {['React', 'TypeScript', 'Node.js'].map(k => (
                    <Badge key={k} variant="outline" className="text-[0.7rem] font-semibold rounded-full px-2.5"
                      style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--success)', borderColor: 'rgba(74,222,128,0.22)' }}>
                      {k}
                    </Badge>
                  ))}
                  {['Docker', 'K8s'].map(k => (
                    <Badge key={k} variant="outline" className="text-[0.7rem] font-semibold rounded-full px-2.5"
                      style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.22)' }}>
                      {k}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 py-24" style={{ background: 'var(--card)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[0.7rem] font-bold tracking-[0.14em] uppercase mb-3"
              style={{ color: 'var(--gold)' }}>Process</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Three steps.{' '}
              <em className="text-muted-foreground" style={{ fontWeight: 300 }}>Under a minute.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01', title: 'Upload your resume',
                desc: 'Drop your PDF. Works with any format — including Canva and design-tool exports. Max 5MB.',
                icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 3v5a1 1 0 001 1h5M9 13h6M9 17h4" /></svg>,
              },
              {
                step: '02', title: 'Paste the job description',
                desc: 'Copy from LinkedIn, Indeed, or anywhere. Paste the full description for best results.',
                icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
              },
              {
                step: '03', title: 'Get score, gaps & rewrites',
                desc: 'Instant ATS score, every missing keyword, and AI bullet rewrites in the job\'s own language.',
                icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
              },
            ].map(({ step, title, desc, icon }) => (
              <Card key={step} className="relative border-border/70 overflow-hidden group hover:border-[var(--gold)]/30 transition-colors duration-300">
                <CardContent className="p-7">
                  <div className="absolute top-5 right-5 font-display font-black select-none leading-none"
                    style={{ fontSize: '3.5rem', color: 'var(--border)', lineHeight: 1 }}>
                    {step}
                  </div>
                  <div className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(233,185,76,0.1)', color: 'var(--gold)' }}>
                    {icon}
                  </div>
                  <h3 className="text-[0.9375rem] font-semibold mb-2.5">{title}</h3>
                  <p className="text-[0.84rem] text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-24" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12 }}>
              Everything you need to{' '}
              <span style={{ color: 'var(--gold)' }}>beat the ATS.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-[0.9375rem] leading-relaxed">
              No generic advice. Results specific to your resume and this exact job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                gold: 'var(--gold)', goldDim: 'rgba(233,185,76,0.1)',
                title: 'ATS Keyword Score',
                desc: 'A 0–100 score showing how well your resume matches this job\'s ATS filter — based on real keyword overlap.',
                icon: <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>,
              },
              {
                gold: 'var(--danger)', goldDim: 'rgba(248,113,113,0.1)',
                title: 'Gap Analysis',
                desc: 'Know which keywords are missing and why they matter for this specific role. No guessing, no filler advice.',
                icon: <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
              },
              {
                gold: 'var(--success)', goldDim: 'rgba(74,222,128,0.1)',
                title: 'AI Bullet Rewrites',
                desc: 'AI-rewritten versions of your weakest bullets using the job\'s own language. Copy and paste directly.',
                icon: <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
              },
            ].map(({ gold, goldDim, title, desc, icon }) => (
              <Card key={title} className="border-border/70 hover:border-border transition-colors duration-300">
                <CardContent className="p-7">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: goldDim, color: gold }}>
                    {icon}
                  </div>
                  <h3 className="text-[0.9375rem] font-semibold mb-2.5">{title}</h3>
                  <p className="text-[0.84rem] text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-border/60" />

      {/* ── CTA ── */}
      <section className="px-6 py-24 text-center" style={{ background: 'var(--card)' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-display mb-5"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.08 }}>
            More callbacks<br />start here.
          </h2>
          <p className="text-muted-foreground mb-10 text-[0.9375rem] leading-relaxed">
            Free to start. 2 analyses per month. No credit card required.
          </p>
          <Button size="lg" asChild className="font-bold h-12 px-8 text-[0.9375rem]"
            style={{ background: 'var(--gold)', color: '#0d0d11', boxShadow: '0 0 40px rgba(233,185,76,0.3)' }}>
            <Link href="/analyze">Analyze My Resume — Free →</Link>
          </Button>
          <p className="mt-5 text-[0.78rem] text-muted-foreground/50">
            Joined by 500+ job seekers getting more callbacks
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-[0.8rem] border-t border-border/40 text-muted-foreground/40">
        ResumeLens © 2026 · Built for job seekers
      </footer>

    </div>
  )
}
