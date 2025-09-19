import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const priceId = subscription.items.data[0]?.price.id

          // Determine credits based on price ID
          let credits = 50 // Default for Starter
          let subscriptionTier = 'starter'

          if (priceId === 'price_1S8vVPGpIponA3aZP12ZLNxv') { // Pro
            credits = 500
            subscriptionTier = 'pro'
          } else if (priceId === 'price_1S8vVhGpIponA3aZbgv5ZU0W') { // Business
            credits = -1 // Unlimited
            subscriptionTier = 'business'
          }

          // Update user in Supabase
          await supabase
            .from('users')
            .update({
              credits: credits,
              subscription_tier: subscriptionTier,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
          // Renewal payment - reset credits
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )

          const priceId = subscription.items.data[0]?.price.id
          let credits = 50 // Default for Starter

          if (priceId === 'price_1S8vVPGpIponA3aZP12ZLNxv') { // Pro
            credits = 500
          } else if (priceId === 'price_1S8vVhGpIponA3aZbgv5ZU0W') { // Business
            credits = -1 // Unlimited
          }

          // Find user by stripe_subscription_id and reset credits
          await supabase
            .from('users')
            .update({ credits: credits })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Downgrade user to free tier
        await supabase
          .from('users')
          .update({
            credits: 3,
            subscription_tier: 'free',
            stripe_customer_id: null,
            stripe_subscription_id: null,
          })
          .eq('stripe_subscription_id', subscription.id)
        break
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