// client/src/hooks/useSupabaseClients.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Client {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf_cnpj: string | null;
  endereco: string | null;
  created_at: string;
  status?: string;
  updated_at?: string;
}

export interface ClientFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  endereco: string;
}

export function useSupabaseClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os clientes
  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setClients(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar clientes:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar clientes ao inicializar
  useEffect(() => {
    loadClients();
  }, []);

  // Criar novo cliente
  const createClient = async (clientData: ClientFormData): Promise<Client> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .insert([
          {
            nome: clientData.nome,
            email: clientData.email || null,
            telefone: clientData.telefone || null,
            cpf_cnpj: clientData.cpf_cnpj || null,
            endereco: clientData.endereco || null,
            status: "ativo",
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error("Nenhum dado retornado ao criar cliente");
      }

      // Atualizar lista local
      await loadClients();
      return data;
    } catch (err: any) {
      console.error("Erro ao criar cliente:", err);
      throw new Error(err.message || "Erro ao criar cliente");
    }
  };

  // Atualizar cliente
  const updateClient = async (
    id: string,
    clientData: Partial<ClientFormData>
  ): Promise<Client> => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (clientData.nome !== undefined) updateData.nome = clientData.nome;
      if (clientData.email !== undefined) updateData.email = clientData.email;
      if (clientData.telefone !== undefined)
        updateData.telefone = clientData.telefone;
      if (clientData.cpf_cnpj !== undefined)
        updateData.cpf_cnpj = clientData.cpf_cnpj;
      if (clientData.endereco !== undefined)
        updateData.endereco = clientData.endereco;

      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error("Cliente não encontrado");
      }

      // Atualizar lista local
      await loadClients();
      return data;
    } catch (err: any) {
      console.error("Erro ao atualizar cliente:", err);
      throw new Error(err.message || "Erro ao atualizar cliente");
    }
  };

  // Deletar cliente permanentemente
  const deleteClient = async (id: string): Promise<void> => {
    try {
      const { error: supabaseError } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      // Atualizar lista local
      await loadClients();
    } catch (err: any) {
      console.error("Erro ao deletar cliente:", err);
      throw new Error(err.message || "Erro ao deletar cliente");
    }
  };

  // Inativar cliente (soft delete)
  const inactivateClient = async (id: string): Promise<Client> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .update({
          status: "inativo",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error("Cliente não encontrado");
      }

      await loadClients();
      return data;
    } catch (err: any) {
      console.error("Erro ao inativar cliente:", err);
      throw new Error(err.message || "Erro ao inativar cliente");
    }
  };

  // Reativar cliente
  const reactivateClient = async (id: string): Promise<Client> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .update({
          status: "ativo",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error("Cliente não encontrado");
      }

      await loadClients();
      return data;
    } catch (err: any) {
      console.error("Erro ao reativar cliente:", err);
      throw new Error(err.message || "Erro ao reativar cliente");
    }
  };

  // Alternar status do cliente (inativar/reativar)
  const toggleClientStatus = async (id: string): Promise<Client> => {
    const client = clients.find((c) => c.id === id);
    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    if (client.status === "inativo") {
      return await reactivateClient(id);
    } else {
      return await inactivateClient(id);
    }
  };

  // Buscar cliente por ID
  const getClientById = async (id: string): Promise<Client | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data;
    } catch (err: any) {
      console.error("Erro ao buscar cliente:", err);
      throw new Error(err.message || "Erro ao buscar cliente");
    }
  };

  // Buscar últimos clientes
  const getRecentClients = async (limit: number = 6): Promise<Client[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data || [];
    } catch (err: any) {
      console.error("Erro ao buscar clientes recentes:", err);
      throw new Error(err.message || "Erro ao buscar clientes recentes");
    }
  };

  // Buscar clientes ativos
  const getActiveClients = async (): Promise<Client[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .select("*")
        .eq("status", "ativo")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data || [];
    } catch (err: any) {
      console.error("Erro ao buscar clientes ativos:", err);
      throw new Error(err.message || "Erro ao buscar clientes ativos");
    }
  };

  // Buscar clientes inativos
  const getInactiveClients = async (): Promise<Client[]> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("clientes")
        .select("*")
        .eq("status", "inativo")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data || [];
    } catch (err: any) {
      console.error("Erro ao buscar clientes inativos:", err);
      throw new Error(err.message || "Erro ao buscar clientes inativos");
    }
  };

  // Buscar clientes com filtro
  const searchClients = async (
    searchTerm: string,
    status?: string
  ): Promise<Client[]> => {
    try {
      let query = supabase.from("clientes").select("*");

      if (status) {
        query = query.eq("status", status);
      }

      if (searchTerm) {
        query = query.or(
          `nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,cpf_cnpj.ilike.%${searchTerm}%`
        );
      }

      query = query.order("created_at", { ascending: false });

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return data || [];
    } catch (err: any) {
      console.error("Erro ao buscar clientes:", err);
      throw new Error(err.message || "Erro ao buscar clientes");
    }
  };

  return {
    // Estado
    clients,
    isLoading,
    error,

    // Operações CRUD
    createClient,
    updateClient,
    deleteClient,

    // Gerenciamento de status
    inactivateClient,
    reactivateClient,
    toggleClientStatus,

    // Buscas
    getClientById,
    getRecentClients,
    getActiveClients,
    getInactiveClients,
    searchClients,

    // Utilitários
    refreshClients: loadClients,
  };
}
