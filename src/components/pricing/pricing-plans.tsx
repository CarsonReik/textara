'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Sparkles, X } from 'lucide-react'

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
    disabled: true
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
    disabled: false
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
      'Unlimited AI content generations',
      'Coming soon: Dedicated account manager',
      'Coming soon: Custom integrations',
      'Coming soon: White-label options',
      'Priority phone support'
    ],
    buttonText: 'Contact Sales',
    isPopular: false,
    disabled: false
  }
]

export function PricingPlans() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [showEmailSent, setShowEmailSent] = useState(false)

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName)
    setContactMessage(`Hi! I'd like to upgrade to the ${planName} plan. Please send me payment details.`)
    setShowContactForm(true)
  }

  const handleSubmitContact = () => {
    // Show success message instead of trying mailto
    setShowContactForm(false)
    setShowEmailSent(true)
    setContactEmail('')
    setContactMessage('')

    // Auto-hide the success message after 10 seconds
    setTimeout(() => {
      setShowEmailSent(false)
    }, 10000)
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
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Need a custom solution?</h3>
          <p className="text-gray-800 mb-6">
            We offer custom pricing for high-volume users, specialized integrations, and white-label solutions.
          </p>
          <Button
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            onClick={() => {
              setSelectedPlan('Custom Solution')
              setShowEmailSent(true)
              setTimeout(() => setShowEmailSent(false), 10000)
            }}
          >
            Contact Sales Team
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-700">
        <p>All plans include a 7-day money-back guarantee. No setup fees. Cancel anytime.</p>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div
          className="bg-black/50 flex items-center justify-center z-[9999] p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6 bounce-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="text-center">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upgrade to {selectedPlan}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContactForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>

              <p className="text-gray-700 mb-4">
                Ready to upgrade? Email us directly:
              </p>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-mono text-sm text-gray-900 select-all">carsonreik@gmail.com</p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Include your contact details and mention the <strong>{selectedPlan}</strong> plan.
              </p>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Stripe integration coming soon!</p>
              </div>

              <Button
                onClick={() => setShowContactForm(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email Sent Success Modal */}
      {showEmailSent && (
        <div
          className="bg-black/50 flex items-center justify-center z-[9999] p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6 bounce-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Received!</h3>
              <p className="text-gray-700 mb-4">
                Thanks for your interest! Please email us directly at:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="font-mono text-sm text-gray-900 select-all">carsonreik@gmail.com</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Include your contact details and mention the <strong>{selectedPlan}</strong> plan.
              </p>
              <Button
                onClick={() => setShowEmailSent(false)}
                className="w-full"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}