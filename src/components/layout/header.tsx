'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { formatCredits } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { Sparkles, LogOut, CreditCard, Plus } from 'lucide-react'

interface HeaderProps {
  user: User | null
  credits: number
  onCreditsUpdate?: (credits: number) => void
}

export function Header({ user, credits, onCreditsUpdate }: HeaderProps) {
  const [tier, setTier] = useState<string>('free')

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    const { data } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (data) {
      setTier(data.subscription_tier)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleAddCredits = async () => {
    if (!user) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/add-credits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (onCreditsUpdate) {
          onCreditsUpdate(data.newCredits)
        }
      }
    } catch (error) {
      console.error('Failed to add credits:', error)
    }
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
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Textara
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                <CreditCard className="h-4 w-4 text-gray-700" />
                <span className="font-semibold text-gray-900">{formatCredits(credits)} credits</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white border ${getTierColor(tier)}`}>
                  {getTierDisplay(tier)}
                </span>
              </div>

              <Button
                onClick={handleAddCredits}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
              >
                <Plus className="h-4 w-4" />
                +5 Credits
              </Button>
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