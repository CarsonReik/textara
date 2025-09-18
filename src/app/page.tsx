'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthForm } from '@/components/auth/auth-form'
import { Header } from '@/components/layout/header'
import { ContentGenerator } from '@/components/generator/content-generator'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Create user profile on first sign up and fetch credits
  useEffect(() => {
    if (user) {
      createUserProfile()
      fetchCredits()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const createUserProfile = async () => {
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
  }

  const fetchCredits = async () => {
    if (!user) return

    const { data } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <Header user={user} credits={credits} onCreditsUpdate={handleCreditsUpdate} />
      <ContentGenerator onCreditsUpdate={handleCreditsUpdate} />
    </div>
  )
}