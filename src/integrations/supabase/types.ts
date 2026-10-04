export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      galleries: {
        Row: {
          created_at: string
          id: string
          linked_section: string | null
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          linked_section?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          linked_section?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          gallery_id: string
          id: string
          image_path: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          gallery_id: string
          id?: string
          image_path: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          gallery_id?: string
          id?: string
          image_path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_eras: {
        Row: {
          created_at: string
          description: string | null
          featured_image_path: string | null
          highlights: string[]
          id: string
          kicker: string | null
          lessons: string[]
          number: string | null
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
          visual_theme: string | null
          years: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured_image_path?: string | null
          highlights?: string[]
          id?: string
          kicker?: string | null
          lessons?: string[]
          number?: string | null
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          visual_theme?: string | null
          years?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          featured_image_path?: string | null
          highlights?: string[]
          id?: string
          kicker?: string | null
          lessons?: string[]
          number?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visual_theme?: string | null
          years?: string | null
        }
        Relationships: []
      }
      junkyard: {
        Row: {
          category: string | null
          created_at: string
          date_label: string | null
          id: string
          kind: string | null
          lesson: string | null
          project_name: string
          published: boolean
          rotation: number | null
          sketches: string[]
          slug: string
          sort_order: number
          updated_at: string
          what: string | null
          why_failed: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date_label?: string | null
          id?: string
          kind?: string | null
          lesson?: string | null
          project_name: string
          published?: boolean
          rotation?: number | null
          sketches?: string[]
          slug: string
          sort_order?: number
          updated_at?: string
          what?: string | null
          why_failed?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date_label?: string | null
          id?: string
          kind?: string | null
          lesson?: string | null
          project_name?: string
          published?: boolean
          rotation?: number | null
          sketches?: string[]
          slug?: string
          sort_order?: number
          updated_at?: string
          what?: string | null
          why_failed?: string | null
        }
        Relationships: []
      }
      navigation: {
        Row: {
          created_at: string
          id: string
          label: string
          location: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          location?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          location?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      podcast_media: {
        Row: {
          categories: string[]
          created_at: string
          description: string | null
          embed_url: string | null
          id: string
          published: boolean
          sort_order: number
          thumbnail_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          categories?: string[]
          created_at?: string
          description?: string | null
          embed_url?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          thumbnail_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          description?: string | null
          embed_url?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured_image_path: string | null
          id: string
          lessons_learned: string[]
          links: Json
          outcomes: string[]
          published: boolean
          related_era_id: string | null
          slug: string
          sort_order: number
          status: string | null
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured_image_path?: string | null
          id?: string
          lessons_learned?: string[]
          links?: Json
          outcomes?: string[]
          published?: boolean
          related_era_id?: string | null
          slug: string
          sort_order?: number
          status?: string | null
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured_image_path?: string | null
          id?: string
          lessons_learned?: string[]
          links?: Json
          outcomes?: string[]
          published?: boolean
          related_era_id?: string | null
          slug?: string
          sort_order?: number
          status?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_related_era_id_fkey"
            columns: ["related_era_id"]
            isOneToOne: false
            referencedRelation: "journey_eras"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_education: {
        Row: {
          created_at: string
          credential: string
          date_label: string | null
          id: string
          institution: string
          note: string | null
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential: string
          date_label?: string | null
          id?: string
          institution: string
          note?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential?: string
          date_label?: string | null
          id?: string
          institution?: string
          note?: string | null
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      resume_experience: {
        Row: {
          bullets: string[]
          created_at: string
          end_label: string | null
          id: string
          is_current: boolean
          location: string | null
          org: string
          published: boolean
          role: string
          sort_order: number
          start_label: string | null
          updated_at: string
        }
        Insert: {
          bullets?: string[]
          created_at?: string
          end_label?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          org: string
          published?: boolean
          role: string
          sort_order?: number
          start_label?: string | null
          updated_at?: string
        }
        Update: {
          bullets?: string[]
          created_at?: string
          end_label?: string | null
          id?: string
          is_current?: boolean
          location?: string | null
          org?: string
          published?: boolean
          role?: string
          sort_order?: number
          start_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resume_skills: {
        Row: {
          cluster: string
          created_at: string
          id: string
          published: boolean
          skills: string[]
          sort_order: number
          updated_at: string
        }
        Insert: {
          cluster: string
          created_at?: string
          id?: string
          published?: boolean
          skills?: string[]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cluster?: string
          created_at?: string
          id?: string
          published?: boolean
          skills?: string[]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      tools_lab: {
        Row: {
          category: string | null
          code: string | null
          created_at: string
          description: string | null
          downloadable_resources: Json
          format: string | null
          id: string
          published: boolean
          screenshots: string[]
          slug: string
          sort_order: number
          tool_name: string
          tool_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          downloadable_resources?: Json
          format?: string | null
          id?: string
          published?: boolean
          screenshots?: string[]
          slug: string
          sort_order?: number
          tool_name: string
          tool_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string
          description?: string | null
          downloadable_resources?: Json
          format?: string | null
          id?: string
          published?: boolean
          screenshots?: string[]
          slug?: string
          sort_order?: number
          tool_name?: string
          tool_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          about_text: string | null
          about_image_path: string | null
          contact_email: string | null
          created_at: string
          footer_text: string | null
          hero_image_path: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          resume_intro: string | null
          resume_pdf_path: string | null
          seo_description: string | null
          seo_og_image: string | null
          seo_title: string | null
          site_short: string | null
          site_title: string | null
          subtagline: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          about_text?: string | null
          about_image_path?: string | null
          contact_email?: string | null
          created_at?: string
          footer_text?: string | null
          hero_image_path?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          resume_intro?: string | null
          resume_pdf_path?: string | null
          seo_description?: string | null
          seo_og_image?: string | null
          seo_title?: string | null
          site_short?: string | null
          site_title?: string | null
          subtagline?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          about_text?: string | null
          about_image_path?: string | null
          contact_email?: string | null
          created_at?: string
          footer_text?: string | null
          hero_image_path?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          resume_intro?: string | null
          resume_pdf_path?: string | null
          seo_description?: string | null
          seo_og_image?: string | null
          seo_title?: string | null
          site_short?: string | null
          site_title?: string | null
          subtagline?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      writing: {
        Row: {
          category: string | null
          cover_image_path: string | null
          created_at: string
          excerpt: string | null
          full_content: string | null
          id: string
          publish_date: string | null
          published: boolean
          reading_minutes: number | null
          slug: string
          sort_order: number
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          full_content?: string | null
          id?: string
          publish_date?: string | null
          published?: boolean
          reading_minutes?: number | null
          slug: string
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          full_content?: string | null
          id?: string
          publish_date?: string | null
          published?: boolean
          reading_minutes?: number | null
          slug?: string
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
