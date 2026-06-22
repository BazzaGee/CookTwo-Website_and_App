export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_connections: {
        Row: {
          access_token: string
          color: string | null
          created_at: string | null
          display_name: string
          id: string
          last_synced_at: string | null
          privacy_mode: string | null
          provider: string
          provider_account_id: string
          provider_calendar_id: string
          refresh_token: string
          sync_direction: string | null
          sync_enabled: boolean | null
          token_expires_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          color?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          last_synced_at?: string | null
          privacy_mode?: string | null
          provider: string
          provider_account_id: string
          provider_calendar_id: string
          refresh_token: string
          sync_direction?: string | null
          sync_enabled?: boolean | null
          token_expires_at: string
          user_id: string
        }
        Update: {
          access_token?: string
          color?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          last_synced_at?: string | null
          privacy_mode?: string | null
          provider?: string
          provider_account_id?: string
          provider_calendar_id?: string
          refresh_token?: string
          sync_direction?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          assigned_to: string | null
          attachments: Json | null
          color_tag: string | null
          couple_id: string
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string
          event_type: string | null
          external_event_id: string | null
          id: string
          is_all_day: boolean | null
          is_recurring: boolean | null
          location: string | null
          recurrence_rule: string | null
          source_calendar_id: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          color_tag?: string | null
          couple_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time: string
          event_type?: string | null
          external_event_id?: string | null
          id?: string
          is_all_day?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          recurrence_rule?: string | null
          source_calendar_id?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          color_tag?: string | null
          couple_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string
          event_type?: string | null
          external_event_id?: string | null
          id?: string
          is_all_day?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          recurrence_rule?: string | null
          source_calendar_id?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_frequency_goal: string | null
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          pairing_code: string | null
          pairing_code_expires_at: string | null
          partner_id: string | null
          preferred_color: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_frequency_goal?: string | null
          email: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          pairing_code?: string | null
          pairing_code_expires_at?: string | null
          partner_id?: string | null
          preferred_color?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_frequency_goal?: string | null
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          pairing_code?: string | null
          pairing_code_expires_at?: string | null
          partner_id?: string | null
          preferred_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          completed_at: string | null
          couple_id: string
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          labels: string[] | null
          list_id: string
          priority: string | null
          reminder_at: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          completed_at?: string | null
          couple_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          labels?: string[] | null
          list_id: string
          priority?: string | null
          reminder_at?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          completed_at?: string | null
          couple_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          labels?: string[] | null
          list_id?: string
          priority?: string | null
          reminder_at?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      todo_lists: {
        Row: {
          color: string | null
          couple_id: string
          created_at: string | null
          created_by: string
          icon: string | null
          id: string
          is_private: boolean | null
          list_type: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          color?: string | null
          couple_id: string
          created_at?: string | null
          created_by: string
          icon?: string | null
          id?: string
          is_private?: boolean | null
          list_type?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          color?: string | null
          couple_id?: string
          created_at?: string | null
          created_by?: string
          icon?: string | null
          id?: string
          is_private?: boolean | null
          list_type?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_type: string | null
          attachment_url: string | null
          content: string | null
          couple_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          related_event_id: string | null
          related_todo_id: string | null
          sender_id: string
        }
        Insert: {
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string | null
          couple_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          related_event_id?: string | null
          related_todo_id?: string | null
          sender_id: string
        }
        Update: {
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string | null
          couple_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          related_event_id?: string | null
          related_todo_id?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      key_dates: {
        Row: {
          couple_id: string
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          date: string
          date_type: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          recurrence_type: string | null
          title: string
        }
        Insert: {
          couple_id: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          date: string
          date_type?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          recurrence_type?: string | null
          title: string
        }
        Update: {
          couple_id?: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          date_type?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          recurrence_type?: string | null
          title?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          couple_id: string
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_shared: boolean | null
          title: string
        }
        Insert: {
          couple_id: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_shared?: boolean | null
          title: string
        }
        Update: {
          couple_id?: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_shared?: boolean | null
          title?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          image_url: string | null
          notes: string | null
          source_platform: string | null
          source_url: string | null
          title: string
          wishlist_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          source_platform?: string | null
          source_url?: string | null
          title: string
          wishlist_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          source_platform?: string | null
          source_url?: string | null
          title?: string
          wishlist_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {
      get_couple_id: { Args: never; Returns: string }
    }
    Enums: {}
  }
}
