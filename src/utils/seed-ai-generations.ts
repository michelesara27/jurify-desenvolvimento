import { supabase } from "@/integrations/supabase/client";

export interface SeedAIGenerationData {
  prompt: string;
  model_used: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tokens_used: number;
  generation_time: number;
  error_message?: string;
  document_type?: string;
  document_title?: string;
}

const sampleGenerations: SeedAIGenerationData[] = [
  {
    prompt: 'Gerar documento do tipo "Petição Inicial" com os seguintes dados:\n- Tipo: Ação Ordinária\n- Autor: João Silva\n- Réu: Empresa XYZ Ltda\n- Fatos: Cobrança indevida de taxa de manutenção\n- Fundamento Legal: Código de Defesa do Consumidor\n- Pedido: Restituição em dobro do valor cobrado',
    model_used: 'gpt-4',
    status: 'completed',
    tokens_used: 1250,
    generation_time: 3500,
    document_type: 'peticion',
    document_title: 'Ação Ordinária - João Silva vs Empresa XYZ Ltda'
  },
  {
    prompt: 'Gerar documento do tipo "Recurso de Apelação" com os seguintes dados:\n- Tipo: Recurso\n- Autor: Maria Santos\n- Réu: Banco ABC S.A.\n- Fatos: Negativa de empréstimo sem justificativa\n- Fundamento Legal: Lei de Proteção de Dados\n- Pedido: Reforma da sentença',
    model_used: 'gpt-4',
    status: 'completed',
    tokens_used: 980,
    generation_time: 2800,
    document_type: 'appeal',
    document_title: 'Recurso de Apelação - Maria Santos vs Banco ABC S.A.'
  },
  {
    prompt: 'Gerar documento do tipo "Contrato de Prestação de Serviços" com os seguintes dados:\n- Contratante: Empresa Tech Solutions\n- Contratado: Freelancer Developer\n- Objeto: Desenvolvimento de sistema web\n- Prazo: 6 meses\n- Valor: R$ 50.000,00',
    model_used: 'gpt-4',
    status: 'completed',
    tokens_used: 1450,
    generation_time: 4200,
    document_type: 'contract',
    document_title: 'Contrato de Prestação de Serviços - Tech Solutions'
  },
  {
    prompt: 'Gerar documento do tipo "Mandado de Segurança" com os seguintes dados:\n- Impetrante: Carlos Oliveira\n- Impetrado: Secretaria Municipal de Fazenda\n- Fatos: Cobrança de IPTU em valor superior ao devido\n- Direito Líquido e Certo: Isenção parcial de IPTU\n- Pedido: Suspensão da cobrança',
    model_used: 'gpt-4',
    status: 'failed',
    tokens_used: 0,
    generation_time: 0,
    error_message: 'Erro de conexão com a API',
    document_type: 'peticion',
    document_title: 'Mandado de Segurança - Carlos Oliveira'
  },
  {
    prompt: 'Gerar documento do tipo "Parecer Jurídico" com os seguintes dados:\n- Cliente: Construtora Moderna Ltda\n- Assunto: Análise de contrato de empreitada\n- Questões: Cláusulas de reajuste e prazo\n- Legislação: Código Civil e Lei de Licitações\n- Conclusão: Viabilidade jurídica do contrato',
    model_used: 'gpt-4',
    status: 'processing',
    tokens_used: 750,
    generation_time: 2100,
    document_type: 'brief',
    document_title: 'Parecer Jurídico - Construtora Moderna Ltda'
  },
  {
    prompt: 'Gerar documento do tipo "Petição de Habeas Corpus" com os seguintes dados:\n- Paciente: Roberto Lima\n- Autoridade Coatora: Delegado de Polícia\n- Fatos: Prisão em flagrante sem fundamentação\n- Constrangimento: Prisão ilegal\n- Pedido: Relaxamento da prisão',
    model_used: 'gpt-4',
    status: 'completed',
    tokens_used: 1100,
    generation_time: 3200,
    document_type: 'peticion',
    document_title: 'Habeas Corpus - Roberto Lima'
  },
  {
    prompt: 'Gerar documento do tipo "Ação Trabalhista" com os seguintes dados:\n- Reclamante: Ana Costa\n- Reclamada: Empresa de Limpeza Clean\n- Fatos: Demissão sem justa causa e não pagamento de verbas rescisórias\n- Direitos: FGTS, 13º salário, férias proporcionais\n- Pedido: Pagamento das verbas devidas',
    model_used: 'gpt-4',
    status: 'completed',
    tokens_used: 1350,
    generation_time: 3800,
    document_type: 'peticion',
    document_title: 'Ação Trabalhista - Ana Costa vs Empresa Clean'
  },
  {
    prompt: 'Gerar documento do tipo "Memorando Interno" com os seguintes dados:\n- Destinatário: Equipe Jurídica\n- Remetente: Sócio Diretor\n- Assunto: Novos procedimentos para análise de contratos\n- Conteúdo: Diretrizes para revisão contratual\n- Prazo: Implementação imediata',
    model_used: 'gpt-4',
    status: 'completed',
    tokens_used: 650,
    generation_time: 1800,
    document_type: 'memorandum',
    document_title: 'Memorando - Novos Procedimentos Contratuais'
  }
];

export class SeedAIGenerationsService {
  /**
   * Popula a tabela ai_generations com dados de teste
   */
  static async seedAIGenerations() {
    try {
      // Obter o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('Usuário não autenticado, criando dados de demonstração...');
        // Para modo demo, usar um user_id fictício ou null
      }

      const userId = user?.id || null;

      // Preparar dados para inserção
      const generationsToInsert = sampleGenerations.map((gen, index) => ({
        user_id: userId,
        document_id: null, // Será null para dados de teste
        prompt: gen.prompt,
        model_used: gen.model_used,
        status: gen.status,
        tokens_used: gen.tokens_used,
        generation_time: gen.generation_time,
        error_message: gen.error_message || null,
        // Adicionar timestamps variados para simular gerações em diferentes momentos
        created_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(), // Espalhar por vários dias
        completed_at: gen.status === 'completed' ? 
          new Date(Date.now() - (index * 24 * 60 * 60 * 1000) + gen.generation_time).toISOString() : 
          null
      }));

      // Inserir dados na tabela
      const { data, error } = await supabase
        .from('ai_generations')
        .insert(generationsToInsert)
        .select();

      if (error) {
        console.error('Erro ao inserir dados de teste:', error);
        throw error;
      }

      console.log(`${data?.length || 0} registros de geração de IA criados com sucesso!`);
      return data;
    } catch (error) {
      console.error('Erro no serviço de seed:', error);
      throw error;
    }
  }

  /**
   * Limpa todos os dados de teste da tabela ai_generations
   */
  static async clearTestData() {
    try {
      const { error } = await supabase
        .from('ai_generations')
        .delete()
        .is('document_id', null); // Remove apenas registros sem document_id (dados de teste)

      if (error) {
        console.error('Erro ao limpar dados de teste:', error);
        throw error;
      }

      console.log('Dados de teste removidos com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar dados de teste:', error);
      throw error;
    }
  }

  /**
   * Verifica se existem dados na tabela ai_generations
   */
  static async checkExistingData() {
    try {
      const { data, error, count } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao verificar dados existentes:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erro ao verificar dados existentes:', error);
      throw error;
    }
  }
}
