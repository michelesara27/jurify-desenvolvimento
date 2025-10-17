// src/hooks/use-cases.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface Case {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description: string | null;
  case_number: string | null;
  court: string | null;
  status: "active" | "pending" | "closed" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamento com cliente
  client?: {
    id: string;
    name: string;
    email: string | null;
  };
}

export interface CreateCaseData {
  client_id: string;
  title: string;
  description?: string;
  case_number?: string;
  court?: string;
  status?: "active" | "pending" | "closed" | "archived";
  priority?: "low" | "medium" | "high" | "urgent";
  start_date?: string;
  end_date?: string;
}

export interface UpdateCaseData extends Partial<CreateCaseData> {
  id: string;
}

// Hook para buscar casos
export const useCases = (limit?: number) => {
  return useQuery({
    queryKey: ["cases", limit],
    queryFn: async () => {
      let query = supabase
        .from("cases")
        .select(
          `
          *,
          client:clients(
            id,
            name,
            email
          )
        `
        )
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar casos: ${error.message}`);
      }

      return data as Case[];
    },
  });
};

// Hook para buscar um caso específico
export const useCase = (id: string) => {
  return useQuery({
    queryKey: ["case", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(
          `
          *,
          client:clients(
            id,
            name,
            email,
            phone,
            cpf_cnpj
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar caso: ${error.message}`);
      }

      return data as Case;
    },
    enabled: !!id,
  });
};

// Hook para criar um novo caso
export const useCreateCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getCurrentUserId, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (caseData: CreateCaseData) => {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated()) {
        // Para demonstração, usar um user_id fixo quando não autenticado
        // Em produção, isso deve redirecionar para login
        const demoUserId = "demo-user-" + crypto.randomUUID();

        const { data, error } = await supabase
          .from("cases")
          .insert([
            {
              ...caseData,
              user_id: demoUserId,
            },
          ])
          .select()
          .single();

        if (error) {
          throw new Error(`Erro ao criar caso: ${error.message}`);
        }

        return data;
      }

      // Usuário autenticado - usar o ID real
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      const { data, error } = await supabase
        .from("cases")
        .insert([
          {
            ...caseData,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar caso: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidar as queries relacionadas para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({
        title: "Sucesso!",
        description: "Caso criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao criar caso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o caso. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar um caso
export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateCaseData) => {
      const { data, error } = await supabase
        .from("cases")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar caso: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidar as queries relacionadas para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case"] });
      toast({
        title: "Sucesso!",
        description: "Caso atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao atualizar caso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o caso. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar um caso
export const useDeleteCase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cases").delete().eq("id", id);

      if (error) {
        throw new Error(`Erro ao deletar caso: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      // Invalidar as queries relacionadas para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast({
        title: "Sucesso!",
        description: "Caso excluído com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir caso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o caso. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

// Hook para buscar casos por cliente
export const useCasesByClient = (clientId: string) => {
  return useQuery({
    queryKey: ["cases", "client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(
          `
          *,
          client:clients(
            id,
            name,
            email
          )
        `
        )
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Erro ao buscar casos do cliente: ${error.message}`);
      }

      return data as Case[];
    },
    enabled: !!clientId,
  });
};
