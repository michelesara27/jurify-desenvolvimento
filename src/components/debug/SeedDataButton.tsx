import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SeedAIGenerationsService } from "@/utils/seed-ai-generations";
import { Database, Loader2, Trash2 } from "lucide-react";

export function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dataCount, setDataCount] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await SeedAIGenerationsService.seedAIGenerations();
      
      toast({
        title: "Dados de teste criados!",
        description: "A tabela ai_generations foi populada com dados de exemplo.",
      });

      // Atualizar contagem
      const count = await SeedAIGenerationsService.checkExistingData();
      setDataCount(count);
    } catch (error) {
      console.error('Erro ao criar dados de teste:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar dados de teste. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await SeedAIGenerationsService.clearTestData();
      
      toast({
        title: "Dados de teste removidos!",
        description: "Os dados de exemplo foram removidos da tabela ai_generations.",
      });

      // Atualizar contagem
      const count = await SeedAIGenerationsService.checkExistingData();
      setDataCount(count);
    } catch (error) {
      console.error('Erro ao remover dados de teste:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover dados de teste. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckData = async () => {
    try {
      const count = await SeedAIGenerationsService.checkExistingData();
      setDataCount(count);
      
      toast({
        title: "Verificação concluída",
        description: `Encontrados ${count} registros na tabela ai_generations.`,
      });
    } catch (error) {
      console.error('Erro ao verificar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar dados. Verifique o console.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold text-sm">Debug: Dados de Geração de IA</h3>
      
      {dataCount !== null && (
        <p className="text-sm text-muted-foreground">
          Registros encontrados: {dataCount}
        </p>
      )}
      
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleSeedData}
          disabled={isSeeding}
          size="sm"
          variant="outline"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Criar Dados de Teste
            </>
          )}
        </Button>

        <Button
          onClick={handleClearData}
          disabled={isClearing}
          size="sm"
          variant="outline"
        >
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Removendo...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Dados de Teste
            </>
          )}
        </Button>

        <Button
          onClick={handleCheckData}
          size="sm"
          variant="secondary"
        >
          Verificar Dados
        </Button>
      </div>
    </div>
  );
}
