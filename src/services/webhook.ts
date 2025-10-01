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

class WebhookService {
  private readonly webhookUrl = 'https://jurify-jairo.michelesara27.workers.dev/';
  private readonly timeout = 30000; // 30 segundos
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 segundo

  /**
   * Envia dados para o webhook externo com retry automático
   */
  async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Tentativa ${attempt}/${this.maxRetries} de envio para webhook`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          mode: 'cors', // Explicitamente definir modo CORS
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Jurify-App/1.0',
            'Origin': window.location.origin, // Adicionar origem explícita
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('Webhook enviado com sucesso na tentativa', attempt);
        return {
          success: true,
          message: 'Dados enviados com sucesso',
          data: result,
        };
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Erro desconhecido');
        
        console.error(`Erro na tentativa ${attempt}/${this.maxRetries}:`, lastError);
        
        // Se é erro de CORS ou rede, não vale a pena tentar novamente
        if (this.isCorsOrNetworkError(lastError)) {
          console.warn('Erro de CORS/rede detectado, interrompendo tentativas');
          break;
        }
        
        // Se não é a última tentativa, aguardar antes de tentar novamente
        if (attempt < this.maxRetries) {
          console.log(`Aguardando ${this.retryDelay}ms antes da próxima tentativa...`);
          await this.delay(this.retryDelay * attempt); // Backoff exponencial
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    return this.handleFinalError(lastError);
  }

  /**
   * Verifica se o erro é relacionado a CORS ou problemas de rede
   */
  private isCorsOrNetworkError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes('cors') ||
      errorMessage.includes('network') ||
      errorMessage.includes('failed to fetch') ||
      error.name === 'TypeError'
    );
  }

  /**
   * Trata o erro final após todas as tentativas
   */
  private handleFinalError(error: Error | null): WebhookResponse {
    if (!error) {
      return {
        success: false,
        message: 'Erro desconhecido ao enviar dados',
      };
    }

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Timeout: O webhook não respondeu dentro do tempo limite',
      };
    }

    if (this.isCorsOrNetworkError(error)) {
      return {
        success: false,
        message: 'Erro de conectividade: Verifique se o servidor webhook está configurado corretamente para CORS',
      };
    }

    return {
      success: false,
      message: `Erro na comunicação após ${this.maxRetries} tentativas: ${error.message}`,
    };
  }

  /**
   * Função auxiliar para delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Prepara o payload com os dados da peça jurídica e template
   */
  preparePayload(
    documentData: any,
    templateData?: any
  ): WebhookPayload {
    const payload: WebhookPayload = {
      document: {
        id: documentData.id || '',
        title: documentData.title || '',
        content: documentData.content || '',
        action_type: documentData.action_type || '',
        plaintiff: documentData.plaintiff || '',
        defendant: documentData.defendant || '',
        facts: documentData.facts || '',
        legal_basis: documentData.legal_basis || '',
        request: documentData.request || '',
        document_type: documentData.document_type || '',
        status: documentData.status || '',
        word_count: documentData.word_count || 0,
        pages_count: documentData.pages_count || 0,
        created_at: documentData.created_at || new Date().toISOString(),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'jurify-app',
        version: '1.0',
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
        console.warn('Webhook falhou, mas continuando operação:', result.message);
        // Aqui poderia implementar uma fila para retry posterior
        this.logFailedWebhook(payload, result.message);
      }
    } catch (error) {
      console.error('Erro crítico no webhook assíncrono:', error);
      this.logFailedWebhook(payload, error instanceof Error ? error.message : 'Erro desconhecido');
    }
  }

  /**
   * Log de webhooks que falharam para possível retry posterior
   */
  private logFailedWebhook(payload: WebhookPayload, errorMessage: string): void {
    const failedWebhook = {
      timestamp: new Date().toISOString(),
      payload,
      error: errorMessage,
    };
    
    // Salvar no localStorage para possível retry posterior
    try {
      const existingFailed = JSON.parse(localStorage.getItem('failed_webhooks') || '[]');
      existingFailed.push(failedWebhook);
      
      // Manter apenas os últimos 50 registros
      if (existingFailed.length > 50) {
        existingFailed.splice(0, existingFailed.length - 50);
      }
      
      localStorage.setItem('failed_webhooks', JSON.stringify(existingFailed));
    } catch (storageError) {
      console.error('Erro ao salvar webhook falhado no localStorage:', storageError);
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
      console.error('Erro ao preparar dados para webhook:', error);
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
