import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get the session
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Add 5 credits for testing
    const newCredits = userData.credits + 5
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update credits:', updateError)
      return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      newCredits
    })

  } catch (error) {
    console.error('Add credits error:', error)
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
  }
}