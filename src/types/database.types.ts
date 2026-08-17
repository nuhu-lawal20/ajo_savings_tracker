export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          trust_score: number;
          kyc_tier: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          trust_score?: number;
          kyc_tier?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          trust_score?: number;
          kyc_tier?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      circles: {
        Row: {
          id: string;
          creator_id: string;
          name: string;
          description: string | null;
          contribution_amount: number;
          frequency: "daily" | "weekly" | "monthly";
          max_members: number;
          invite_code: string;
          status: "pending" | "active" | "completed" | "cancelled";
          current_round: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          name: string;
          description?: string | null;
          contribution_amount: number;
          frequency?: "daily" | "weekly" | "monthly";
          max_members?: number;
          invite_code: string;
          status?: "pending" | "active" | "completed" | "cancelled";
          current_round?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          name?: string;
          description?: string | null;
          contribution_amount?: number;
          frequency?: "daily" | "weekly" | "monthly";
          max_members?: number;
          invite_code?: string;
          status?: "pending" | "active" | "completed" | "cancelled";
          current_round?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          circle_id: string;
          user_id: string;
          payout_position: number;
          has_paid_current_round: boolean;
          payout_status: "pending" | "paid" | "failed";
          joined_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          user_id: string;
          payout_position: number;
          has_paid_current_round?: boolean;
          payout_status?: "pending" | "paid" | "failed";
          joined_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          user_id?: string;
          payout_position?: number;
          has_paid_current_round?: boolean;
          payout_status?: "pending" | "paid" | "failed";
          joined_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          circle_id: string;
          user_id: string;
          membership_id: string;
          amount: number;
          round_number: number;
          type: "contribution" | "payout" | "penalty";
          status: "pending" | "confirmed" | "failed";
          paystack_reference: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          circle_id: string;
          user_id: string;
          membership_id: string;
          amount: number;
          round_number?: number;
          type: "contribution" | "payout" | "penalty";
          status?: "pending" | "confirmed" | "failed";
          paystack_reference: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          circle_id?: string;
          user_id?: string;
          membership_id?: string;
          amount?: number;
          round_number?: number;
          type?: "contribution" | "payout" | "penalty";
          status?: "pending" | "confirmed" | "failed";
          paystack_reference?: string;
          created_at?: string;
        };
      };
    };
  };
}
