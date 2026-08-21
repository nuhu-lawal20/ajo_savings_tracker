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
      circles: {
        Row: {
          contribution_amount: number
          created_at: string
          creator_id: string
          current_round: number
          description: string | null
          frequency: string
          id: string
          invite_code: string
          max_members: number
          name: string
          paystack_plan_code: string | null
          status: string
          updated_at: string
        }
        Insert: {
          contribution_amount: number
          created_at?: string
          creator_id: string
          current_round?: number
          description?: string | null
          frequency: string
          id?: string
          invite_code: string
          max_members: number
          name: string
          paystack_plan_code?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          contribution_amount?: number
          created_at?: string
          creator_id?: string
          current_round?: number
          description?: string | null
          frequency?: string
          id?: string
          invite_code?: string
          max_members?: number
          name?: string
          paystack_plan_code?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circles_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          circle_id: string
          has_paid_current_round: boolean
          id: string
          joined_at: string
          payout_position: number
          payout_status: string
          user_id: string
        }
        Insert: {
          circle_id: string
          has_paid_current_round?: boolean
          id?: string
          joined_at?: string
          payout_position: number
          payout_status?: string
          user_id: string
        }
        Update: {
          circle_id?: string
          has_paid_current_round?: boolean
          id?: string
          joined_at?: string
          payout_position?: number
          payout_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_role: string
          avatar_url: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_code: string | null
          bank_verified_at: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_admin: boolean
          is_suspended: boolean
          kyc_tier: number
          paystack_recipient_code: string | null
          phone: string | null
          trust_score: number
          updated_at: string
        }
        Insert: {
          admin_role?: string
          avatar_url?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_code?: string | null
          bank_verified_at?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_admin?: boolean
          is_suspended?: boolean
          kyc_tier?: number
          paystack_recipient_code?: string | null
          phone?: string | null
          trust_score?: number
          updated_at?: string
        }
        Update: {
          admin_role?: string
          avatar_url?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_code?: string | null
          bank_verified_at?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_admin?: boolean
          is_suspended?: boolean
          kyc_tier?: number
          paystack_recipient_code?: string | null
          phone?: string | null
          trust_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          circle_id: string
          created_at: string
          id: string
          membership_id: string
          paystack_reference: string
          round_number: number
          source: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          circle_id: string
          created_at?: string
          id?: string
          membership_id: string
          paystack_reference: string
          round_number?: number
          source?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          circle_id?: string
          created_at?: string
          id?: string
          membership_id?: string
          paystack_reference?: string
          round_number?: number
          source?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_ledger: {
        Row: {
          amount: number
          circle_id: string | null
          created_at: string
          description: string | null
          direction: string
          id: string
          metadata: Json | null
          reference: string | null
          settled_at: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          circle_id?: string | null
          created_at?: string
          description?: string | null
          direction: string
          id?: string
          metadata?: Json | null
          reference?: string | null
          settled_at?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          circle_id?: string | null
          created_at?: string
          description?: string | null
          direction?: string
          id?: string
          metadata?: Json | null
          reference?: string | null
          settled_at?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      wallet_balances: {
        Row: {
          available_balance: number | null
          total_credited: number | null
          total_debited: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_trust_score: { Args: { p_user_id: string }; Returns: number }
      recalculate_all_trust_scores: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
