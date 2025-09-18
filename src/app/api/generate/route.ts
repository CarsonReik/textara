import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateContent, GenerationRequest } from '@/lib/openai'

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
      .select('credits, subscription_tier')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough credits
    if (userData.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
    }

    // Parse the request body
    const body: GenerationRequest = await request.json()

    // Validate required fields
    if (!body.contentType || !body.topic || !body.audience || !body.tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate content using OpenAI
    const generatedContent = await generateContent(body)

    // Deduct a credit
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: userData.credits - 1 })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update credits:', updateError)
    }

    // Save the generation to history
    const { error: historyError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        content_type: body.contentType,
        prompt: `Topic: ${body.topic}, Audience: ${body.audience}, Tone: ${body.tone}`,
        generated_content: generatedContent,
      })

    if (historyError) {
      console.error('Failed to save generation history:', historyError)
    }

    return NextResponse.json({
      content: generatedContent,
      creditsRemaining: userData.credits - 1
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}