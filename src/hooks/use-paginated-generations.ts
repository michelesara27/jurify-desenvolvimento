// src/hooks/use-generations.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PaginatedGenerationsParams {
  page: number;
  pageSize: number;
  searchQuery?: string;
  statusFilter?: string;
  modelFilter?: string;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
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
  pageSize,
  searchQuery,
  statusFilter,
  modelFilter,
  dateRange,
}: PaginatedGenerationsParams): Promise<PaginatedGenerationsResult> => {
  let query = supabase
    .from("ai_generations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Aplicar filtros
  if (searchQuery) {
    query = query.ilike("prompt", `%${searchQuery}%`);
  }

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  if (modelFilter && modelFilter !== "all") {
    query = query.eq("model_used", modelFilter);
  }

  if (dateRange?.from) {
    query = query.gte("created_at", dateRange.from.toISOString());
  }

  if (dateRange?.to) {
    query = query.lte("created_at", dateRange.to.toISOString());
  }

  // Aplicar paginação
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const usePaginatedGenerations = (params: PaginatedGenerationsParams) => {
  return useQuery({
    queryKey: ["paginated-ai-generations", params],
    queryFn: () => fetchPaginatedGenerations(params),
    keepPreviousData: true,
  });
};
