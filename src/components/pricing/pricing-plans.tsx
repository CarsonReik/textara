'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI content generation',
    credits: '3 generations per month',
    features: [
      'AI content generation',
      'All content types (Twitter, LinkedIn, etc.)',
      'Copy to clipboard',
      'Basic email support'
    ],
    buttonText: 'Current Plan',
    isPopular: false,
    disabled: true,
    priceId: null
  },
  {
    name: 'Starter',
    price: '$29',
    period: 'month',
    description: 'Great for solo creators and small businesses',
    credits: '50 generations per month',
    features: [
      'Everything in Free',
      '50 AI content generations',
      'Priority email support',
      'Coming soon: Content history'
    ],
    buttonText: 'Upgrade Now',
    isPopular: true,
    disabled: false,
    priceId: 'price_1S8vVCGpIponA3aZsHWzMmCq'
  },
  {
    name: 'Pro',
    price: '$79',
    period: 'month',
    description: 'Perfect for growing marketing teams',
    credits: '500 generations per month',
    features: [
      'Everything in Starter',
      '500 AI content generations',
      'Coming soon: Advanced AI models',
      'Coming soon: Team collaboration',
      'Coming soon: Analytics dashboard'
    ],
    buttonText: 'Upgrade Now',
    isPopular: false,
    disabled: false,
    priceId: 'price_1S8vVPGpIponA3aZP12ZLNxv'
  },
  {
    name: 'Business',
    price: '$199',
    period: 'month',
    description: 'For agencies and enterprise teams',
    credits: 'Unlimited generations',
    features: [
      'Everything in Pro',
      'Unlimited AI content generations',
      'Coming soon: Dedicated account manager',
      'Coming soon: Custom integrations',
      'Coming soon: White-label options',
      'Priority phone support'
    ],
    buttonText: 'Upgrade Now',
    isPopular: false,
    disabled: false,
    priceId: 'price_1S8vVhGpIponA3aZbgv5ZU0W'
  }
]

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleUpgrade = async (planName: string, priceId: string) => {
    setLoadingPlan(planName)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('Please sign in to upgrade your plan')
        setLoadingPlan(null)
        return
      }

      console.log('Making request to:', '/api/stripe/checkout')
      console.log('Request body:', { priceId, userId: user.id })

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.id,
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Failed to start checkout process. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }


  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start for free and scale as you grow. All plans include access to our powerful AI content generation tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative transition-all duration-300 hover:shadow-lg h-full flex flex-col ${
              plan.isPopular
                ? 'border-purple-600 shadow-lg scale-105'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Most Popular
                </div>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-900">{plan.credits}</div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => plan.priceId && handleUpgrade(plan.name, plan.priceId)}
                disabled={plan.disabled || loadingPlan === plan.name}
                className={`w-full mt-6 ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : ''
                }`}
                variant={plan.disabled ? 'secondary' : 'default'}
              >
                {loadingPlan === plan.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Need a custom solution?</h3>
          <p className="text-gray-800 mb-6">
            We offer custom pricing for high-volume users, specialized integrations, and white-label solutions.
          </p>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            onClick={() => alert('For custom solutions, please email: carsonreik@gmail.com')}
          >
            Contact Sales Team
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-700">
        <p>All plans include a 7-day money-back guarantee. No setup fees. Cancel anytime.</p>
      </div>

    </div>
  )
}