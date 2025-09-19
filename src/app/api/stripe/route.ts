import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing priceId or userId' },
        { status: 400 }
      )
    }

    // Test environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      )
    }

    // Try importing Stripe dynamically to avoid build issues
    const Stripe = (await import('stripe')).default

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    })

    // Get user email using dynamic import to avoid build issues
    const { supabase } = await import('@/lib/supabase')
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (!user?.email) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userEmail = user.email

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${appUrl}/?success=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: { userId },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: `Stripe error: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Stripe GET route working' })
}