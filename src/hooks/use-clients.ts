// src/hooks/use-clients.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  client_type: "individual" | "company";
  address: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  client_type: "individual" | "company";
  address: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}

// Hook para buscar clientes
export const useClients = (limit?: number) => {
  return useQuery({
    queryKey: ["clients", limit],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erro ao buscar clientes: ${error.message}`);
      }

      return data as Client[];
    },
  });
};

// Hook para buscar um cliente específico
export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`Erro ao buscar cliente: ${error.message}`);
      }

      return data as Client;
    },
    enabled: !!id,
  });
};

// Hook para criar cliente
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getCurrentUserId, isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (clientData: CreateClientData) => {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated()) {
        // Para demonstração, usar um user_id fixo quando não autenticado
        // Em produção, isso deve redirecionar para login
        const demoUserId = "demo-user-" + crypto.randomUUID();

        const { data, error } = await supabase
          .from("clients")
          .insert([
            {
              ...clientData,
              user_id: demoUserId,
            },
          ])
          .select()
          .single();

        if (error) {
          throw new Error(`Erro ao criar cliente: ${error.message}`);
        }

        return data as Client;
      }

      // Usuário autenticado - usar o ID real
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Usuário não encontrado");
      }

      const { data, error } = await supabase
        .from("clients")
        .insert([
          {
            ...clientData,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar cliente: ${error.message}`);
      }

      return data as Client;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente criado com sucesso!",
        description: `${data.name} foi adicionado à sua lista de clientes.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar cliente
export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateClientData) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar cliente: ${error.message}`);
      }

      return data as Client;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", data.id] });
      toast({
        title: "Cliente atualizado com sucesso!",
        description: `As informações de ${data.name} foram atualizadas.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para deletar cliente
export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) {
        throw new Error(`Erro ao deletar cliente: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente removido com sucesso!",
        description: "O cliente foi removido da sua lista.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
