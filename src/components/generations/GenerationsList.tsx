// src/components/generations/GenerationsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchGenerations = async () => {
  const { data, error } = await supabase
    .from("ai_generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
};

const statusConfig = {
  completed: {
    label: "Concluído",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-blue-600",
  },
  processing: {
    label: "Processando",
    icon: Loader2,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export const GenerationsList = () => {
  const {
    data: generations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ai-generations"],
    queryFn: fetchGenerations,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Gerações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Gerações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Erro ao carregar gerações</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (generations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Gerações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p>Nenhuma geração encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Gerações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {generations.map((generation, index) => {
              const config =
                statusConfig[generation.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;

              return (
                <div key={generation.id}>
                  <div className="flex flex-col space-y-3 p-4 rounded-lg border bg-card">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`h-4 w-4 ${config.color} ${
                            generation.status === "processing"
                              ? "animate-spin"
                              : ""
                          }`}
                        />
                        <Badge variant={config.variant} className="text-xs">
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {generation.model_used}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {generation.prompt}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(generation.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>

                      {generation.tokens_used > 0 && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {generation.tokens_used.toLocaleString()} tokens
                        </div>
                      )}

                      {generation.generation_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {(generation.generation_time / 1000).toFixed(1)}s
                        </div>
                      )}

                      {generation.document_id && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Documento criado
                        </div>
                      )}
                    </div>

                    {/* Error message */}
                    {generation.error_message && (
                      <div className="p-2 bg-destructive/10 rounded text-xs text-destructive">
                        {generation.error_message}
                      </div>
                    )}
                  </div>

                  {index < generations.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
