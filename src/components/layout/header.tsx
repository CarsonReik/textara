'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { formatCredits } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { Sparkles, LogOut, CreditCard } from 'lucide-react'

interface HeaderProps {
  user: User | null
  credits: number
  onCreditsUpdate?: (credits: number) => void
}

export function Header({ user, credits, onCreditsUpdate }: HeaderProps) {
  const [tier, setTier] = useState<string>('free')

  const fetchUserData = useCallback(async () => {
    if (!user) return

    const { data } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (data) {
      setTier(data.subscription_tier)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user, fetchUserData])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }


  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'starter': return 'text-blue-600'
      case 'pro': return 'text-purple-600'
      case 'business': return 'text-gold-600'
      default: return 'text-gray-600'
    }
  }

  const getTierDisplay = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1)
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Textara
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg border">
              <CreditCard className="h-4 w-4 text-gray-700" />
              <span className="font-semibold text-gray-900">{formatCredits(credits)} credits</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white border ${getTierColor(tier)}`}>
                {getTierDisplay(tier)}
              </span>
            </div>

            <div className="text-sm text-gray-700 font-medium">
              {user.email}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}