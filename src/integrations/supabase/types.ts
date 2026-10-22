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
      site_content: {
        Row: {
          created_at: string
          draft_content: Json
          draft_updated_at: string
          id: string
          lang: string
          page_key: string
          published_at: string | null
          published_content: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          draft_content?: Json
          draft_updated_at?: string
          id?: string
          lang: string
          page_key: string
          published_at?: string | null
          published_content?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          draft_content?: Json
          draft_updated_at?: string
          id?: string
          lang?: string
          page_key?: string
          published_at?: string | null
          published_content?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_pricing_packages: {
        Row: {
          package_key: string
          service_type: string
          display_order: number
          draft_name: string
          published_name: string
          draft_monthly_price: number
          published_monthly_price: number
          draft_hours: number
          published_hours: number
          draft_updated_at: string
          published_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          package_key: string
          service_type: string
          display_order: number
          draft_name: string
          published_name: string
          draft_monthly_price: number
          published_monthly_price: number
          draft_hours: number
          published_hours: number
          draft_updated_at?: string
          published_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          package_key?: string
          service_type?: string
          display_order?: number
          draft_name?: string
          published_name?: string
          draft_monthly_price?: number
          published_monthly_price?: number
          draft_hours?: number
          published_hours?: number
          draft_updated_at?: string
          published_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_pricing_package_texts: {
        Row: {
          package_key: string
          lang: string
          draft_description: string
          published_description: string | null
          draft_updated_at: string
          published_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          package_key: string
          lang: string
          draft_description: string
          published_description?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          package_key?: string
          lang?: string
          draft_description?: string
          published_description?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_pricing_settings: {
        Row: {
          service_type: string
          draft_hourly_price: number
          published_hourly_price: number
          draft_updated_at: string
          published_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          service_type: string
          draft_hourly_price: number
          published_hourly_price: number
          draft_updated_at?: string
          published_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          service_type?: string
          draft_hourly_price?: number
          published_hourly_price?: number
          draft_updated_at?: string
          published_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_pricing_texts: {
        Row: {
          service_type: string
          lang: string
          draft_pricing_heading: string
          published_pricing_heading: string | null
          draft_pricing_note: string
          published_pricing_note: string | null
          draft_monthly_heading: string
          published_monthly_heading: string | null
          draft_vat_notice: string
          published_vat_notice: string | null
          draft_package_description: string
          published_package_description: string | null
          draft_hourly_heading: string
          published_hourly_heading: string | null
          draft_hourly_description: string
          published_hourly_description: string | null
          draft_deduction_title: string | null
          published_deduction_title: string | null
          draft_deduction_body: string | null
          published_deduction_body: string | null
          draft_deduction_link_label: string | null
          published_deduction_link_label: string | null
          draft_updated_at: string
          published_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          service_type: string
          lang: string
          draft_pricing_heading: string
          published_pricing_heading?: string | null
          draft_pricing_note: string
          published_pricing_note?: string | null
          draft_monthly_heading: string
          published_monthly_heading?: string | null
          draft_vat_notice: string
          published_vat_notice?: string | null
          draft_package_description: string
          published_package_description?: string | null
          draft_hourly_heading: string
          published_hourly_heading?: string | null
          draft_hourly_description: string
          published_hourly_description?: string | null
          draft_deduction_title?: string | null
          published_deduction_title?: string | null
          draft_deduction_body?: string | null
          published_deduction_body?: string | null
          draft_deduction_link_label?: string | null
          published_deduction_link_label?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          service_type?: string
          lang?: string
          draft_pricing_heading?: string
          published_pricing_heading?: string | null
          draft_pricing_note?: string
          published_pricing_note?: string | null
          draft_monthly_heading?: string
          published_monthly_heading?: string | null
          draft_vat_notice?: string
          published_vat_notice?: string | null
          draft_package_description?: string
          published_package_description?: string | null
          draft_hourly_heading?: string
          published_hourly_heading?: string | null
          draft_hourly_description?: string
          published_hourly_description?: string | null
          draft_deduction_title?: string | null
          published_deduction_title?: string | null
          draft_deduction_body?: string | null
          published_deduction_body?: string | null
          draft_deduction_link_label?: string | null
          published_deduction_link_label?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_image_alt_texts: {
        Row: {
          image_key: string
          lang: string
          draft_alt_text: string
          published_alt_text: string
          draft_updated_at: string
          published_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          image_key: string
          lang: string
          draft_alt_text?: string
          published_alt_text?: string
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          image_key?: string
          lang?: string
          draft_alt_text?: string
          published_alt_text?: string
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_sections: {
        Row: {
          service_type: string
          section_type: string
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          service_type: string
          section_type: string
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          service_type?: string
          section_type?: string
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_section_texts: {
        Row: {
          service_type: string
          section_type: string
          lang: string
          draft_title: string
          draft_body: string
          published_title: string | null
          published_body: string | null
          draft_updated_at: string
          published_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          service_type: string
          section_type: string
          lang: string
          draft_title?: string
          draft_body?: string
          published_title?: string | null
          published_body?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          service_type?: string
          section_type?: string
          lang?: string
          draft_title?: string
          draft_body?: string
          published_title?: string | null
          published_body?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_section_items: {
        Row: {
          id: string
          service_type: string
          section_type: string
          draft_display_order: number
          published_display_order: number | null
          draft_icon: string
          published_icon: string | null
          draft_visible: boolean
          published_visible: boolean | null
          draft_deleted: boolean
          published_deleted: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          service_type: string
          section_type: string
          draft_display_order?: number
          published_display_order?: number | null
          draft_icon?: string
          published_icon?: string | null
          draft_visible?: boolean
          published_visible?: boolean | null
          draft_deleted?: boolean
          published_deleted?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          service_type?: string
          section_type?: string
          draft_display_order?: number
          published_display_order?: number | null
          draft_icon?: string
          published_icon?: string | null
          draft_visible?: boolean
          published_visible?: boolean | null
          draft_deleted?: boolean
          published_deleted?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      service_section_item_texts: {
        Row: {
          item_id: string
          lang: string
          draft_title: string
          draft_description: string
          published_title: string | null
          published_description: string | null
          draft_updated_at: string
          published_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          item_id: string
          lang: string
          draft_title?: string
          draft_description?: string
          published_title?: string | null
          published_description?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          item_id?: string
          lang?: string
          draft_title?: string
          draft_description?: string
          published_title?: string | null
          published_description?: string | null
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          id: string
          draft_display_name: string
          published_display_name: string
          draft_display_order: number
          published_display_order: number
          draft_visible: boolean
          published_visible: boolean
          draft_image_path: string | null
          published_image_path: string | null
          draft_updated_at: string
          published_at: string | null
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          draft_display_name?: string
          published_display_name?: string
          draft_display_order?: number
          published_display_order?: number
          draft_visible?: boolean
          published_visible?: boolean
          draft_image_path?: string | null
          published_image_path?: string | null
          draft_updated_at?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          draft_display_name?: string
          published_display_name?: string
          draft_display_order?: number
          published_display_order?: number
          draft_visible?: boolean
          published_visible?: boolean
          draft_image_path?: string | null
          published_image_path?: string | null
          draft_updated_at?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      staff_member_texts: {
        Row: {
          staff_id: string
          lang: string
          draft_job_title: string
          published_job_title: string
          draft_bio: string
          published_bio: string
          draft_alt_text: string
          published_alt_text: string
          draft_updated_at: string
          published_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          staff_id: string
          lang: string
          draft_job_title?: string
          published_job_title?: string
          draft_bio?: string
          published_bio?: string
          draft_alt_text?: string
          published_alt_text?: string
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          staff_id?: string
          lang?: string
          draft_job_title?: string
          published_job_title?: string
          draft_bio?: string
          published_bio?: string
          draft_alt_text?: string
          published_alt_text?: string
          draft_updated_at?: string
          published_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_contact_details: {
        Row: {
          business_id: string
          id: string
          public_address: string | null
          public_email: string | null
          public_phone: string | null
          public_text: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          business_id?: string
          id?: string
          public_address?: string | null
          public_email?: string | null
          public_phone?: string | null
          public_text?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          business_id?: string
          id?: string
          public_address?: string | null
          public_email?: string | null
          public_phone?: string | null
          public_text?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_images: {
        Row: {
          created_at: string
          draft_alt_text: string
          draft_path: string | null
          id: string
          lang: string
          page_key: string
          published_alt_text: string
          published_path: string | null
          slot_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          draft_alt_text?: string
          draft_path?: string | null
          id?: string
          lang: string
          page_key: string
          published_alt_text?: string
          published_path?: string | null
          slot_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          draft_alt_text?: string
          draft_path?: string | null
          id?: string
          lang?: string
          page_key?: string
          published_alt_text?: string
          published_path?: string | null
          slot_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      customer_reviews: {
        Row: {
          consent_granted: boolean
          created_at: string
          customer_type: string
          display_order: number
          hidden: boolean
          id: string
          lang: string
          public_name: string
          published: boolean
          published_at: string | null
          rating: number | null
          review_text: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          consent_granted?: boolean
          created_at?: string
          customer_type: string
          display_order?: number
          hidden?: boolean
          id?: string
          lang: string
          public_name: string
          published?: boolean
          published_at?: string | null
          rating?: number | null
          review_text: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          consent_granted?: boolean
          created_at?: string
          customer_type?: string
          display_order?: number
          hidden?: boolean
          id?: string
          lang?: string
          public_name?: string
          published?: boolean
          published_at?: string | null
          rating?: number | null
          review_text?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          display_order: number
          id: string
          label: string
          service_key: string
          updated_at: string
          updated_by: string | null
          url: string
          visible: boolean
        }
        Insert: {
          display_order?: number
          id?: string
          label: string
          service_key: string
          updated_at?: string
          updated_by?: string | null
          url?: string
          visible?: boolean
        }
        Update: {
          display_order?: number
          id?: string
          label?: string
          service_key?: string
          updated_at?: string
          updated_by?: string | null
          url?: string
          visible?: boolean
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
      public_site_content: {
        Row: {
          id: string
          lang: string
          page_key: string
          published_at: string | null
          published_content: Json
        }
        Relationships: []
      }
      public_site_images: {
        Row: {
          id: string
          lang: string
          page_key: string
          published_alt_text: string
          published_path: string
          slot_key: string
        }
        Relationships: []
      }
      public_service_pricing_packages: {
        Row: {
          package_key: string
          service_type: string
          display_order: number
          name: string
          monthly_price: number
          hours: number
        }
        Relationships: []
      }
      public_service_pricing_package_texts: {
        Row: {
          package_key: string
          lang: string
          description: string | null
        }
        Relationships: []
      }
      public_service_pricing_settings: {
        Row: {
          service_type: string
          hourly_price: number
        }
        Relationships: []
      }
      public_service_pricing_texts: {
        Row: {
          service_type: string
          lang: string
          pricing_heading: string | null
          pricing_note: string | null
          monthly_heading: string | null
          vat_notice: string | null
          package_description: string | null
          hourly_heading: string | null
          hourly_description: string | null
          deduction_title: string | null
          deduction_body: string | null
          deduction_link_label: string | null
        }
        Relationships: []
      }
      public_shared_about_image: {
        Row: {
          lang: string
          published_path: string
          published_alt_text: string
        }
        Relationships: []
      }
      public_staff_members: {
        Row: {
          id: string
          display_name: string
          display_order: number
          image_path: string | null
        }
        Relationships: []
      }
      public_staff_member_texts: {
        Row: {
          staff_id: string
          lang: string
          job_title: string
          bio: string
          alt_text: string
        }
        Relationships: []
      }
      public_service_sections: {
        Row: {
          service_type: string
          section_type: string
          lang: string
          title: string
          body: string
        }
        Relationships: []
      }
      public_service_section_items: {
        Row: {
          id: string
          service_type: string
          section_type: string
          display_order: number
          icon: string
        }
        Relationships: []
      }
      public_service_section_item_texts: {
        Row: {
          item_id: string
          lang: string
          title: string
          description: string
        }
        Relationships: []
      }
    }
    Functions: {
      admin_site_content: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Tables"]["site_content"]["Row"][]
      }
      admin_site_images: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Tables"]["site_images"]["Row"][]
      }
      admin_upsert_site_content: {
        Args: {
          p_draft_content: Json
          p_lang: string
          p_page_key: string
          p_published_at: string | null
          p_published_content: Json | null
        }
        Returns: Database["public"]["Tables"]["site_content"]["Row"]
      }
      admin_service_pricing: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_upsert_service_pricing: {
        Args: {
          p_lang: string
          p_packages: Json
          p_publish?: boolean
          p_service_type: string
          p_settings: Json
          p_texts: Json
        }
        Returns: Json
      }
      admin_about_image: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_upsert_about_image: {
        Args: {
          p_draft_path: string | null
          p_published_path: string | null
          p_publish?: boolean
          p_texts: Json
        }
        Returns: Json
      }
      admin_staff_members: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_upsert_staff_member: {
        Args: {
          p_id: string
          p_member: Json
          p_publish?: boolean
          p_texts: Json
        }
        Returns: Json
      }
      admin_delete_staff_member: {
        Args: {
          p_id: string
        }
        Returns: Json
      }
      admin_set_staff_visibility: {
        Args: {
          p_id: string
          p_visible: boolean
        }
        Returns: Json
      }
      admin_service_sections: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      admin_upsert_service_section: {
        Args: {
          p_service_type: string
          p_section_type: string
          p_lang: string
          p_title: string
          p_body: string
          p_items: Json
          p_publish?: boolean
          p_deleted_item_ids?: string[]
        }
        Returns: Json
      }
      admin_delete_service_section_item: {
        Args: { p_id: string }
        Returns: Json
      }
      admin_upsert_site_image: {
        Args: {
          p_draft_alt_text: string
          p_draft_path: string | null
          p_lang: string
          p_page_key: string
          p_published_alt_text: string
          p_published_path: string | null
          p_slot_key: string
        }
        Returns: Database["public"]["Tables"]["site_images"]["Row"]
      }
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
