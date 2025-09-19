'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthForm } from '@/components/auth/auth-form'
import { Header } from '@/components/layout/header'
import { ContentGenerator } from '@/components/generator/content-generator'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(3)
  const [showAuth, setShowAuth] = useState(false)

  const fetchUserCredits = async (userId: string) => {
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
      console.error('Failed to fetch user credits:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth session error:', error)
          setUser(null)
        } else {
          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchUserCredits(session.user.id)
          }
        }
      } catch (error) {
        console.error('Failed to get session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserCredits(session.user.id)
      } else {
        setCredits(0)
      }

      // Ensure loading is false after auth state change
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = useCallback(async () => {
    if (!user) return

    // Check if user profile exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    // Create profile if it doesn't exist
    if (!existingUser) {
      await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          credits: 3,
          subscription_tier: 'free'
        })
    }
  }, [user])

  const fetchCredits = useCallback(async () => {
    if (!user) return

    const { data } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (data) {
      setCredits(data.credits)
    }
  }, [user])

  // Create user profile on first sign up and fetch credits
  useEffect(() => {
    if (user) {
      createUserProfile()
      fetchCredits()
    }
  }, [user, createUserProfile, fetchCredits])

  const handleCreditsUpdate = (newCredits: number) => {
    setCredits(newCredits)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <Header user={user} credits={credits} onCreditsUpdate={handleCreditsUpdate} />
      <ContentGenerator onCreditsUpdate={handleCreditsUpdate} />
    </div>
  )
}