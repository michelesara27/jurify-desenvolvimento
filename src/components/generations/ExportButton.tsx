import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, FileJson, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  filters?: {
    search?: string;
    status?: string;
    model?: string;
    dateRange?: {
      from: Date | undefined;
      to: Date | undefined;
    };
    minTokens?: string;
    maxTokens?: string;
  };
}

const fetchAllGenerations = async (userId?: string, filters?: any) => {
  let query = supabase
    .from('ai_generations')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  // Aplicar filtros
  if (filters?.search) {
    query = query.or(`prompt.ilike.%${filters.search}%,model_used.ilike.%${filters.search}%,id.eq.${filters.search}`);
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq('status', filters.status);
  }

  if (filters?.model && filters.model !== "all") {
    query = query.eq('model_used', filters.model);
  }

  if (filters?.dateRange?.from) {
    query = query.gte('created_at', filters.dateRange.from.toISOString());
  }

  if (filters?.dateRange?.to) {
    const endDate = new Date(filters.dateRange.to);
    endDate.setHours(23, 59, 59, 999);
    query = query.lte('created_at', endDate.toISOString());
  }

  if (filters?.minTokens) {
    query = query.gte('tokens_used', parseInt(filters.minTokens));
  }

  if (filters?.maxTokens) {
    query = query.lte('tokens_used', parseInt(filters.maxTokens));
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar dados para exportação:', error);
    throw error;
  }

  return data || [];
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDataForExport = (data: any[]) => {
  return data.map(item => ({
    ID: item.id,
    'Data de Criação': format(new Date(item.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
    'Data de Conclusão': item.completed_at ? format(new Date(item.completed_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '-',
    Status: item.status === 'completed' ? 'Concluída' : 
           item.status === 'failed' ? 'Falhou' :
           item.status === 'processing' ? 'Processando' : 'Pendente',
    'Modelo Usado': item.model_used || '-',
    'Tokens Utilizados': item.tokens_used || 0,
    'Tempo de Geração (ms)': item.generation_time || '-',
    'Prompt': item.prompt ? item.prompt.substring(0, 100) + (item.prompt.length > 100 ? '...' : '') : '-',
    'Erro': item.error_message || '-',
  }));
};

export const ExportButton = ({ filters }: ExportButtonProps) => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const { data: allGenerations } = useQuery({
    queryKey: ['all-generations-export', user?.id, filters],
    queryFn: () => fetchAllGenerations(user?.id, filters),
    enabled: false, // Só busca quando necessário
  });

  const handleExport = async (format: 'csv' | 'json' | 'txt') => {
    setIsExporting(true);
    
    try {
      // Buscar dados
      const data = await fetchAllGenerations(user?.id, filters);
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum dado encontrado",
          description: "Não há gerações para exportar com os filtros aplicados.",
          variant: "destructive",
        });
        return;
      }

      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const formattedData = formatDataForExport(data);

      switch (format) {
        case 'csv': {
          const headers = Object.keys(formattedData[0]).join(',');
          const rows = formattedData.map(row => 
            Object.values(row).map(value => 
              typeof value === 'string' && value.includes(',') 
                ? `"${value.replace(/"/g, '""')}"` 
                : value
            ).join(',')
          );
          const csvContent = [headers, ...rows].join('\n');
          downloadFile(csvContent, `geracoes_${timestamp}.csv`, 'text/csv;charset=utf-8;');
          break;
        }

        case 'json': {
          const jsonContent = JSON.stringify(formattedData, null, 2);
          downloadFile(jsonContent, `geracoes_${timestamp}.json`, 'application/json');
          break;
        }

        case 'txt': {
          const txtContent = formattedData.map(item => {
            return Object.entries(item)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n') + '\n' + '-'.repeat(50) + '\n';
          }).join('\n');
          downloadFile(txtContent, `geracoes_${timestamp}.txt`, 'text/plain;charset=utf-8;');
          break;
        }
      }

      toast({
        title: "Exportação concluída",
        description: `${data.length} registros exportados com sucesso.`,
      });

    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="h-4 w-4 mr-2" />
          Exportar como JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('txt')}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar como TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
