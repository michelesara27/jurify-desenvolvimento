// src/services/webhook.ts
/**
 * Serviço para integração com webhook externo
 * Responsável por enviar dados de peças jurídicas para processamento
 */

export interface WebhookPayload {
  // Dados da peça jurídica
  document: {
    id: string;
    title: string;
    content: string;
    action_type: string;
    plaintiff: string;
    defendant: string;
    facts: string;
    legal_basis: string;
    request: string;
    document_type: string;
    status: string;
    word_count: number;
    pages_count: number;
    created_at: string;
  };

  // Dados do template (se selecionado)
  template?: {
    id: string;
    name: string;
    description?: string;
    document_type: string;
    template_content?: string;
    variables?: Record<string, any>;
  };

  // Metadados adicionais
  metadata: {
    timestamp: string;
    source: string;
    version: string;
  };
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ProcessedWebhookContent {
  content: string;
  processedAt: string;
}

class WebhookService {
  private readonly webhookUrl =
    "https://jurify-jairo.michelesara27.workers.dev/";
  private readonly timeout = 75000; // 75 segundos
  private readonly maxRetries = 1; // Apenas uma tentativa para evitar duplicatas
  private readonly retryDelay = 1000; // 1 segundo
  private readonly pendingRequests = new Map<
    string,
    Promise<WebhookResponse>
  >(); // Controle de duplicatas

  /**
   * Gera uma chave única para identificar requisições duplicadas
   */
  private generateRequestKey(payload: WebhookPayload): string {
    const documentId = payload.document.id;
    const timestamp = payload.metadata.timestamp;
    return `${documentId}-${timestamp}`;
  }

  /**
   * Envia dados para o webhook externo com controle de duplicatas e timeout de 75 segundos
   */
  async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    const requestKey = this.generateRequestKey(payload);

    // Verificar se já existe uma requisição pendente para os mesmos dados
    if (this.pendingRequests.has(requestKey)) {
      console.log(
        "Requisição duplicada detectada, aguardando requisição existente..."
      );
      return await this.pendingRequests.get(requestKey)!;
    }

    // Criar nova requisição e armazenar no controle de duplicatas
    const requestPromise = this.executeWebhookRequest(payload);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Remover da lista de requisições pendentes após completar
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Executa a requisição real para o webhook
   */
  private async executeWebhookRequest(
    payload: WebhookPayload
  ): Promise<WebhookResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(
          `Enviando dados para webhook (timeout: ${this.timeout}ms)...`
        );

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.webhookUrl, {
          method: "POST",
          mode: "cors", // Explicitamente definir modo CORS
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Jurify-App/1.0",
            Origin: window.location.origin, // Adicionar origem explícita
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        console.log("Webhook enviado com sucesso");
        return {
          success: true,
          message: "Dados enviados com sucesso",
          data: result,
        };
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error("Erro desconhecido");

        console.error(`Erro na requisição webhook:`, lastError);

        // Com maxRetries = 1, não há retry, então sair do loop
        break;
      }
    }

