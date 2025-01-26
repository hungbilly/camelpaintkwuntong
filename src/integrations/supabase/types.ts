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
      banner_config: {
        Row: {
          created_at: string
          id: string
          image_url: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          block: string
          category: string
          created_at: string
          description: string
          floor: number
          id: string
          image: string | null
          instagram_link: string | null
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          block: string
          category: string
          created_at?: string
          description: string
          floor: number
          id?: string
          image?: string | null
          instagram_link?: string | null
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          block?: string
          category?: string
          created_at?: string
          description?: string
          floor?: number
          id?: string
          image?: string | null
          instagram_link?: string | null
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      visitors: {
        Row: {
          count: number | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          count?: number | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_visitor_count: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}