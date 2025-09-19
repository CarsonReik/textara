import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Stripe route hit with:', body)
    return NextResponse.json({
      message: 'Stripe POST route working',
      received: body
    })
  } catch (error) {
    console.error('Stripe route error:', error)
    return NextResponse.json({ error: 'Route error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Stripe GET route working' })
}