'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI content generation',
    credits: '3 generations/month',
    features: [
      'All content types',
      'Basic templates',
      'Email support',
      'Copy to clipboard'
    ],
    buttonText: 'Current Plan',
    isPopular: false,
    disabled: true
  },
  {
    name: 'Starter',
    price: '$29',
    period: 'month',
    description: 'Great for solo creators and small businesses',
    credits: '50 generations/month',
    features: [
      'All content types',
      'Advanced templates',
      'Priority support',
      'Content history',
      'Export options',
      'Team collaboration (2 seats)'
    ],
    buttonText: 'Upgrade Now',
    isPopular: true,
    disabled: false
  },
  {
    name: 'Pro',
    price: '$79',
    period: 'month',
    description: 'Perfect for growing marketing teams',
    credits: '500 generations/month',
    features: [
      'Everything in Starter',
      'Advanced AI models',
      'Custom templates',
      'API access',
      'Analytics dashboard',
      'Team collaboration (10 seats)',
      'White-label options'
    ],
    buttonText: 'Upgrade Now',
    isPopular: false,
    disabled: false
  },
  {
    name: 'Business',
    price: '$199',
    period: 'month',
    description: 'For agencies and enterprise teams',
    credits: 'Unlimited generations',
    features: [
      'Everything in Pro',
      'Unlimited generations',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced analytics',
      'Unlimited team seats',
      'Priority phone support',
      'Custom onboarding'
    ],
    buttonText: 'Contact Sales',
    isPopular: false,
    disabled: false
  }
]

export function PricingPlans() {
  const handleUpgrade = (planName: string) => {
    if (planName === 'Business') {
      // Contact sales
      window.open('mailto:sales@aicontentstudio.com?subject=Business Plan Inquiry', '_blank')
    } else {
      // Handle subscription upgrade
      alert(`Upgrading to ${planName} plan... (Payment integration coming soon!)`)
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
            className={`relative transition-all duration-300 hover:shadow-lg ${
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

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.disabled}
                className={`w-full mt-6 ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : ''
                }`}
                variant={plan.disabled ? 'secondary' : 'default'}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
          <p className="text-gray-600 mb-6">
            We offer custom pricing for high-volume users, specialized integrations, and white-label solutions.
          </p>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            onClick={() => window.open('mailto:sales@aicontentstudio.com?subject=Custom Solution Inquiry', '_blank')}
          >
            Contact Sales Team
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>All plans include a 7-day money-back guarantee. No setup fees. Cancel anytime.</p>
      </div>
    </div>
  )
}