# Textara

A powerful AI-driven content generation platform that helps marketers, creators, and businesses create high-quality content for social media, blogs, emails, and more.

## Features

- **Multiple Content Types**: Generate Twitter threads, LinkedIn posts, blog outlines, email campaigns, ad copy, and more
- **AI-Powered**: Uses OpenAI's GPT models for intelligent content generation
- **Credit System**: Fair usage with subscription tiers
- **User Authentication**: Secure sign-up/sign-in with Supabase
- **Responsive Design**: Works perfectly on desktop and mobile
- **Copy to Clipboard**: Easy content copying and sharing

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **AI**: OpenAI GPT-3.5/4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd textara
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- Supabase project URL and keys
- OpenAI API key

4. Set up Supabase database:

Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 3,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'business')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Create a free account to get 3 free generations
2. **Choose Content Type**: Select from Twitter threads, LinkedIn posts, blog outlines, etc.
3. **Fill Details**: Provide topic, audience, tone, and optional keywords
4. **Generate**: Click generate and get AI-created content in seconds
5. **Copy & Use**: Copy the content and use it on your platforms

## Subscription Tiers

- **Free**: 3 generations/month
- **Starter**: $29/month - 50 generations
- **Pro**: $79/month - 500 generations
- **Business**: $199/month - Unlimited generations

## Contributing

This is a commercial product template. For feature requests or bug reports, please create an issue.

## License

Commercial license. See LICENSE file for details.