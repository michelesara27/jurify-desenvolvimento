// src/components/clients/AIUsageProgress.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const AIUsageProgress = () => {
  const usedPieces = 23;
  const totalPieces = 50;
  const remainingPieces = totalPieces - usedPieces;
  const usagePercentage = (usedPieces / totalPieces) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Uso da IA este mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={usagePercentage} className="h-3" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {usedPieces} de {totalPieces} peças
          </span>
          <span className="font-medium text-primary">
            Você ainda tem {remainingPieces} peças disponíveis no seu plano
            Profissional
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
