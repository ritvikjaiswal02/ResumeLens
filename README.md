# ResumeMax

ATS resume analyzer — paste a job description, upload your resume, get your keyword score, gap analysis, and AI-rewritten bullets in under 30 seconds.

**Live:** [resumemax.in](https://resumemax.in)

---

## Features

| Feature | Free | Pro |
|---|---|---|
| ATS Keyword Score (0–100) | ✅ 5/month | ✅ Unlimited |
| Missing Keyword Analysis | ✅ | ✅ |
| AI Bullet Rewrites | ✅ | ✅ |
| Cover Letter Generator | ❌ | ✅ |
| Interview Prep (STAR) | ❌ | ✅ |
| Cold Outreach Generator | ❌ | ✅ |
| Analysis History | ✅ | ✅ |
| Referral Bonus (+2/referral) | ✅ | ✅ |

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Framer Motion
- **Auth:** Supabase Auth (Google OAuth + Magic Link)
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o
- **Payments:** Razorpay (one-time, INR)
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics + GA4

---

## Local Setup

**1. Clone**
```bash
git clone https://github.com/ritvikjaiswal02/ResumeMax.git
cd ResumeMax
npm install
```

**2. Environment variables** — create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

**3. Run**
```bash
npm run dev
```

---

## Pricing

| Plan | Price | Analyses |
|---|---|---|
| Free | ₹0 | 5/month |
| Sprint | ₹99 | 15 |
| Grind | ₹249 | 50 |
| Placement | ₹499 | Unlimited |

One-time payment. No subscriptions.

---

## Referral System

Share your referral link — both you and the new user get +2 free analyses when they sign up. Referral codes are tracked via URL params and persisted through OAuth redirects.

---

## Security

- PDF magic bytes validation (not just MIME type)
- File size limits on all upload endpoints
- Input length capped before LLM calls
- Rate limiting: 20 requests/min per user on analyze
- No API keys exposed to client
- Supabase RLS enforced on all tables