    // Se chegou aqui, a requisição falhou
    return this.handleFinalError(lastError);
  }

  /**
   * Verifica se o erro é relacionado a CORS ou problemas de rede
   */
  private isCorsOrNetworkError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes("cors") ||
      errorMessage.includes("network") ||
      errorMessage.includes("failed to fetch") ||
      errorMessage.includes("access-control-allow-origin") ||
      errorMessage.includes("preflight") ||
      errorMessage.includes("blocked by cors policy") ||
      error.name === "TypeError"
    );
  }

  /**
   * Detecta especificamente erros de CORS
   */
  private isCorsError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes("cors") ||
      errorMessage.includes("access-control-allow-origin") ||
      errorMessage.includes("preflight") ||
      errorMessage.includes("blocked by cors policy")
    );
  }

  /**
   * Trata o erro final após todas as tentativas
   */
  private handleFinalError(error: Error | null): WebhookResponse {
    if (!error) {
      return {
        success: false,
        message: "Erro desconhecido ao enviar dados",
      };
    }

    if (error.name === "AbortError") {
      return {
        success: false,
        message:
          "Timeout: O webhook não respondeu dentro do tempo limite de 75 segundos",
      };
    }

    if (this.isCorsError(error)) {
      return {
        success: false,
        message:
          "Erro de CORS: O servidor webhook não está configurado para aceitar requisições desta origem. A peça foi salva com sucesso, mas o processamento automático está temporariamente indisponível.",
      };
    }

    if (this.isCorsOrNetworkError(error)) {
      return {
        success: false,
        message:
          "Erro de conectividade: Verifique se o servidor webhook está configurado corretamente para CORS",
      };
    }

    return {
      success: false,
      message: `Erro na comunicação: ${error.message}`,
    };
  }

  /**
   * Função auxiliar para delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Prepara o payload com os dados da peça jurídica e template
   */
  preparePayload(documentData: any, templateData?: any): WebhookPayload {
    const payload: WebhookPayload = {
      document: {
        id: documentData.id || "",
        title: documentData.title || "",
        content: documentData.content || "",
        action_type: documentData.action_type || "",
        plaintiff: documentData.plaintiff || "",
        defendant: documentData.defendant || "",
        facts: documentData.facts || "",
        legal_basis: documentData.legal_basis || "",
        request: documentData.request || "",
        document_type: documentData.document_type || "",
        status: documentData.status || "",
        word_count: documentData.word_count || 0,
        pages_count: documentData.pages_count || 0,
        created_at: documentData.created_at || new Date().toISOString(),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: "jurify-app",
        version: "1.0",
      },
    };

    // Adicionar dados do template se disponível
    if (templateData) {
      payload.template = {
        id: templateData.id,
        name: templateData.name,
        description: templateData.description,
        document_type: templateData.document_type,
        template_content: templateData.template_content,
        variables: templateData.variables,
      };
    }

    return payload;
  }

  /**
   * Envia dados de forma assíncrona (fire-and-forget) com fallback
   */
  async sendAsync(payload: WebhookPayload): Promise<void> {
    try {
      const result = await this.sendToWebhook(payload);

      if (!result.success) {
        console.warn(
          "Webhook falhou, mas continuando operação:",
          result.message
        );
        // Aqui poderia implementar uma fila para retry posterior
        this.logFailedWebhook(payload, result.message);
      }
    } catch (error) {
      console.error("Erro crítico no webhook assíncrono:", error);
      this.logFailedWebhook(
        payload,
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }

  /**
   * Log de webhooks que falharam para possível retry posterior
   */
  private logFailedWebhook(
    payload: WebhookPayload,
    errorMessage: string
  ): void {
    const failedWebhook = {
      timestamp: new Date().toISOString(),
      payload,
      error: errorMessage,
    };

    // Salvar no localStorage para possível retry posterior
    try {
      const existingFailed = JSON.parse(
        localStorage.getItem("failed_webhooks") || "[]"
      );
      existingFailed.push(failedWebhook);

      // Manter apenas os últimos 50 registros
      if (existingFailed.length > 50) {
        existingFailed.splice(0, existingFailed.length - 50);
      }

      localStorage.setItem("failed_webhooks", JSON.stringify(existingFailed));
    } catch (storageError) {
      console.error(
        "Erro ao salvar webhook falhado no localStorage:",
        storageError
      );
    }
  }

  /**
   * Envia dados de forma assíncrona (não bloqueia a UI)
   */
  async sendAsyncWithData(
    documentData: any,
    templateData?: any
  ): Promise<void> {
    try {
      const payload = this.preparePayload(documentData, templateData);
      await this.sendAsync(payload);
    } catch (error) {
      console.error("Erro ao preparar dados para webhook:", error);
    }
  }

  /**
   * Envia dados e aguarda resposta do webhook de forma síncrona
   */
  async sendSyncWithData(
    documentData: any,
    templateData?: any
  ): Promise<WebhookResponse> {
    try {
      const payload = this.preparePayload(documentData, templateData);
      return await this.sendToWebhook(payload);
    } catch (error) {
      console.error("Erro ao preparar dados para webhook síncrono:", error);
      throw error;
    }
  }

  /**
   * Processa o conteúdo retornado pelo webhook
   * Extrai apenas o conteúdo da chave 'content' e trata quebras de linha
   */
  processWebhookContent(webhookData: any): ProcessedWebhookContent {
    try {
      // Verificar se webhookData existe e tem a estrutura esperada
      if (!webhookData) {
        throw new Error("Dados do webhook não fornecidos");
      }

      // Extrair apenas o conteúdo da chave 'content'
      let content = "";

      if (typeof webhookData === "string") {
        // Se for uma string, tentar fazer parse do JSON
        try {
          const parsedData = JSON.parse(webhookData);
          content = parsedData.content || "";
        } catch {
          // Se não for JSON válido, usar a string como está
          content = webhookData;
        }
      } else if (typeof webhookData === "object" && webhookData.content) {
        // Se for um objeto com a chave 'content'
        content = webhookData.content;
      } else {
        // Se não encontrar a chave 'content', usar o objeto inteiro como string
        content = JSON.stringify(webhookData);
      }

      // Garantir que content seja uma string
      if (typeof content !== "string") {
        content = String(content);
      }

      // Substituir todas as ocorrências de "\\n" por quebras de linha reais
      const processedContent = content.replace(/\\n/g, "\n");

      return {
        content: processedContent,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Erro ao processar conteúdo do webhook:", error);

      // Retornar conteúdo seguro em caso de erro
      return {
        content:
          typeof webhookData === "string"
            ? webhookData
            : JSON.stringify(webhookData || {}),
        processedAt: new Date().toISOString(),
      };
    }
  }
}

// Instância singleton do serviço
export const webhookService = new WebhookService();

// Função utilitária para uso direto
export const sendDocumentToWebhook = async (
  documentData: any,
  templateData?: any
): Promise<WebhookResponse> => {
  const payload = webhookService.preparePayload(documentData, templateData);
  return webhookService.sendToWebhook(payload);
};
