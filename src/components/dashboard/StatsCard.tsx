// src/components/clients/StatsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: "blue" | "green" | "purple" | "orange";
  className?: string;
  description?: string;
}

const iconColorMap = {
  blue: "text-chart-blue bg-chart-blue/10",
  green: "text-chart-green bg-chart-green/10",
  purple: "text-chart-purple bg-chart-purple/10",
  orange: "text-chart-orange bg-chart-orange/10",
};

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "blue",
  className,
  description,
}: StatsCardProps) => {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              iconColorMap[iconColor]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
