// server/storage.ts
import {
  type User,
  type InsertUser,
  type Cliente,
  type InsertCliente,
  type PecaJuridica,
  type InsertPecaJuridica,
  type Caso,
  type InsertCaso,
  type Template,
  type InsertTemplate,
  type Historico,
  type InsertHistorico,
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clientes
  getAllClientes(): Promise<Cliente[]>;
  getCliente(id: string): Promise<Cliente | undefined>;
  createCliente(cliente: InsertCliente): Promise<Cliente>;
  updateCliente(
    id: string,
    cliente: Partial<InsertCliente>
  ): Promise<Cliente | undefined>;
  deleteCliente(id: string): Promise<boolean>;

  // Peças Jurídicas
  getAllPecasJuridicas(): Promise<PecaJuridica[]>;
  getPecaJuridica(id: string): Promise<PecaJuridica | undefined>;
  getPecasByCliente(clienteId: string): Promise<PecaJuridica[]>;
  createPecaJuridica(peca: InsertPecaJuridica): Promise<PecaJuridica>;
  updatePecaJuridica(
    id: string,
    peca: Partial<InsertPecaJuridica>
  ): Promise<PecaJuridica | undefined>;
  deletePecaJuridica(id: string): Promise<boolean>;

  // Casos
  getAllCasos(): Promise<Caso[]>;
  getCaso(id: string): Promise<Caso | undefined>;
  getCasosByCliente(clienteId: string): Promise<Caso[]>;
  createCaso(caso: InsertCaso): Promise<Caso>;
  updateCaso(id: string, caso: Partial<InsertCaso>): Promise<Caso | undefined>;
  deleteCaso(id: string): Promise<boolean>;

  // Templates
  getAllTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Histórico
  getAllHistorico(): Promise<Historico[]>;
  getHistoricoByCliente(clienteId: string): Promise<Historico[]>;
  createHistorico(historico: InsertHistorico): Promise<Historico>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clientes: Map<string, Cliente>;
  private pecasJuridicas: Map<string, PecaJuridica>;
  private casos: Map<string, Caso>;
  private templates: Map<string, Template>;
  private historico: Map<string, Historico>;

  constructor() {
    this.users = new Map();
    this.clientes = new Map();
    this.pecasJuridicas = new Map();
    this.casos = new Map();
    this.templates = new Map();
    this.historico = new Map();

    // Inicializar com dados de exemplo
    this.initializeData();
  }

  private initializeData() {
    // Clientes de exemplo
    const cliente1: Cliente = {
      id: "cliente-1",
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 99999-9999",
      cpfCnpj: "123.456.789-00",
      endereco: "Rua das Flores, 123",
      createdAt: new Date(),
    };

    const cliente2: Cliente = {
      id: "cliente-2",
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 88888-8888",
      cpfCnpj: "987.654.321-00",
      endereco: "Av. Paulista, 456",
      createdAt: new Date(),
    };

    const cliente3: Cliente = {
      id: "cliente-3",
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      telefone: "(11) 77777-7777",
      cpfCnpj: "456.789.123-00",
      endereco: "Rua Augusta, 789",
      createdAt: new Date(),
    };

    this.clientes.set(cliente1.id, cliente1);
    this.clientes.set(cliente2.id, cliente2);
    this.clientes.set(cliente3.id, cliente3);

    // Peças jurídicas de exemplo
    const peca1: PecaJuridica = {
      id: "peca-1",
      clienteId: "cliente-1",
      titulo: "Petição Inicial - Ação Trabalhista",
      tipo: "Petição Inicial",
      status: "Finalizado",
      conteudo: "Conteúdo da petição inicial...",
      templateUsado: "Template Trabalhista",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const peca2: PecaJuridica = {
      id: "peca-2",
      clienteId: "cliente-2",
      titulo: "Contrato de Prestação de Serviços",
      tipo: "Contrato",
      status: "Executivo",
      conteudo: "Conteúdo do contrato...",
      templateUsado: "Template Contrato",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const peca3: PecaJuridica = {
      id: "peca-3",
      clienteId: "cliente-3",
      titulo: "Recurso Trabalhista",
      tipo: "Recurso",
      status: "Recursos",
      conteudo: "Conteúdo do recurso...",
      templateUsado: "Template Recurso",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.pecasJuridicas.set(peca1.id, peca1);
    this.pecasJuridicas.set(peca2.id, peca2);
    this.pecasJuridicas.set(peca3.id, peca3);

    // Casos de exemplo
    const caso1: Caso = {
      id: "caso-1",
      clienteId: "cliente-1",
      numeroProcesso: "0001234-56.2024.5.02.0001",
      tipoCaso: "Trabalhista",
      status: "Ativo",
      assunto: "Rescisão Indireta por Assédio Moral",
      valorCausa: "R$ 50.000,00",
      tribunal: "TRT 2ª Região",
      observacoes:
        "Cliente sofreu assédio moral por parte do supervisor direto.",
      dataInicio: new Date("2024-01-15"),
      dataFim: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caso2: Caso = {
      id: "caso-2",
      clienteId: "cliente-2",
      numeroProcesso: "0002345-67.2024.8.26.0100",
      tipoCaso: "Civil",
      status: "Finalizado",
      assunto: "Cobrança de Honorários Advocatícios",
      valorCausa: "R$ 25.000,00",
      tribunal: "TJSP",
      observacoes: "Caso resolvido favoravelmente ao cliente.",
      dataInicio: new Date("2024-02-20"),
      dataFim: new Date("2024-08-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const caso3: Caso = {
      id: "caso-3",
      clienteId: "cliente-3",
      numeroProcesso: "0003456-78.2024.4.03.6100",
      tipoCaso: "Previdenciário",
      status: "Ativo",
      assunto: "Aposentadoria por Invalidez",
      valorCausa: "R$ 80.000,00",
      tribunal: "JEF",
      observacoes: "Aguardando perícia médica do INSS.",
      dataInicio: new Date("2024-03-10"),
      dataFim: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.casos.set(caso1.id, caso1);
    this.casos.set(caso2.id, caso2);
    this.casos.set(caso3.id, caso3);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, cargo: insertUser.cargo || null };
    this.users.set(id, user);
    return user;
  }

  // Clientes
  async getAllClientes(): Promise<Cliente[]> {
    return Array.from(this.clientes.values());
  }

  async getCliente(id: string): Promise<Cliente | undefined> {
    return this.clientes.get(id);
  }

  async createCliente(insertCliente: InsertCliente): Promise<Cliente> {
    const id = randomUUID();
    const cliente: Cliente = {
      ...insertCliente,
      id,
      email: insertCliente.email || null,
      telefone: insertCliente.telefone || null,
      cpfCnpj: insertCliente.cpfCnpj || null,
      endereco: insertCliente.endereco || null,
      createdAt: new Date(),
    };
    this.clientes.set(id, cliente);
    return cliente;
  }

  async updateCliente(
    id: string,
    updateData: Partial<InsertCliente>
  ): Promise<Cliente | undefined> {
    const cliente = this.clientes.get(id);
    if (!cliente) return undefined;

    const updatedCliente = { ...cliente, ...updateData };
    this.clientes.set(id, updatedCliente);
    return updatedCliente;
  }

  async deleteCliente(id: string): Promise<boolean> {
    return this.clientes.delete(id);
  }

  // Peças Jurídicas
  async getAllPecasJuridicas(): Promise<PecaJuridica[]> {
    return Array.from(this.pecasJuridicas.values());
  }

  async getPecaJuridica(id: string): Promise<PecaJuridica | undefined> {
    return this.pecasJuridicas.get(id);
  }

  async getPecasByCliente(clienteId: string): Promise<PecaJuridica[]> {
    return Array.from(this.pecasJuridicas.values()).filter(
      (peca) => peca.clienteId === clienteId
    );
  }

  async createPecaJuridica(
    insertPeca: InsertPecaJuridica
  ): Promise<PecaJuridica> {
    const id = randomUUID();
    const peca: PecaJuridica = {
      ...insertPeca,
      id,
      clienteId: insertPeca.clienteId || null,
      conteudo: insertPeca.conteudo || null,
      templateUsado: insertPeca.templateUsado || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pecasJuridicas.set(id, peca);
    return peca;
  }

  async updatePecaJuridica(
    id: string,
    updateData: Partial<InsertPecaJuridica>
  ): Promise<PecaJuridica | undefined> {
    const peca = this.pecasJuridicas.get(id);
    if (!peca) return undefined;

    const updatedPeca = { ...peca, ...updateData, updatedAt: new Date() };
    this.pecasJuridicas.set(id, updatedPeca);
    return updatedPeca;
  }

  async deletePecaJuridica(id: string): Promise<boolean> {
    return this.pecasJuridicas.delete(id);
  }

  // Casos
  async getAllCasos(): Promise<Caso[]> {
    return Array.from(this.casos.values());
  }

  async getCaso(id: string): Promise<Caso | undefined> {
    return this.casos.get(id);
  }

  async getCasosByCliente(clienteId: string): Promise<Caso[]> {
    return Array.from(this.casos.values()).filter(
      (caso) => caso.clienteId === clienteId
    );
  }

  async createCaso(insertCaso: InsertCaso): Promise<Caso> {
    const id = randomUUID();
    const caso: Caso = {
      ...insertCaso,
      id,
      clienteId: insertCaso.clienteId || null,
      numeroProcesso: insertCaso.numeroProcesso || null,
      valorCausa: insertCaso.valorCausa || null,
      tribunal: insertCaso.tribunal || null,
      observacoes: insertCaso.observacoes || null,
      dataInicio: insertCaso.dataInicio || new Date(),
      dataFim: insertCaso.dataFim || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.casos.set(id, caso);
    return caso;
  }

  async updateCaso(
    id: string,
    updateData: Partial<InsertCaso>
  ): Promise<Caso | undefined> {
    const caso = this.casos.get(id);
    if (!caso) return undefined;

    const updatedCaso = { ...caso, ...updateData, updatedAt: new Date() };
    this.casos.set(id, updatedCaso);
    return updatedCaso;
  }

  async deleteCaso(id: string): Promise<boolean> {
    return this.casos.delete(id);
  }

  // Templates
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      ...insertTemplate,
      id,
      isPublico: insertTemplate.isPublico || null,
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  // Histórico
  async getAllHistorico(): Promise<Historico[]> {
    return Array.from(this.historico.values());
  }

  async getHistoricoByCliente(clienteId: string): Promise<Historico[]> {
    return Array.from(this.historico.values()).filter(
      (hist) => hist.clienteId === clienteId
    );
  }

  async createHistorico(insertHistorico: InsertHistorico): Promise<Historico> {
    const id = randomUUID();
    const hist: Historico = {
      ...insertHistorico,
      id,
      clienteId: insertHistorico.clienteId || null,
      valor: insertHistorico.valor || null,
      data: new Date(),
    };
    this.historico.set(id, hist);
    return hist;
  }
}

export const storage = new MemStorage();
