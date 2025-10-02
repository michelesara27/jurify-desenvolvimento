import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

interface AIGenerationsStats {
  totalGenerations: number;
  totalTokens: number;
  averageGenerationTime: number;
  completedDocuments: number;
  pendingGenerations: number;
  processingGenerations: number;
  failedGenerations: number;
  completedGenerations: number;
  monthlyGrowth: number;
  tokensGrowth: number;
  averageTimeThisWeek: number;
  newDocumentsThisMonth: number;
}

const fetchAIGenerationsStats = async (userId?: string): Promise<AIGenerationsStats> => {
  // Query principal para todas as gerações
  let query = supabase
    .from('ai_generations')
    .select('*');

  // Se não estiver em modo demo, filtrar por usuário
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: generations, error } = await query;

  if (error) {
    console.error('Erro ao buscar estatísticas de gerações:', error);
    throw error;
  }

  const allGenerations = generations || [];

  // Calcular estatísticas básicas
  const totalGenerations = allGenerations.length;
  const totalTokens = allGenerations.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0);
  const completedGenerations = allGenerations.filter(gen => gen.status === 'completed');
  const averageGenerationTime = completedGenerations.length > 0 
    ? completedGenerations.reduce((sum, gen) => sum + (gen.generation_time || 0), 0) / completedGenerations.length / 1000 // converter para segundos
    : 0;

  // Contar por status
  const pendingGenerations = allGenerations.filter(gen => gen.status === 'pending').length;
  const processingGenerations = allGenerations.filter(gen => gen.status === 'processing').length;
  const failedGenerations = allGenerations.filter(gen => gen.status === 'failed').length;
  const completedDocuments = completedGenerations.length;

  // Calcular crescimento mensal (comparar com mês anterior)
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthGenerations = allGenerations.filter(gen => 
    new Date(gen.created_at) >= thisMonth
  );
  const lastMonthGenerations = allGenerations.filter(gen => 
    new Date(gen.created_at) >= lastMonth && new Date(gen.created_at) <= lastMonthEnd
  );

  const monthlyGrowth = lastMonthGenerations.length > 0 
    ? ((thisMonthGenerations.length - lastMonthGenerations.length) / lastMonthGenerations.length) * 100
    : thisMonthGenerations.length > 0 ? 100 : 0;

  // Calcular crescimento de tokens
  const thisMonthTokens = thisMonthGenerations.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0);
  const lastMonthTokens = lastMonthGenerations.reduce((sum, gen) => sum + (gen.tokens_used || 0), 0);
  
  const tokensGrowth = lastMonthTokens > 0 
    ? ((thisMonthTokens - lastMonthTokens) / lastMonthTokens) * 100
    : thisMonthTokens > 0 ? 100 : 0;

  // Calcular tempo médio desta semana
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekGenerations = completedGenerations.filter(gen => 
    new Date(gen.created_at) >= oneWeekAgo
  );
  
  const averageTimeThisWeek = thisWeekGenerations.length > 0
    ? thisWeekGenerations.reduce((sum, gen) => sum + (gen.generation_time || 0), 0) / thisWeekGenerations.length / 1000
    : 0;

  // Novos documentos este mês (gerações completadas)
  const newDocumentsThisMonth = thisMonthGenerations.filter(gen => gen.status === 'completed').length;

  return {
    totalGenerations,
    totalTokens,
    averageGenerationTime,
    completedDocuments,
    pendingGenerations,
    processingGenerations,
    failedGenerations,
    completedGenerations: completedDocuments,
    monthlyGrowth,
    tokensGrowth,
    averageTimeThisWeek,
    newDocumentsThisMonth,
  };
};

export const useAIGenerationsStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["ai-generations-stats", user?.id],
    queryFn: () => fetchAIGenerationsStats(user?.id),
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 10000, // Considerar dados obsoletos após 10 segundos
  });
};

// Hook para formatar números de forma amigável
export const useFormattedStats = () => {
  const { data: stats, isLoading, error } = useAIGenerationsStats();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 1) {
      return (seconds * 1000).toFixed(0) + 'ms';
    }
    return seconds.toFixed(1) + 's';
  };

  const formatGrowth = (growth: number): string => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  // Valores padrão quando não há dados
  const defaultStats = {
    totalGenerations: "0",
    totalTokens: "0",
    averageGenerationTime: "0ms",
    completedDocuments: "0",
    monthlyGrowth: "+0.0%",
    tokensGrowth: "+0.0%",
    averageTimeThisWeek: "0ms",
    newDocumentsThisMonth: "0",
  };

  return {
    stats,
    isLoading,
    error,
    formatted: stats ? {
      totalGenerations: formatNumber(stats.totalGenerations),
      totalTokens: formatNumber(stats.totalTokens),
      averageGenerationTime: formatTime(stats.averageGenerationTime),
      completedDocuments: formatNumber(stats.completedDocuments),
      monthlyGrowth: formatGrowth(stats.monthlyGrowth),
      tokensGrowth: formatGrowth(stats.tokensGrowth),
      averageTimeThisWeek: formatTime(stats.averageTimeThisWeek),
      newDocumentsThisMonth: formatNumber(stats.newDocumentsThisMonth),
    } : defaultStats,
  };
};
