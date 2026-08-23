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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      barbers: {
        Row: {
          bio: string
          created_at: string
          id: string
          instagram: string
          is_active: boolean
          name: string
          photo_url: string
          role_title: string
          slug: string
          sort_order: number
          specialties: string[]
          updated_at: string
          whatsapp: string
        }
        Insert: {
          bio?: string
          created_at?: string
          id?: string
          instagram?: string
          is_active?: boolean
          name?: string
          photo_url?: string
          role_title?: string
          slug: string
          sort_order?: number
          specialties?: string[]
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          instagram?: string
          is_active?: boolean
          name?: string
          photo_url?: string
          role_title?: string
          slug?: string
          sort_order?: number
          specialties?: string[]
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      credit_usages: {
        Row: {
          barber_id: string | null
          credits: number
          id: string
          notes: string
          service_id: string | null
          subscription_id: string
          used_at: string
        }
        Insert: {
          barber_id?: string | null
          credits?: number
          id?: string
          notes?: string
          service_id?: string | null
          subscription_id: string
          used_at?: string
        }
        Update: {
          barber_id?: string | null
          credits?: number
          id?: string
          notes?: string
          service_id?: string | null
          subscription_id?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_usages_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_usages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_usages_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          barber_id: string | null
          caption: string
          collection: string
          created_at: string
          id: string
          is_active: boolean
          media_type: string
          sort_order: number
          thumbnail_url: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          barber_id?: string | null
          caption?: string
          collection?: string
          created_at?: string
          id?: string
          is_active?: boolean
          media_type?: string
          sort_order?: number
          thumbnail_url?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Update: {
          barber_id?: string | null
          caption?: string
          collection?: string
          created_at?: string
          id?: string
          is_active?: boolean
          media_type?: string
          sort_order?: number
          thumbnail_url?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          benefits: string[]
          billing_period: string
          created_at: string
          credits: number | null
          highlight: boolean
          id: string
          included_services: string[]
          is_active: boolean
          name: string
          price_cents: number | null
          price_label: string
          rules: string
          sort_order: number
          summary: string
          updated_at: string
        }
        Insert: {
          benefits?: string[]
          billing_period?: string
          created_at?: string
          credits?: number | null
          highlight?: boolean
          id?: string
          included_services?: string[]
          is_active?: boolean
          name?: string
          price_cents?: number | null
          price_label?: string
          rules?: string
          sort_order?: number
          summary?: string
          updated_at?: string
        }
        Update: {
          benefits?: string[]
          billing_period?: string
          created_at?: string
          credits?: number | null
          highlight?: boolean
          id?: string
          included_services?: string[]
          is_active?: boolean
          name?: string
          price_cents?: number | null
          price_label?: string
          rules?: string
          sort_order?: number
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number | null
          id: string
          image_url: string
          is_active: boolean
          name: string
          price_cents: number | null
          price_label: string
          sort_order: number
          updated_at: string
          whatsapp_override: string
        }
        Insert: {
          created_at?: string
          description?: string
          duration_minutes?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          price_cents?: number | null
          price_label?: string
          sort_order?: number
          updated_at?: string
          whatsapp_override?: string
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          price_cents?: number | null
          price_label?: string
          sort_order?: number
          updated_at?: string
          whatsapp_override?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subscription_payments: {
        Row: {
          amount_cents: number | null
          created_at: string
          due_date: string | null
          id: string
          method: string
          paid_at: string | null
          reference: string
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          due_date?: string | null
          id?: string
          method?: string
          paid_at?: string | null
          reference?: string
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          due_date?: string | null
          id?: string
          method?: string
          paid_at?: string | null
          reference?: string
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          credits_total: number | null
          credits_used: number
          customer_name: string
          customer_phone: string
          expires_at: string | null
          id: string
          notes: string
          plan_id: string | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits_total?: number | null
          credits_used?: number
          customer_name?: string
          customer_phone?: string
          expires_at?: string | null
          id?: string
          notes?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits_total?: number | null
          credits_used?: number
          customer_name?: string
          customer_phone?: string
          expires_at?: string | null
          id?: string
          notes?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "staff" | "client"
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
      app_role: ["admin", "staff", "client"],
    },
  },
} as const
