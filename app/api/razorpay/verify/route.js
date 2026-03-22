import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

  // Verify signature: HMAC-SHA256(order_id|payment_id, key_secret)
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    console.error('[razorpay] signature mismatch for user', user.id)
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      plan: 'pro',
      razorpay_payment_id,
      upgraded_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('[razorpay] plan upgrade error:', updateError.message)
    return NextResponse.json({ error: 'Payment verified but upgrade failed' }, { status: 500 })
  }

  console.log(`[razorpay] user ${user.id} upgraded to pro | payment ${razorpay_payment_id}`)
  return NextResponse.json({ success: true, plan: 'pro' })
}
