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
  // Default to NO emojis unless explicitly requested
  let emojiInstruction = '- DO NOT use emojis - Use only text and punctuation'
  const context = request.additionalContext?.toLowerCase() || ''

  // Only allow emojis if explicitly requested
  if (context.includes('use emoji') || context.includes('with emoji') || context.includes('include emoji')) {
    emojiInstruction = '- Use emojis appropriately to enhance the message'
  }

  const prompt = CONTENT_PROMPTS[request.contentType]
    .replace('{topic}', request.topic)
    .replace('{audience}', request.audience)
    .replace('{tone}', request.tone)
    .replace('{keywords}', request.keywords || 'None specified')
    .replace('{additionalContext}', request.additionalContext || 'None')
    .replace('{emojiInstruction}', emojiInstruction)

  // Default system message with no emojis unless requested
  let systemMessage = 'You are an expert content marketer and copywriter. Create high-quality, engaging content that drives results. Be creative, persuasive, and authentic. CRITICAL: Do not use ANY emojis anywhere in your response - not at the beginning, middle, or end. Do not start with rocket emojis or any other symbols. Use only letters, numbers, and standard punctuation.'

  if (context.includes('use emoji') || context.includes('with emoji') || context.includes('include emoji')) {
    systemMessage = 'You are an expert content marketer and copywriter. Create high-quality, engaging content that drives results. Be creative, persuasive, and authentic. The user has requested emojis, so use them appropriately to enhance the message.'
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

    let content = completion.choices[0]?.message?.content || 'Failed to generate content'

    // Strip all emojis unless user explicitly requested them
    if (!context.includes('use emoji') && !context.includes('with emoji') && !context.includes('include emoji')) {
      // Remove all emojis using comprehensive regex
      content = content.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu, '')
      // Clean up any double spaces left behind
      content = content.replace(/\s+/g, ' ').trim()
    }

    return content
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate content')
  }
}