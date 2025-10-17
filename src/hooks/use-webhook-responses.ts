// src/hooks/use-webhook-responses.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { documentGeneratorService } from "@/services/document-generator";

export interface WebhookResponseData {
  id?: string;
  user_id?: string | null;
  legal_document_id: string;
  company_id?: string | null;
  document_type: string;
  webhook_response_content: any;
  gerado?: boolean;
  documento_formatado?: string | null;
  data_geracao?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWebhookResponseData {
  legal_document_id: string;
  company_id?: string | null;
  document_type: string;
  webhook_response_content: any;
}

// Hook para buscar respostas de webhook do usuário
export const useWebhookResponses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["webhook-responses", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from("webhook_responses")
        .select(
          `
          *,
          legal_document:legal_documents(*)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar respostas do webhook:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook para buscar uma resposta específica de webhook
export const useWebhookResponse = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["webhook-response", id],
    queryFn: async () => {
      if (!user?.id || !id) {
        return null;
      }

      const { data, error } = await supabase
        .from("webhook_responses")
        .select(
          `
          *,
          legal_document:legal_documents(*)
        `
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar resposta do webhook:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id && !!id,
  });
};

// Hook para criar resposta de webhook
export const useCreateWebhookResponse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (responseData: CreateWebhookResponseData) => {
      const getCurrentUserId = () => {
        if (user?.id) return user.id;
        // Para modo demo, usar null já que temos foreign key constraint
        return null;
      };

      const userId = getCurrentUserId();

      const { data, error } = await supabase
        .from("webhook_responses")
        .insert({
          ...responseData,
          user_id: userId,
        })
        .select(
          `
          *,
          legal_document:legal_documents(*)
        `
        )
        .single();

      if (error) {
        console.error("Erro ao criar resposta do webhook:", error);
        throw error;
      }

      return data as WebhookResponseData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["webhook-responses"] });
      console.log("Resposta do webhook salva com sucesso:", data.id);
    },
    onError: (error) => {
      console.error("Erro ao salvar resposta do webhook:", error);
      toast({
        title: "Aviso",
        description:
          "Não foi possível salvar a resposta do webhook, mas a peça foi criada com sucesso.",
        variant: "default",
      });
    },
  });
};

// Hook para buscar respostas de webhook por documento
export const useWebhookResponsesByDocument = (documentId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["webhook-responses-by-document", documentId],
    queryFn: async () => {
      if (!documentId) {
        return [];
      }

      // Para modo demo (sem usuário autenticado), buscar por user_id null
      // Para usuários autenticados, buscar por user_id específico
      const userIdFilter = user?.id ? user.id : null;

      const { data, error } = await supabase
        .from("webhook_responses")
        .select("*")
        .eq("legal_document_id", documentId)
        .is("user_id", userIdFilter) // Usar .is() para buscar por null no modo demo
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erro ao buscar respostas do webhook por documento:",
          error
        );
        throw error;
      }

      return data || [];
    },
    enabled: !!documentId, // Remover dependência do user?.id
  });
};

// Hook para gerar documento formatado e atualizar webhook response
export const useGenerateFormattedDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (webhookResponseId: string) => {
      // Buscar a resposta do webhook
      const { data: webhookResponse, error: fetchError } = await supabase
        .from("webhook_responses")
        .select("*")
        .eq("id", webhookResponseId)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar resposta do webhook:", fetchError);
        throw new Error("Não foi possível encontrar a resposta do webhook");
      }

      if (webhookResponse.gerado) {
        throw new Error("Documento já foi gerado para esta petição");
      }

      // Gerar documento formatado
      const documentoGerado = documentGeneratorService.gerarDocumento(
        webhookResponse.webhook_response_content
      );

      // Atualizar o registro com o documento gerado
      const { data, error } = await supabase
        .from("webhook_responses")
        .update({
          gerado: true,
          documento_formatado: documentoGerado.conteudo,
          data_geracao: documentoGerado.dataGeracao,
        })
        .eq("id", webhookResponseId)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar webhook response:", error);
        throw error;
      }

      return data as WebhookResponseData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["webhook-responses"] });
      queryClient.invalidateQueries({
        queryKey: ["webhook-response", data.id],
      });
      toast({
        title: "Documento Gerado",
        description: "O documento formatado foi gerado com sucesso!",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Erro ao gerar documento:", error);
      toast({
        title: "Erro na Geração",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao gerar documento formatado",
        variant: "destructive",
      });
    },
  });
};

// Função utilitária para salvar resposta do webhook
export const saveWebhookResponse = async (
  responseData: CreateWebhookResponseData
): Promise<WebhookResponseData | null> => {
  try {
    const { data, error } = await supabase
      .from("webhook_responses")
      .insert({
        ...responseData,
        user_id: null, // Para modo demo, usar null
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar resposta do webhook:", error);
      return null;
    }

    return data as WebhookResponseData;
  } catch (error) {
    console.error("Erro crítico ao salvar resposta do webhook:", error);
    return null;
  }
};
