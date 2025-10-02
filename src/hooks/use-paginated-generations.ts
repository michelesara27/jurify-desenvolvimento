import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UsePaginatedGenerationsParams {
  page: number;
  limit: number;
  searchQuery?: string;
  statusFilter?: string;
  modelFilter?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minTokens?: number;
  maxTokens?: number;
}

interface PaginatedGenerationsResult {
  data: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const fetchPaginatedGenerations = async ({
  page,
  limit,
  searchQuery,
  statusFilter,
  modelFilter,
  dateRange,
  sortBy = "created_at",
  sortOrder = "desc",
  minTokens,
  maxTokens,
}: UsePaginatedGenerationsParams): Promise<PaginatedGenerationsResult> => {
  let query = supabase
    .from('ai_generations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Aplicar filtros
  if (searchQuery) {
    query = query.ilike('prompt', `%${searchQuery}%`);
  }

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  if (modelFilter && modelFilter !== 'all') {
    query = query.eq('model_used', modelFilter);
  }

  if (dateRange?.from) {
    query = query.gte('created_at', dateRange.from.toISOString());
  }

  if (dateRange?.to) {
    query = query.lte('created_at', dateRange.to.toISOString());
  }

  // Aplicar filtros de tokens
  if (minTokens !== undefined) {
    query = query.gte('tokens_used', minTokens);
  }
  
  if (maxTokens !== undefined) {
    query = query.lte('tokens_used', maxTokens);
  }

  // Aplicar ordenação
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Aplicar paginação
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const usePaginatedGenerations = ({
  page,
  limit,
  searchQuery,
  statusFilter,
  modelFilter,
  dateRange,
  sortBy = "created_at",
  sortOrder = "desc",
  minTokens,
  maxTokens,
}: UsePaginatedGenerationsParams) => {
  return useQuery({
    queryKey: ['paginated-ai-generations', {
      page,
      limit,
      searchQuery,
      statusFilter,
      modelFilter,
      dateRange,
      sortBy,
      sortOrder,
      minTokens,
      maxTokens,
    }],
    queryFn: () => fetchPaginatedGenerations({
      page,
      limit,
      searchQuery,
      statusFilter,
      modelFilter,
      dateRange,
      sortBy,
      sortOrder,
      minTokens,
      maxTokens,
    }),
    keepPreviousData: true,
  });
};
