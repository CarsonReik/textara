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
  const [credits, setCredits] = useState(3)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCredits(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCredits(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCredits = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single()

      if (data) {
        setCredits(data.credits)
      }
    } catch (error) {
      console.error('Error fetching credits:', error)
      setCredits(3) // Default
    }
  }

  const handleCreditsUpdate = (newCredits: number) => {
    setCredits(newCredits)
  }

  const handleGetStarted = () => {
    setShowAuth(true)
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