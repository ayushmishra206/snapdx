export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          institution: string | null
          year_of_study: number | null
          specialization: string | null
          avatar_url: string | null
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          institution?: string | null
          year_of_study?: number | null
          specialization?: string | null
          avatar_url?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          institution?: string | null
          year_of_study?: number | null
          specialization?: string | null
          avatar_url?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          case_tags: string[] | null
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          case_tags?: string[] | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          case_tags?: string[] | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          image_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          image_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          image_url?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      knowledge_documents: {
        Row: {
          id: string
          title: string
          content: string
          source: string
          category: string | null
          embedding: number[] | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          source: string
          category?: string | null
          embedding?: number[] | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          source?: string
          category?: string | null
          embedding?: number[] | null
          metadata?: Json
          created_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          user_id: string
          action_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          created_at?: string
        }
      }
    }
  }
}
