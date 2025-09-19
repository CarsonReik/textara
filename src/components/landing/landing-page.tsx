'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Zap, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-purple-600" />,
      title: "AI-Powered Generation",
      description: "Advanced GPT models create engaging, high-quality content tailored to your needs"
    },
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: "Lightning Fast",
      description: "Generate professional content in seconds, not hours"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Multiple Platforms",
      description: "Twitter, LinkedIn, Instagram, blogs, emails, and more"
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "Save Time",
      description: "Focus on strategy while AI handles content creation"
    }
  ]

  const contentTypes = [
    "Twitter Threads",
    "LinkedIn Posts",
    "Blog Outlines",
    "Email Campaigns",
    "Ad Copy",
    "Instagram Captions"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-12 w-12 text-purple-600" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Textara
              </h1>
            </div>

            <h2 className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              AI-Powered Content Generation for Marketers, Creators & Businesses
            </h2>

            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Create high-quality social media posts, blog outlines, email campaigns, and more with advanced AI.
              Save hours of work and never run out of content ideas again.
            </p>

            <div className="flex justify-center mb-12">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>

            <div className="text-sm text-gray-500 mb-6">
              ✨ Start with 3 free generations • No credit card required
            </div>

            <div className="flex justify-center">
              <a
                href="https://www.producthunt.com/products/textara?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-textara"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform duration-200"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1017714&theme=neutral&t=1758249194677"
                  alt="Textara - All in one marketing tool for startup creators | Product Hunt"
                  style={{ width: '250px', height: '54px' }}
                  width="250"
                  height="54"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Why Choose Textara?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group text-center border-0 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Types Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Create Content for Every Platform
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {contentTypes.map((type, index) => (
              <div key={index} className="group flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-purple-50 hover:to-blue-100 transition-all duration-300 cursor-pointer transform hover:scale-105">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 group-hover:text-green-700 transition-colors duration-200" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Content Strategy?
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers and creators who use Textara to generate engaging content in seconds.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            variant="secondary"
            className="group bg-white text-purple-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Start Creating Now
            <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </div>
  )
}