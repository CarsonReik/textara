import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type ContentType =
  | 'twitter-thread'
  | 'twitter-post'
  | 'linkedin-post'
  | 'blog-outline'
  | 'email-campaign'
  | 'ad-copy'
  | 'instagram-caption'
  | 'youtube-description'

export interface GenerationRequest {
  contentType: ContentType
  topic: string
  tone: 'professional' | 'casual' | 'funny' | 'inspirational' | 'educational'
  audience: string
  keywords?: string
  additionalContext?: string
}

const CONTENT_PROMPTS = {
  'twitter-thread': `Create an X (formerly Twitter) thread about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Start with a hook post (1/X)
    - 5-8 posts total
    - Each post under 280 characters
    {emojiInstruction}
    - End with a call-to-action
    - Number each post (1/X, 2/X, etc.)`,

  'twitter-post': `Create a single engaging X (formerly Twitter) post about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Under 280 characters
    - Include relevant hashtags
    {emojiInstruction}
    - Make it engaging and shareable`,

  'linkedin-post': `Create a LinkedIn post about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Professional but engaging
    - 1-3 paragraphs
    - Include a call-to-action
    - Use line breaks for readability
    - Add relevant hashtags at the end`,

  'blog-outline': `Create a detailed blog post outline about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Compelling title
    - Introduction hook
    - 5-8 main sections with subpoints
    - Conclusion with call-to-action
    - SEO-friendly structure`,

  'email-campaign': `Create an email marketing campaign about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Compelling subject line
    - Personal greeting
    - Clear value proposition
    - 2-3 main points
    - Strong call-to-action
    - Professional signature`,

  'ad-copy': `Create advertising copy about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Attention-grabbing headline
    - Clear benefits
    - Strong call-to-action
    - Under 100 words
    - Include urgency or scarcity if appropriate`,

  'instagram-caption': `Create an Instagram caption about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Engaging hook in first line
    - 2-3 paragraphs
    {emojiInstruction}
    - Relevant hashtags (10-15)
    - Call-to-action`,

  'youtube-description': `Create a YouTube video description about "{topic}" for {audience}.
    Tone: {tone}
    Keywords to include: {keywords}
    Additional context: {additionalContext}

    Requirements:
    - Compelling first 2 lines (visible before "show more")
    - Detailed description
    - Timestamps if applicable
    - Links and resources
    - Call-to-action to subscribe
    - Relevant tags`
}

export async function generateContent(request: GenerationRequest): Promise<string> {
  // Determine emoji instruction based on tone and additional context
  let emojiInstruction = ''
  const context = request.additionalContext?.toLowerCase() || ''

  if (context.includes('no emoji') || context.includes('do not use emoji') || context.includes('without emoji')) {
    emojiInstruction = '- STRICTLY NO EMOJIS - Use only text and punctuation'
  } else if (request.tone === 'professional' || request.tone === 'educational') {
    emojiInstruction = '- Use minimal or no emojis for professional tone'
  } else if (request.tone === 'funny' || request.tone === 'inspirational') {
    emojiInstruction = '- Use emojis appropriately to enhance the message'
  } else {
    emojiInstruction = '- Use emojis if they add value'
  }

  const prompt = CONTENT_PROMPTS[request.contentType]
    .replace('{topic}', request.topic)
    .replace('{audience}', request.audience)
    .replace('{tone}', request.tone)
    .replace('{keywords}', request.keywords || 'None specified')
    .replace('{additionalContext}', request.additionalContext || 'None')
    .replace('{emojiInstruction}', emojiInstruction)

  // Add extra enforcement for no-emoji requests
  let systemMessage = 'You are an expert content marketer and copywriter. Create high-quality, engaging content that drives results. Be creative, persuasive, and authentic.'

  if (context.includes('no emoji') || context.includes('do not use emoji') || context.includes('without emoji')) {
    systemMessage += ' IMPORTANT: The user has specifically requested NO EMOJIS. Do not include any emojis (😊🎉📈💪 etc.) in your response. Use only letters, numbers, and punctuation.'
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Failed to generate content'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate content')
  }
}