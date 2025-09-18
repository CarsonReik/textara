'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentType } from '@/lib/openai'
import { Copy, Sparkles, Loader2 } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

const CONTENT_TYPES = [
  { value: 'twitter-thread', label: 'X Thread', description: 'Multi-post story or tutorial' },
  { value: 'twitter-post', label: 'X Post', description: 'Single engaging post' },
  { value: 'linkedin-post', label: 'LinkedIn Post', description: 'Professional network content' },
  { value: 'blog-outline', label: 'Blog Outline', description: 'Structured blog post plan' },
  { value: 'email-campaign', label: 'Email Campaign', description: 'Marketing email content' },
  { value: 'ad-copy', label: 'Ad Copy', description: 'Persuasive advertising text' },
  { value: 'instagram-caption', label: 'Instagram Caption', description: 'Visual content description' },
  { value: 'youtube-description', label: 'YouTube Description', description: 'Video content details' },
] as const

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'funny', label: 'Funny' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational', label: 'Educational' },
] as const

interface ContentGeneratorProps {
  onCreditsUpdate: (credits: number) => void
}

export function ContentGenerator({ onCreditsUpdate }: ContentGeneratorProps) {
  const [selectedType, setSelectedType] = useState<ContentType>('twitter-thread')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'funny' | 'inspirational' | 'educational'>('professional')
  const [audience, setAudience] = useState('')
  const [keywords, setKeywords] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim() || !audience.trim()) return

    setIsGenerating(true)
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please sign in to generate content')
        return
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          contentType: selectedType,
          topic,
          tone,
          audience,
          keywords,
          additionalContext,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const data = await response.json()
      setGeneratedContent(data.content)

      // Update credits in the header
      if (data.creditsRemaining !== undefined) {
        onCreditsUpdate(data.creditsRemaining)
      }
    } catch (error: unknown) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content. Please try again.'
      alert(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedContent)
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Content Generator
            </CardTitle>
            <CardDescription>
              Create high-quality content for any platform in seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Content Type</label>
              <div className="grid grid-cols-2 gap-2">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-3 text-left rounded-lg border transition-colors ${
                      selectedType === type.value
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="text-sm font-medium mb-2 block">Topic *</label>
              <Input
                placeholder="e.g., AI productivity tools, startup marketing strategies"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Audience */}
            <div>
              <label className="text-sm font-medium mb-2 block">Target Audience *</label>
              <Input
                placeholder="e.g., startup founders, marketing professionals, developers"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>

            {/* Tone */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tone</label>
              <div className="flex gap-2 flex-wrap">
                {TONES.map((toneOption) => (
                  <button
                    key={toneOption.value}
                    onClick={() => setTone(toneOption.value)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      tone === toneOption.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {toneOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="text-sm font-medium mb-2 block">Keywords (optional)</label>
              <Input
                placeholder="e.g., AI, productivity, automation"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            {/* Additional Context */}
            <div>
              <label className="text-sm font-medium mb-2 block">Additional Context (optional)</label>
              <Textarea
                placeholder="Any specific requirements, style preferences, or additional information..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!topic.trim() || !audience.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              {generatedContent && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </div>
            <CardDescription>
              Your AI-generated content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <div className="bg-white rounded-lg p-4 min-h-[400px] border shadow-sm">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed">
                  {generatedContent}
                </pre>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center border border-slate-200">
                <div className="text-center text-slate-600">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ready to Generate</h3>
                  <p className="text-sm">Fill out the form and click &quot;Generate Content&quot; to create your AI-powered content.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}