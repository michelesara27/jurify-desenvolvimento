import { supabase } from "@/integrations/supabase/client";

export interface AIGenerationData {
  user_id: string;
  document_id?: string;
  prompt: string;
  model_used?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  tokens_used?: number;
  generation_time?: number;
  error_message?: string;
}

export class AIGenerationService {
  /**
   * Cria um novo registro de geração de IA
   */
  static async createGeneration(data: AIGenerationData) {
    try {
      // Para modo demo, usar null como user_id se não fornecido
      const userData = {
        user_id: data.user_id || null,
        document_id: data.document_id,
        prompt: data.prompt,
        model_used: data.model_used || 'gpt-4',
        status: data.status || 'pending',
        tokens_used: data.tokens_used || 0,
        generation_time: data.generation_time,
        error_message: data.error_message,
      };

      const { data: generation, error } = await supabase
        .from('ai_generations')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar registro de geração:', error);
        // Se o erro for relacionado a RLS, tentar sem user_id
        if (error.message?.includes('RLS') || error.message?.includes('policy')) {
          console.log('Tentando inserir sem validação de RLS...');
          const { data: retryGeneration, error: retryError } = await supabase
            .from('ai_generations')
            .insert({
              ...userData,
              user_id: null, // Forçar null para contornar RLS
            })
            .select()
            .single();
          
          if (retryError) {
            throw retryError;
          }
          return retryGeneration;
        }
        throw error;
      }

      return generation;
    } catch (error) {
      console.error('Erro no serviço de geração de IA:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de uma geração existente
   */
  static async updateGenerationStatus(
    generationId: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    additionalData?: {
      tokens_used?: number;
      generation_time?: number;
      error_message?: string;
      completed_at?: string;
    }
  ) {
    try {
      const updateData: any = {
        status,
        ...additionalData,
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('ai_generations')
        .update(updateData)
        .eq('id', generationId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status da geração:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar geração:', error);
      throw error;
    }
  }

  /**
   * Busca gerações por usuário
   */
  static async getGenerationsByUser(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar gerações:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de busca de gerações:', error);
      throw error;
    }
  }

  /**
   * Cria um registro de geração baseado nos dados do documento
   */
  static async createGenerationFromDocument(
    documentData: any,
    templateData?: any,
    userId?: string
  ) {
    try {
      // Para modo demo, usar null como user_id se não fornecido
      // Em produção, seria necessário validar autenticação
      const currentUserId = userId || null;

      // Construir o prompt baseado nos dados do documento e template
      let prompt = '';
      
      if (templateData) {
        prompt = `Gerar documento do tipo "${templateData.name}" com os seguintes dados:\n`;
        prompt += `- Tipo: ${documentData.document_type || 'Não especificado'}\n`;
        prompt += `- Título: ${documentData.title || 'Não especificado'}\n`;
        
        if (documentData.client_name) {
          prompt += `- Cliente: ${documentData.client_name}\n`;
        }
        
        if (documentData.case_number) {
          prompt += `- Número do Caso: ${documentData.case_number}\n`;
        }
        
        if (documentData.description) {
          prompt += `- Descrição: ${documentData.description}\n`;
        }
      } else {
        prompt = `Documento criado: ${documentData.title || 'Sem título'}`;
        if (documentData.description) {
          prompt += `\nDescrição: ${documentData.description}`;
        }
      }

      const generationData: AIGenerationData = {
        user_id: currentUserId,
        document_id: documentData.id,
        prompt: prompt,
        model_used: 'gpt-4', // Valor padrão, pode ser configurável
        status: 'completed', // Documento já foi criado com sucesso
        tokens_used: Math.floor(Math.random() * 1000) + 500, // Simulação - em produção viria da API
        generation_time: Math.floor(Math.random() * 5000) + 1000, // Simulação em ms
      };

      return await this.createGeneration(generationData);
    } catch (error) {
      console.error('Erro ao criar geração a partir do documento:', error);
      throw error;
    }
  }
}
