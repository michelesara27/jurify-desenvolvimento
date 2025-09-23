// src/components/AIUsageIndicator.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIUsageIndicatorProps {
  currentUsage: number;
  maxUsage: number;
  unit?: string;
}

export function AIUsageIndicator({
  currentUsage,
  maxUsage,
  unit = "peças",
}: AIUsageIndicatorProps) {
  const percentage = (currentUsage / maxUsage) * 100;

  return (
    <Card data-testid="ai-usage-indicator">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Uso da IA este mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress
          value={percentage}
          className="h-2"
          data-testid="ai-usage-progress"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Você está com {currentUsage} {unit} disponíveis do seu plano
            Profissional
          </span>
          <span>
            {currentUsage} de {maxUsage} {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
