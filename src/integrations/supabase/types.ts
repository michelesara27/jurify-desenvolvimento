// src/integrations/supabase/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      ai_generations: {
        Row: {
          completed_at: string | null;
          created_at: string;
          document_id: string | null;
          error_message: string | null;
          generation_time: number | null;
          id: string;
          model_used: string | null;
          prompt: string;
          status: Database["public"]["Enums"]["generation_status"] | null;
          tokens_used: number | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          document_id?: string | null;
          error_message?: string | null;
          generation_time?: number | null;
          id?: string;
          model_used?: string | null;
          prompt: string;
          status?: Database["public"]["Enums"]["generation_status"] | null;
          tokens_used?: number | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          document_id?: string | null;
          error_message?: string | null;
          generation_time?: number | null;
          id?: string;
          model_used?: string | null;
          prompt?: string;
          status?: Database["public"]["Enums"]["generation_status"] | null;
          tokens_used?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_generations_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "legal_documents";
            referencedColumns: ["id"];
          }
        ];
      };
      cases: {
        Row: {
          case_number: string | null;
          client_id: string;
          court: string | null;
          created_at: string;
          description: string | null;
          end_date: string | null;
          id: string;
          priority: Database["public"]["Enums"]["case_priority"] | null;
          start_date: string | null;
          status: Database["public"]["Enums"]["case_status"] | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          case_number?: string | null;
          client_id: string;
          court?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          priority?: Database["public"]["Enums"]["case_priority"] | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["case_status"] | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          case_number?: string | null;
          client_id?: string;
          court?: string | null;
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          priority?: Database["public"]["Enums"]["case_priority"] | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["case_status"] | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cases_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          }
        ];
      };
      clients: {
        Row: {
          address: string | null;
          client_type: Database["public"]["Enums"]["client_type"] | null;
          cpf_cnpj: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          client_type?: Database["public"]["Enums"]["client_type"] | null;
          cpf_cnpj?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address?: string | null;
          client_type?: Database["public"]["Enums"]["client_type"] | null;
          cpf_cnpj?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      document_templates: {
        Row: {
          created_at: string;
          description: string | null;
          document_type: Database["public"]["Enums"]["document_type"];
          id: string;
          is_active: boolean | null;
          is_system_template: boolean | null;
          name: string;
          template_content: string | null;
          updated_at: string;
          usage_count: number | null;
          user_id: string | null;
          variables: Json | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          document_type: Database["public"]["Enums"]["document_type"];
          id?: string;
          is_active?: boolean | null;
          is_system_template?: boolean | null;
          name: string;
          template_content?: string | null;
          updated_at?: string;
          usage_count?: number | null;
          user_id?: string | null;
          variables?: Json | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          document_type?: Database["public"]["Enums"]["document_type"];
          id?: string;
          is_active?: boolean | null;
          is_system_template?: boolean | null;
          name?: string;
          template_content?: string | null;
          updated_at?: string;
          usage_count?: number | null;
          user_id?: string | null;
          variables?: Json | null;
        };
        Relationships: [];
      };
      document_versions: {
        Row: {
          changes_summary: string | null;
          content: string;
          created_at: string;
          created_by: string;
          document_id: string;
          id: string;
          version_number: number;
        };
        Insert: {
          changes_summary?: string | null;
          content: string;
          created_at?: string;
          created_by: string;
          document_id: string;
          id?: string;
          version_number: number;
        };
        Update: {
          changes_summary?: string | null;
          content?: string;
          created_at?: string;
          created_by?: string;
          document_id?: string;
          id?: string;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "legal_documents";
            referencedColumns: ["id"];
          }
        ];
      };
      legal_documents: {
        Row: {
          ai_generated: boolean | null;
          case_id: string | null;
          client_id: string | null;
          content: string | null;
          created_at: string;
          document_type: Database["public"]["Enums"]["document_type"];
          file_url: string | null;
          generation_prompt: string | null;
          id: string;
          metadata: Json | null;
          pages_count: number | null;
          status: Database["public"]["Enums"]["document_status"] | null;
          tags: string[] | null;
          template_id: string | null;
          title: string;
          updated_at: string;
          user_id: string;
          word_count: number | null;
        };
        Insert: {
          ai_generated?: boolean | null;
          case_id?: string | null;
          client_id?: string | null;
          content?: string | null;
          created_at?: string;
          document_type: Database["public"]["Enums"]["document_type"];
          file_url?: string | null;
          generation_prompt?: string | null;
          id?: string;
          metadata?: Json | null;
          pages_count?: number | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          tags?: string[] | null;
          template_id?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
          word_count?: number | null;
        };
        Update: {
          ai_generated?: boolean | null;
          case_id?: string | null;
          client_id?: string | null;
          content?: string | null;
          created_at?: string;
          document_type?: Database["public"]["Enums"]["document_type"];
          file_url?: string | null;
          generation_prompt?: string | null;
          id?: string;
          metadata?: Json | null;
          pages_count?: number | null;
          status?: Database["public"]["Enums"]["document_status"] | null;
          tags?: string[] | null;
          template_id?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          word_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "legal_documents_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "legal_documents_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "legal_documents_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "document_templates";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          oab: string | null;
          phone: string | null;
          specialties: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          oab?: string | null;
          phone?: string | null;
          specialties?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          oab?: string | null;
          phone?: string | null;
          specialties?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      template_categories: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          sort_order: number | null;
          updated_at: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          sort_order?: number | null;
          updated_at?: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          sort_order?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      template_usage: {
        Row: {
          document_id: string | null;
          id: string;
          template_id: string;
          used_at: string;
          user_id: string;
          variables_used: Json | null;
        };
        Insert: {
          document_id?: string | null;
          id?: string;
          template_id: string;
          used_at?: string;
          user_id: string;
          variables_used?: Json | null;
        };
        Update: {
          document_id?: string | null;
          id?: string;
          template_id?: string;
          used_at?: string;
          user_id?: string;
          variables_used?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "template_usage_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "legal_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "template_usage_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "document_templates";
            referencedColumns: ["id"];
          }
        ];
      };
      user_settings: {
        Row: {
          ai_model: Database["public"]["Enums"]["ai_model_preference"] | null;
          auto_generation_enabled: boolean | null;
          created_at: string;
          deadline_reminders_enabled: boolean | null;
          document_notifications_enabled: boolean | null;
          email_notifications_enabled: boolean | null;
          id: string;
          improvement_suggestions_enabled: boolean | null;
          language: Database["public"]["Enums"]["language_preference"] | null;
          smart_review_enabled: boolean | null;
          system_updates_enabled: boolean | null;
          theme: Database["public"]["Enums"]["theme_preference"] | null;
          two_factor_enabled: boolean | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_model?: Database["public"]["Enums"]["ai_model_preference"] | null;
          auto_generation_enabled?: boolean | null;
          created_at?: string;
          deadline_reminders_enabled?: boolean | null;
          document_notifications_enabled?: boolean | null;
          email_notifications_enabled?: boolean | null;
          id?: string;
          improvement_suggestions_enabled?: boolean | null;
          language?: Database["public"]["Enums"]["language_preference"] | null;
          smart_review_enabled?: boolean | null;
          system_updates_enabled?: boolean | null;
          theme?: Database["public"]["Enums"]["theme_preference"] | null;
          two_factor_enabled?: boolean | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_model?: Database["public"]["Enums"]["ai_model_preference"] | null;
          auto_generation_enabled?: boolean | null;
          created_at?: string;
          deadline_reminders_enabled?: boolean | null;
          document_notifications_enabled?: boolean | null;
          email_notifications_enabled?: boolean | null;
          id?: string;
          improvement_suggestions_enabled?: boolean | null;
          language?: Database["public"]["Enums"]["language_preference"] | null;
          smart_review_enabled?: boolean | null;
          system_updates_enabled?: boolean | null;
          theme?: Database["public"]["Enums"]["theme_preference"] | null;
          two_factor_enabled?: boolean | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      ai_model_preference: "gpt-4" | "gpt-3.5" | "claude";
      case_priority: "low" | "medium" | "high" | "urgent";
      case_status: "active" | "pending" | "closed" | "archived";
      client_type: "individual" | "company";
      document_status: "draft" | "review" | "approved" | "filed" | "archived";
      document_type:
        | "peticion"
        | "contract"
        | "appeal"
        | "motion"
        | "brief"
        | "memorandum"
        | "other";
      generation_status: "pending" | "processing" | "completed" | "failed";
      language_preference: "pt-br" | "en";
      theme_preference: "light" | "dark" | "system";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      ai_model_preference: ["gpt-4", "gpt-3.5", "claude"],
      case_priority: ["low", "medium", "high", "urgent"],
      case_status: ["active", "pending", "closed", "archived"],
      client_type: ["individual", "company"],
      document_status: ["draft", "review", "approved", "filed", "archived"],
      document_type: [
        "peticion",
        "contract",
        "appeal",
        "motion",
        "brief",
        "memorandum",
        "other",
      ],
      generation_status: ["pending", "processing", "completed", "failed"],
      language_preference: ["pt-br", "en"],
      theme_preference: ["light", "dark", "system"],
    },
  },
} as const;
