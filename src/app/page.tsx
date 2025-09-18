'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Header } from '@/components/layout/header'
import ContentGenerator from '@/components/generator/content-generator'
import { AuthForm } from '@/components/auth/auth-form'
import { LandingPage } from '@/components/landing/landing-page'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserCredits(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserCredits(session.user.id)
      } else {
        setCredits(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserCredits = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (data) {
      setCredits(data.credits)
    }
  }

  const handleCreditsUpdate = (newCredits: number) => {
    setCredits(newCredits)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleGetStarted = () => {
    setShowAuth(true)
  }

  if (!user && !showAuth) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (!user && showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} credits={credits} onCreditsUpdate={handleCreditsUpdate} />
      <ContentGenerator onCreditsUpdate={handleCreditsUpdate} />
    </div>
  )
}