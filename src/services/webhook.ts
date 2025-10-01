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
  
  /**
   * Envia dados para o webhook
   */
  async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Jurify-App/1.0',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'Dados enviados com sucesso',
        data: result,
      };
      
    } catch (error) {
      console.error('Erro ao enviar dados para webhook:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            message: 'Timeout: O webhook não respondeu dentro do tempo limite',
          };
        }
        
        return {
          success: false,
          message: `Erro na comunicação: ${error.message}`,
        };
      }
      
      return {
        success: false,
        message: 'Erro desconhecido ao enviar dados',
      };
    }
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
   * Envia dados de forma assíncrona (não bloqueia a UI)
   */
  async sendAsync(
    documentData: any,
    templateData?: any
  ): Promise<void> {
    try {
      const payload = this.preparePayload(documentData, templateData);
      
      // Enviar de forma assíncrona sem bloquear
      this.sendToWebhook(payload).catch(error => {
        console.error('Erro no envio assíncrono para webhook:', error);
      });
      
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
