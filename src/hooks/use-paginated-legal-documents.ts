// src/hooks/use-paginated-legal-documents.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Tables } from "@/integrations/supabase/types";

export type LegalDocument = Tables<"legal_documents"> & {
  client?: Tables<"clients">;
  case?: Tables<"cases">;
  template?: Tables<"document_templates">;
};

interface UsePaginatedLegalDocumentsParams {
  page: number;
  pageSize: number;
  searchQuery?: string;
  statusFilter?: string;
  // Quando verdadeiro, retorna apenas documentos gerados por IA
  onlyAIGenerated?: boolean;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface PaginatedLegalDocumentsResult {
  documents: LegalDocument[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const usePaginatedLegalDocuments = ({
  page,
  pageSize,
  searchQuery,
  statusFilter,
  onlyAIGenerated,
  dateRange,
}: UsePaginatedLegalDocumentsParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "paginated-legal-documents",
      user?.id,
      page,
      pageSize,
      searchQuery,
      statusFilter,
      dateRange?.from,
      dateRange?.to,
    ],
    queryFn: async (): Promise<PaginatedLegalDocumentsResult> => {
      const getCurrentUserId = () => {
        if (user?.id) return user.id;
        // Para modo demo, gerar um ID único baseado na sessão
        const demoUserId = crypto.randomUUID();
        return demoUserId;
      };

      const userId = getCurrentUserId();
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Query base para contar total de registros
      let countQuery = supabase
        .from("legal_documents")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Query principal para buscar dados
      let dataQuery = supabase
        .from("legal_documents")
        .select(
          `
          *,
          client:clients(*),
          case:cases(*),
          template:document_templates(*)
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(from, to);

      // Aplicar filtros se não estiver em modo demo
      if (user?.id) {
        countQuery = countQuery.eq("user_id", userId);
        dataQuery = dataQuery.eq("user_id", userId);
      }

      // Somente documentos gerados por IA
      if (onlyAIGenerated) {
        countQuery = countQuery.eq("ai_generated", true);
        dataQuery = dataQuery.eq("ai_generated", true);
      }

      // Filtro por busca (título, descrição)
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = `%${searchQuery.trim()}%`;
        countQuery = countQuery.or(
          `title.ilike.${searchTerm},description.ilike.${searchTerm}`
        );
        dataQuery = dataQuery.or(
          `title.ilike.${searchTerm},description.ilike.${searchTerm}`
        );
      }

      // Filtro por status
      if (statusFilter && statusFilter !== "all") {
        countQuery = countQuery.eq("status", statusFilter);
        dataQuery = dataQuery.eq("status", statusFilter);
      }

      // Filtro por data
      if (dateRange?.from) {
        const fromDate = dateRange.from.toISOString();
        countQuery = countQuery.gte("created_at", fromDate);
        dataQuery = dataQuery.gte("created_at", fromDate);
      }

      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Fim do dia
        const toDateString = toDate.toISOString();
        countQuery = countQuery.lte("created_at", toDateString);
        dataQuery = dataQuery.lte("created_at", toDateString);
      }

      // Executar queries
      const [{ count, error: countError }, { data, error: dataError }] =
        await Promise.all([countQuery, dataQuery]);

      if (countError) {
        console.error("Erro ao contar documentos:", countError);
        throw countError;
      }

      if (dataError) {
        console.error("Erro ao buscar documentos:", dataError);
        throw dataError;
      }

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        documents: (data as LegalDocument[]) || [],
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    },
    enabled: true,
  });
};
