// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { IStorage } from "./storage";
import { z } from "zod";
import {
  insertPecaJuridicaSchema,
  insertClienteSchema,
  insertCasoSchema,
  insertTemplateSchema,
  insertHistoricoSchema,
} from "@shared/schema";

export async function registerRoutes(
  app: Express,
  storage: IStorage
): Promise<Server> {
  console.log("Registrando rotas da API...");

  // Middleware para JSON
  app.use("/api", (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    if (req.method !== "GET") {
      res.header("Content-Type", "application/json");
    }
    next();
  });

  // ===== ROTAS DE PEÇAS JURÍDICAS =====

  // GET /api/pecas - Listar todas as peças
  app.get("/api/pecas", async (req, res) => {
    try {
      const pecas = await storage.getAllPecasJuridicas();
      const clientes = await storage.getAllClientes();

      // Enriquecer com dados do cliente
      const pecasComCliente = pecas.map((peca) => {
        const cliente = clientes.find((c) => c.id === peca.clienteId);
        return {
          ...peca,
          clienteNome: cliente?.nome || "Cliente não encontrado",
        };
      });

      res.json(pecasComCliente);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar peças jurídicas" });
    }
  });

  // GET /api/pecas/:id - Buscar peça específica
  app.get("/api/pecas/:id", async (req, res) => {
    try {
      const peca = await storage.getPecaJuridica(req.params.id);
      if (!peca) {
        return res.status(404).json({ error: "Peça não encontrada" });
      }
      res.json(peca);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar peça" });
    }
  });

  // POST /api/pecas - Criar nova peça
  app.post("/api/pecas", async (req, res) => {
    try {
      const validatedData = insertPecaJuridicaSchema.parse(req.body);
      const novaPeca = await storage.createPecaJuridica(validatedData);
      res.status(201).json(novaPeca);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar peça" });
    }
  });

  // PUT /api/pecas/:id - Atualizar peça
  app.put("/api/pecas/:id", async (req, res) => {
    try {
      const validatedData = insertPecaJuridicaSchema.partial().parse(req.body);
      const pecaAtualizada = await storage.updatePecaJuridica(
        req.params.id,
        validatedData
      );

      if (!pecaAtualizada) {
        return res.status(404).json({ error: "Peça não encontrada" });
      }

      res.json(pecaAtualizada);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao atualizar peça" });
    }
  });

  // DELETE /api/pecas/:id - Deletar peça
  app.delete("/api/pecas/:id", async (req, res) => {
    try {
      const deletada = await storage.deletePecaJuridica(req.params.id);
      if (!deletada) {
        return res.status(404).json({ error: "Peça não encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar peça" });
    }
  });

  // ===== ROTAS DE CLIENTES =====

  // GET /api/clientes - Listar todos os clientes com suporte a filtros
  app.get("/api/clientes", async (req, res) => {
    try {
      const { limit, order, search } = req.query;

      let clientes = await storage.getAllClientes();

      // Aplicar filtro de busca se fornecido
      if (search && typeof search === "string") {
        const searchTerm = search.toLowerCase();
        clientes = clientes.filter(
          (cliente) =>
            cliente.nome.toLowerCase().includes(searchTerm) ||
            (cliente.email &&
              cliente.email.toLowerCase().includes(searchTerm)) ||
            (cliente.cpfCnpj && cliente.cpfCnpj.includes(searchTerm))
        );
      }

      // Ordenar clientes
      if (order === "desc") {
        clientes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        clientes.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      // Aplicar limite se fornecido
      if (limit && typeof limit === "string") {
        const limitNum = parseInt(limit, 10);
        if (!isNaN(limitNum)) {
          clientes = clientes.slice(0, limitNum);
        }
      }

      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });

  // GET /api/clientes/:id - Buscar cliente específico
  app.get("/api/clientes/:id", async (req, res) => {
    try {
      const cliente = await storage.getCliente(req.params.id);
      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cliente" });
    }
  });

  // POST /api/clientes - Criar novo cliente
  app.post("/api/clientes", async (req, res) => {
    try {
      const validatedData = insertClienteSchema.parse(req.body);
      const novoCliente = await storage.createCliente(validatedData);
      res.status(201).json(novoCliente);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });

  // PUT /api/clientes/:id - Atualizar cliente
  app.put("/api/clientes/:id", async (req, res) => {
    try {
      const validatedData = insertClienteSchema.partial().parse(req.body);
      const clienteAtualizado = await storage.updateCliente(
        req.params.id,
        validatedData
      );

      if (!clienteAtualizado) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      res.json(clienteAtualizado);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  });

  // DELETE /api/clientes/:id - Deletar cliente
  app.delete("/api/clientes/:id", async (req, res) => {
    try {
      const deletado = await storage.deleteCliente(req.params.id);
      if (!deletado) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar cliente" });
    }
  });

  // ===== ROTAS DE CASOS =====

  // GET /api/casos - Listar todos os casos
  app.get("/api/casos", async (req, res) => {
    try {
      const casos = await storage.getAllCasos();
      const clientes = await storage.getAllClientes();

      // Enriquecer com dados do cliente
      const casosComCliente = casos.map((caso) => {
        const cliente = clientes.find((c) => c.id === caso.clienteId);
        return {
          ...caso,
          clienteNome: cliente?.nome || "Cliente não encontrado",
        };
      });

      res.json(casosComCliente);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar casos" });
    }
  });

  // GET /api/casos/:id - Buscar caso específico
  app.get("/api/casos/:id", async (req, res) => {
    try {
      const caso = await storage.getCaso(req.params.id);
      if (!caso) {
        return res.status(404).json({ error: "Caso não encontrado" });
      }
      res.json(caso);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar caso" });
    }
  });

  // GET /api/clientes/:clienteId/casos - Buscar casos de um cliente
  app.get("/api/clientes/:clienteId/casos", async (req, res) => {
    try {
      const casos = await storage.getCasosByCliente(req.params.clienteId);
      res.json(casos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar casos do cliente" });
    }
  });

  // POST /api/casos - Criar novo caso
  app.post("/api/casos", async (req, res) => {
    try {
      const validatedData = insertCasoSchema.parse(req.body);
      const novoCaso = await storage.createCaso(validatedData);
      res.status(201).json(novoCaso);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar caso" });
    }
  });

  // PUT /api/casos/:id - Atualizar caso
  app.put("/api/casos/:id", async (req, res) => {
    try {
      const validatedData = insertCasoSchema.partial().parse(req.body);
      const casoAtualizado = await storage.updateCaso(
        req.params.id,
        validatedData
      );

      if (!casoAtualizado) {
        return res.status(404).json({ error: "Caso não encontrado" });
      }

      res.json(casoAtualizado);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao atualizar caso" });
    }
  });

  // DELETE /api/casos/:id - Deletar caso
  app.delete("/api/casos/:id", async (req, res) => {
    try {
      const deletado = await storage.deleteCaso(req.params.id);
      if (!deletado) {
        return res.status(404).json({ error: "Caso não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar caso" });
    }
  });

  // ===== ROTAS DE TEMPLATES =====

  // GET /api/templates - Listar todos os templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar templates" });
    }
  });

  // GET /api/templates/:id - Buscar template específico
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template não encontrado" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar template" });
    }
  });

  // POST /api/templates - Criar novo template
  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const novoTemplate = await storage.createTemplate(validatedData);
      res.status(201).json(novoTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar template" });
    }
  });

  // ===== ROTAS DE HISTÓRICO =====

  // GET /api/historico - Listar todo o histórico
  app.get("/api/historico", async (req, res) => {
    try {
      const historico = await storage.getAllHistorico();
      res.json(historico);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar histórico" });
    }
  });

  // GET /api/clientes/:clienteId/historico - Buscar histórico de um cliente
  app.get("/api/clientes/:clienteId/historico", async (req, res) => {
    try {
      const historico = await storage.getHistoricoByCliente(
        req.params.clienteId
      );
      res.json(historico);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar histórico do cliente" });
    }
  });

  // POST /api/historico - Criar novo registro de histórico
  app.post("/api/historico", async (req, res) => {
    try {
      const validatedData = insertHistoricoSchema.parse(req.body);
      const novoHistorico = await storage.createHistorico(validatedData);
      res.status(201).json(novoHistorico);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Dados inválidos", details: error.errors });
      }
      res.status(500).json({ error: "Erro ao criar registro de histórico" });
    }
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Testar conexão com o banco de dados
      await storage.getAllClientes();
      res.status(200).json({ status: "OK", message: "Sistema operacional" });
    } catch (error) {
      res.status(500).json({
        status: "ERROR",
        message: "Problema de conexão com o banco de dados",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
