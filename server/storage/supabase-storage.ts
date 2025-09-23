// server/storage/supabase-storage.ts
import { supabase } from "../lib/supabase";
import { IStorage } from "../storage";
import {
  User,
  InsertUser,
  Cliente,
  InsertCliente,
  PecaJuridica,
  InsertPecaJuridica,
  Caso,
  InsertCaso,
  Template,
  InsertTemplate,
  Historico,
  InsertHistorico,
} from "@shared/schema";

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert(insertUser)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Clientes
  async getAllClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
    return data || [];
  }

  async getCliente(id: string): Promise<Cliente | undefined> {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async createCliente(insertCliente: InsertCliente): Promise<Cliente> {
    const { data, error } = await supabase
      .from("clientes")
      .insert(insertCliente)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCliente(
    id: string,
    updateData: Partial<InsertCliente>
  ): Promise<Cliente | undefined> {
    const { data, error } = await supabase
      .from("clientes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async deleteCliente(id: string): Promise<boolean> {
    const { error } = await supabase.from("clientes").delete().eq("id", id);

    if (error) throw error;
    return true;
  }

  // Peças Jurídicas
  async getAllPecasJuridicas(): Promise<PecaJuridica[]> {
    const { data, error } = await supabase
      .from("pecas_juridicas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPecaJuridica(id: string): Promise<PecaJuridica | undefined> {
    const { data, error } = await supabase
      .from("pecas_juridicas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async getPecasByCliente(clienteId: string): Promise<PecaJuridica[]> {
    const { data, error } = await supabase
      .from("pecas_juridicas")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createPecaJuridica(
    insertPeca: InsertPecaJuridica
  ): Promise<PecaJuridica> {
    const { data, error } = await supabase
      .from("pecas_juridicas")
      .insert(insertPeca)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updatePecaJuridica(
    id: string,
    updateData: Partial<InsertPecaJuridica>
  ): Promise<PecaJuridica | undefined> {
    const { data, error } = await supabase
      .from("pecas_juridicas")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async deletePecaJuridica(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("pecas_juridicas")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  // Casos
  async getAllCasos(): Promise<Caso[]> {
    const { data, error } = await supabase
      .from("casos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getCaso(id: string): Promise<Caso | undefined> {
    const { data, error } = await supabase
      .from("casos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async getCasosByCliente(clienteId: string): Promise<Caso[]> {
    const { data, error } = await supabase
      .from("casos")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createCaso(insertCaso: InsertCaso): Promise<Caso> {
    const { data, error } = await supabase
      .from("casos")
      .insert(insertCaso)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCaso(
    id: string,
    updateData: Partial<InsertCaso>
  ): Promise<Caso | undefined> {
    const { data, error } = await supabase
      .from("casos")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async deleteCaso(id: string): Promise<boolean> {
    const { error } = await supabase.from("casos").delete().eq("id", id);

    if (error) throw error;
    return true;
  }

  // Templates
  async getAllTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const { data, error } = await supabase
      .from("templates")
      .insert(insertTemplate)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Histórico
  async getAllHistorico(): Promise<Historico[]> {
    const { data, error } = await supabase
      .from("historico")
      .select("*")
      .order("data", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getHistoricoByCliente(clienteId: string): Promise<Historico[]> {
    const { data, error } = await supabase
      .from("historico")
      .select("*")
      .eq("cliente_id", clienteId)
      .order("data", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createHistorico(insertHistorico: InsertHistorico): Promise<Historico> {
    const { data, error } = await supabase
      .from("historico")
      .insert(insertHistorico)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const supabaseStorage = new SupabaseStorage();
