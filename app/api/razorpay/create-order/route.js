import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export async function POST(request) {
  const token = request.headers.get('authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const order = await razorpay.orders.create({
      amount: 49900,
      currency: 'INR',
      receipt: `receipt_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        email: user.email,
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[razorpay] create-order error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
