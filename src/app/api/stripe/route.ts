import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing priceId or userId' },
        { status: 400 }
      )
    }

    // For now, just return success without creating actual Stripe session
    // We'll add Stripe back once this basic version works
    return NextResponse.json({
      url: 'https://checkout.stripe.com/test-url',
      message: 'Route working, Stripe integration coming next'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Stripe GET route working' })
}