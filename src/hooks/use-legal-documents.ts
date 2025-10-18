// src/hooks/use-documents.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types";

export type LegalDocument = Tables<"legal_documents"> & {
  client?: Tables<"clients">;
  case?: Tables<"cases">;
  template?: Tables<"document_templates">;
  action_type?: string;
  plaintiff?: string;
  defendant?: string;
  facts?: string;
  legal_basis?: string;
  request?: string;
};

export type CreateLegalDocumentData = TablesInsert<"legal_documents"> & {
  action_type?: string;
  plaintiff?: string;
  defendant?: string;
  facts?: string;
  legal_basis?: string;
  request?: string;
};

export type UpdateLegalDocumentData = TablesUpdate<"legal_documents"> & {
  id: string;
  action_type?: string;
  plaintiff?: string;
  defendant?: string;
  facts?: string;
  legal_basis?: string;
  request?: string;
};

// Hook para buscar documentos jurídicos
export const useLegalDocuments = (limit?: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["legal-documents", user?.id, limit],
    queryFn: async () => {
      const getCurrentUserId = () => {
        if (user?.id) return user.id;
        // Para modo demo, gerar um ID único baseado na sessão
        const demoUserId = crypto.randomUUID();
        return demoUserId;
      };

      const userId = getCurrentUserId();

      let query = supabase
        .from("legal_documents")
        .select(
          `
          *,
          client:clients(*),
          case:cases(*),
          template:document_templates(*)
        `
        )
        .eq("is_active", true) // Filtrar apenas documentos ativos
        .order("created_at", { ascending: false });

      // Se não estiver em modo demo, filtrar por usuário
      if (user?.id) {
        query = query.eq("user_id", userId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar documentos:", error);
        throw error;
      }

      return data as LegalDocument[];
    },
    enabled: true,
  });
};

// Hook para buscar um documento específico
export const useLegalDocument = (id: string) => {
  return useQuery({
    queryKey: ["legal-document", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_documents")
        .select(
          `
          *,
          client:clients(*),
          case:cases(*),
          template:document_templates(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar documento:", error);
        throw error;
      }

      return data as LegalDocument;
    },
    enabled: !!id,
  });
};

// Hook para criar documento jurídico
export const useCreateLegalDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (
      documentData: Omit<CreateLegalDocumentData, "user_id">
    ) => {
      const getCurrentUserId = () => {
        if (user?.id) return user.id;
        // Para modo demo, usar null já que removemos a foreign key constraint
        return null;
      };

      const userId = getCurrentUserId();

      const { data, error } = await supabase
        .from("legal_documents")
        .insert({
          ...documentData,
          user_id: userId,
        })
        .select(
          `
          *,
          client:clients(*),
          case:cases(*),
          template:document_templates(*)
        `
        )
        .single();

      if (error) {
        console.error("Erro ao criar documento:", error);
        throw error;
      }

      return data as LegalDocument;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["legal-documents"] });
      toast({
        title: "Sucesso!",
        description: "Peça jurídica criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao criar documento:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar peça jurídica. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar documento jurídico
export const useUpdateLegalDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateLegalDocumentData) => {
      const { data, error } = await supabase
        .from("legal_documents")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          *,
          client:clients(*),
          case:cases(*),
          template:document_templates(*)
        `
        )
        .single();

      if (error) {
        console.error("Erro ao atualizar documento:", error);
        throw error;
      }

      return data as LegalDocument;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["legal-documents"] });
      queryClient.invalidateQueries({ queryKey: ["legal-document", data.id] });
      toast({
        title: "Sucesso!",
        description: "Peça jurídica atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar documento:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar peça jurídica. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar documento jurídico
export const useDeleteLegalDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("legal_documents")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro ao deletar documento:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-documents"] });
      toast({
        title: "Sucesso!",
        description: "Peça jurídica removida com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao deletar documento:", error);
      toast({
        title: "Erro",
        description: "Erro ao remover peça jurídica. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para inativar documento jurídico (soft delete)
export const useDeactivateLegalDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("legal_documents")
        .update({ is_active: false })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao inativar documento:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-documents"] });
      queryClient.invalidateQueries({ queryKey: ["legal-documents-stats"] });
      toast({
        title: "Sucesso!",
        description: "Peça jurídica inativada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao inativar documento:", error);
      toast({
        title: "Erro",
        description: "Erro ao inativar peça jurídica. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para estatísticas dos documentos
export const useLegalDocumentsStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["legal-documents-stats", user?.id],
    queryFn: async () => {
      const getCurrentUserId = () => {
        if (user?.id) return user.id;
        const demoUserId = crypto.randomUUID();
        return demoUserId;
      };

      const userId = getCurrentUserId();

      let query = supabase
        .from("legal_documents")
        .select("status, pages_count")
        .eq("is_active", true); // Filtrar apenas documentos ativos

      // Se não estiver em modo demo, filtrar por usuário
      if (user?.id) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar estatísticas:", error);
        throw error;
      }

      const stats = {
        total: data.length,
        draft: data.filter((d) => d.status === "draft").length,
        review: data.filter((d) => d.status === "review").length,
        approved: data.filter((d) => d.status === "approved").length,
        filed: data.filter((d) => d.status === "filed").length,
        archived: data.filter((d) => d.status === "archived").length,
        totalPages: data.reduce((acc, d) => acc + (d.pages_count || 0), 0),
      };

      return stats;
    },
    enabled: true,
  });
};
