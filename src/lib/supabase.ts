import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          credits: number
          subscription_tier: 'free' | 'starter' | 'pro' | 'business'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          credits?: number
          subscription_tier?: 'free' | 'starter' | 'pro' | 'business'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          credits?: number
          subscription_tier?: 'free' | 'starter' | 'pro' | 'business'
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          content_type: string
          prompt: string
          generated_content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_type: string
          prompt: string
          generated_content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_type?: string
          prompt?: string
          generated_content?: string
          created_at?: string
        }
      }
    }
  }
}