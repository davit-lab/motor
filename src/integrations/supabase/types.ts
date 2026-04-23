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
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string
          read_time: string | null
          slug: string
          title: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string
          read_time?: string | null
          slug: string
          title: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string
          read_time?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          last_message_at: string
          listing_id: string | null
          seller_id: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          last_message_at?: string
          listing_id?: string | null
          seller_id: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          last_message_at?: string
          listing_id?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          can_register: boolean | null
          category: Database["public"]["Enums"]["moto_category"]
          condition: string | null
          created_at: string
          currency: string
          description: string | null
          engine_size: number | null
          expires_at: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          images: string[]
          inspection: Json | null
          is_active: boolean
          license_category: Database["public"]["Enums"]["license_category"]
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string
          make: string
          mileage: number | null
          model: string
          owner_id: string
          price: number
          rental_price_daily: number | null
          rental_price_weekly: number | null
          rental_terms: Json | null
          tier: Database["public"]["Enums"]["listing_tier"]
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at: string
          views: number
          vin: string | null
          year: number
        }
        Insert: {
          can_register?: boolean | null
          category: Database["public"]["Enums"]["moto_category"]
          condition?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          engine_size?: number | null
          expires_at?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          images?: string[]
          inspection?: Json | null
          is_active?: boolean
          license_category?: Database["public"]["Enums"]["license_category"]
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location: string
          make: string
          mileage?: number | null
          model: string
          owner_id: string
          price?: number
          rental_price_daily?: number | null
          rental_price_weekly?: number | null
          rental_terms?: Json | null
          tier?: Database["public"]["Enums"]["listing_tier"]
          transmission?: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string
          views?: number
          vin?: string | null
          year: number
        }
        Update: {
          can_register?: boolean | null
          category?: Database["public"]["Enums"]["moto_category"]
          condition?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          engine_size?: number | null
          expires_at?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          images?: string[]
          inspection?: Json | null
          is_active?: boolean
          license_category?: Database["public"]["Enums"]["license_category"]
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string
          make?: string
          mileage?: number | null
          model?: string
          owner_id?: string
          price?: number
          rental_price_daily?: number | null
          rental_price_weekly?: number | null
          rental_terms?: Json | null
          tier?: Database["public"]["Enums"]["listing_tier"]
          transmission?: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string
          views?: number
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          rating: number | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          rating?: number | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          rating?: number | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      service_listings: {
        Row: {
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string | null
          id: string
          images: string[]
          is_active: boolean
          location: string
          offered_services: string[]
          owner_id: string
          price_estimate: number | null
          provider_name: string
          provider_phone: string | null
          tier: Database["public"]["Enums"]["listing_tier"]
          title: string
          updated_at: string
          working_hours: Json | null
        }
        Insert: {
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          location: string
          offered_services?: string[]
          owner_id: string
          price_estimate?: number | null
          provider_name: string
          provider_phone?: string | null
          tier?: Database["public"]["Enums"]["listing_tier"]
          title: string
          updated_at?: string
          working_hours?: Json | null
        }
        Update: {
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          location?: string
          offered_services?: string[]
          owner_id?: string
          price_estimate?: number | null
          provider_name?: string
          provider_phone?: string | null
          tier?: Database["public"]["Enums"]["listing_tier"]
          title?: string
          updated_at?: string
          working_hours?: Json | null
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
          role?: Database["public"]["Enums"]["app_role"]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      fuel_type: "petrol" | "electric" | "hybrid"
      license_category: "AM" | "A1" | "A2" | "A"
      listing_tier: "basic" | "vip" | "super_vip"
      listing_type: "sale" | "rent" | "service"
      moto_category:
        | "sport"
        | "cruiser"
        | "adventure"
        | "naked"
        | "touring"
        | "dirt"
        | "scooter"
      service_category:
        | "repair"
        | "electrical"
        | "detailing"
        | "tires"
        | "painting"
        | "tuning"
      transmission_type: "manual" | "automatic" | "dct"
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
      app_role: ["admin", "moderator", "user"],
      fuel_type: ["petrol", "electric", "hybrid"],
      license_category: ["AM", "A1", "A2", "A"],
      listing_tier: ["basic", "vip", "super_vip"],
      listing_type: ["sale", "rent", "service"],
      moto_category: [
        "sport",
        "cruiser",
        "adventure",
        "naked",
        "touring",
        "dirt",
        "scooter",
      ],
      service_category: [
        "repair",
        "electrical",
        "detailing",
        "tires",
        "painting",
        "tuning",
      ],
      transmission_type: ["manual", "automatic", "dct"],
    },
  },
} as const
