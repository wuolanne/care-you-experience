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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      booking_requests: {
        Row: {
          contact_email: string
          created_at: string
          id: string
          lang: string
          meeting_date: string
          preferred_time: string
        }
        Insert: {
          contact_email: string
          created_at?: string
          id?: string
          lang?: string
          meeting_date: string
          preferred_time: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          id?: string
          lang?: string
          meeting_date?: string
          preferred_time?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          lang: string
          message: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          lang?: string
          message: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lang?: string
          message?: string
        }
        Relationships: []
      }
      email_outbox: {
        Row: {
          accepted_at: string | null
          attempts: number
          available_at: string
          created_at: string
          id: string
          idempotency_key: string
          last_error: string | null
          payload: Json
          provider_id: string | null
          recipient: string | null
          recipient_key: string
          reply_to: string | null
          request_id: string
          request_type: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          attempts?: number
          available_at?: string
          created_at?: string
          id?: string
          idempotency_key: string
          last_error?: string | null
          payload: Json
          provider_id?: string | null
          recipient?: string | null
          recipient_key: string
          reply_to?: string | null
          request_id: string
          request_type: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          attempts?: number
          available_at?: string
          created_at?: string
          id?: string
          idempotency_key?: string
          last_error?: string | null
          payload?: Json
          provider_id?: string | null
          recipient?: string | null
          recipient_key?: string
          reply_to?: string | null
          request_id?: string
          request_type?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          body: Json
          created_at: string
          id: string
          image_path: string | null
          news_date: string
          published: boolean
          title: Json
        }
        Insert: {
          body?: Json
          created_at?: string
          id?: string
          image_path?: string | null
          news_date?: string
          published?: boolean
          title?: Json
        }
        Update: {
          body?: Json
          created_at?: string
          id?: string
          image_path?: string | null
          news_date?: string
          published?: boolean
          title?: Json
        }
        Relationships: []
      }
      service_start_requests: {
        Row: {
          contact_person: string
          created_at: string
          customer_name: string
          email: string
          id: string
          lang: string
          once_details: string | null
          package_name: string | null
          service_type: string
          start_date: string
          start_time: string
          work_address: string
        }
        Insert: {
          contact_person: string
          created_at?: string
          customer_name: string
          email: string
          id?: string
          lang?: string
          once_details?: string | null
          package_name?: string | null
          service_type: string
          start_date: string
          start_time: string
          work_address: string
        }
        Update: {
          contact_person?: string
          created_at?: string
          customer_name?: string
          email?: string
          id?: string
          lang?: string
          once_details?: string | null
          package_name?: string | null
          service_type?: string
          start_date?: string
          start_time?: string
          work_address?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      check_form_rate_limit: {
        Args: {
          p_bucket_key: string
          p_limit?: number
        }
        Returns: boolean
      }
      create_booking_request_with_notification: {
        Args: {
          p_contact_email: string
          p_idempotency_key: string
          p_lang: string
          p_meeting_date: string
          p_payload: Json
          p_preferred_time: string
          p_recipient: string | null
          p_reply_to: string | null
          p_subject: string
        }
        Returns: { outbox_id: string; request_id: string }[]
      }
      create_contact_submission_with_notification: {
        Args: {
          p_email: string
          p_idempotency_key: string
          p_lang: string
          p_message: string
          p_payload: Json
          p_recipient: string | null
          p_reply_to: string | null
          p_subject: string
        }
        Returns: { outbox_id: string; request_id: string }[]
      }
      create_service_start_request_with_notification: {
        Args: {
          p_contact_person: string
          p_customer_name: string
          p_email: string
          p_idempotency_key: string
          p_lang: string
          p_once_details: string | null
          p_package_name: string | null
          p_payload: Json
          p_recipient: string | null
          p_reply_to: string | null
          p_service_type: string
          p_start_date: string
          p_start_time: string
          p_subject: string
          p_work_address: string
        }
        Returns: { outbox_id: string; request_id: string }[]
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
