// shared/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Usuários do sistema
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  cargo: text("cargo"), // Advogado, Assistente, etc.
});

// Clientes
export const clientes = pgTable("clientes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email"),
  telefone: text("telefone"),
  cpfCnpj: text("cpf_cnpj"),
  endereco: text("endereco"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Peças Jurídicas
export const pecasJuridicas = pgTable("pecas_juridicas", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clienteId: varchar("cliente_id").references(() => clientes.id),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull(), // Petição, Recurso, Contrato, etc.
  status: text("status").notNull(), // Finalizado, Executivo, Recursos, etc.
  conteudo: text("conteudo"),
  templateUsado: text("template_usado"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Templates
export const templates = pgTable("templates", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  conteudo: text("conteudo").notNull(),
  isPublico: integer("is_publico").default(1), // 1 = público, 0 = privado
  createdAt: timestamp("created_at").defaultNow(),
});

// Casos Jurídicos (Processos)
export const casos = pgTable("casos", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clienteId: varchar("cliente_id").references(() => clientes.id),
  numeroProcesso: text("numero_processo"),
  tipoCaso: text("tipo_caso").notNull(), // Trabalhista, Civil, Criminal, etc.
  status: text("status").notNull(), // Ativo, Finalizado, Suspenso, etc.
  assunto: text("assunto").notNull(),
  valorCausa: text("valor_causa"),
  tribunal: text("tribunal"),
  observacoes: text("observacoes"),
  dataInicio: timestamp("data_inicio").defaultNow(),
  dataFim: timestamp("data_fim"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Histórico de serviços
export const historico = pgTable("historico", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clienteId: varchar("cliente_id").references(() => clientes.id),
  descricao: text("descricao").notNull(),
  tipo: text("tipo").notNull(), // Consultoria, Elaboração, Revisão, etc.
  data: timestamp("data").defaultNow(),
  valor: text("valor"), // Para controle financeiro
});

// Schemas de inserção
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  nome: true,
  email: true,
  cargo: true,
});

export const insertClienteSchema = createInsertSchema(clientes).omit({
  id: true,
  createdAt: true,
});

export const insertPecaJuridicaSchema = createInsertSchema(pecasJuridicas).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  }
);

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export const insertCasoSchema = createInsertSchema(casos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHistoricoSchema = createInsertSchema(historico).omit({
  id: true,
  data: true,
});

// Tipos
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientes.$inferSelect;
export type InsertPecaJuridica = z.infer<typeof insertPecaJuridicaSchema>;
export type PecaJuridica = typeof pecasJuridicas.$inferSelect;
export type InsertCaso = z.infer<typeof insertCasoSchema>;
export type Caso = typeof casos.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertHistorico = z.infer<typeof insertHistoricoSchema>;
export type Historico = typeof historico.$inferSelect;
