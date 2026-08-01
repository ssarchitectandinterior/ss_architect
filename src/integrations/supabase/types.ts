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
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          service: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          service?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          service?: string | null
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          title: string
          category: string
          client: string | null
          location: string
          year: string
          area: string | null
          duration: string | null
          services: string | null
          materials: string | null
          description: string | null
          challenges: string | null
          solution: string | null
          image_url: string
          video_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          client?: string | null
          location: string
          year: string
          area?: string | null
          duration?: string | null
          services?: string | null
          materials?: string | null
          description?: string | null
          challenges?: string | null
          solution?: string | null
          image_url: string
          video_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          client?: string | null
          location?: string
          year?: string
          area?: string | null
          duration?: string | null
          services?: string | null
          materials?: string | null
          description?: string | null
          challenges?: string | null
          solution?: string | null
          image_url?: string
          video_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          id: string
          project_id: string
          file_url: string
          file_type: 'image' | 'video'
          caption: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_url: string
          file_type: 'image' | 'video'
          caption?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_url?: string
          file_type?: 'image' | 'video'
          caption?: string | null
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_posts: {
        Row: {
          id: string
          slug: string
          title: string
          category: string
          date: string
          read_time: string
          author_name: string
          author_role: string
          author_avatar: string | null
          cover_image_url: string
          excerpt: string
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          category: string
          date: string
          read_time: string
          author_name: string
          author_role: string
          author_avatar?: string | null
          cover_image_url: string
          excerpt: string
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          category?: string
          date?: string
          read_time?: string
          author_name?: string
          author_role?: string
          author_avatar?: string | null
          cover_image_url?: string
          excerpt?: string
          content?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
