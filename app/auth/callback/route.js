import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const ref  = searchParams.get('ref')
  const next = searchParams.get('next') ?? '/analyze'

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(`${origin}/analyze?auth_error=true`)

    /* ── Handle referral for new users ── */
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const admin = createAdminClient()
        const { data: existing } = await admin
          .from('profiles')
          .select('id, referral_code')
          .eq('id', user.id)
          .single()

        if (!existing) {
          /* New user — create profile with referral_code */
          const referralCode = user.id.slice(0, 8)
          const insertData = {
            id:            user.id,
            email:         user.email,
            plan:          'free',
            analyses_used: 0,
            referral_code: referralCode,
            bonus_analyses: 0,
          }
          if (ref) {
            insertData.referred_by   = ref
            insertData.bonus_analyses = 2
          }
          await admin.from('profiles').insert(insertData)

          /* Credit the referrer +2 */
          if (ref) {
            const { data: referrer } = await admin
              .from('profiles')
              .select('id, bonus_analyses')
              .eq('referral_code', ref)
              .single()
            if (referrer) {
              await admin
                .from('profiles')
                .update({ bonus_analyses: (referrer.bonus_analyses ?? 0) + 2 })
                .eq('id', referrer.id)
            }
          }
        } else if (!existing.referral_code) {
          /* Existing user missing referral_code — backfill */
          await admin
            .from('profiles')
            .update({ referral_code: user.id.slice(0, 8) })
            .eq('id', user.id)
        }
      }
    } catch (e) {
      console.error('[callback] referral handling error:', e.message)
    }

    return response
  }

  return NextResponse.redirect(`${origin}/analyze?auth_error=true`)
}
