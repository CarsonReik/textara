import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Import Stripe dynamically to avoid build issues
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    })

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId
      const priceId = session.line_items?.data[0]?.price?.id

      if (!userId) {
        console.error('No userId in session metadata')
        return NextResponse.json({ received: true })
      }

      // Determine credits based on price ID
      let creditsToAdd = 0
      switch (priceId) {
        case 'price_1S8vVCGpIponA3aZsHWzMmCq': // Starter
          creditsToAdd = 50
          break
        case 'price_1S8vVPGpIponA3aZP12ZLNxv': // Pro
          creditsToAdd = 500
          break
        case 'price_1S8vVhGpIponA3aZbgv5ZU0W': // Business
          creditsToAdd = 10000 // Unlimited represented as high number
          break
        default:
          console.error('Unknown price ID:', priceId)
          return NextResponse.json({ received: true })
      }

      // Update user credits using dynamic import
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('users')
        .update({
          credits: creditsToAdd,
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription
        })
        .eq('id', userId)

      if (error) {
        console.error('Failed to update user credits:', error)
      } else {
        console.log(`Added ${creditsToAdd} credits to user ${userId}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}