// src/components/examples/MetricCard.tsx
import { MetricCard } from "../MetricCard";
import { FileText, Clock, Layout, Users } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <MetricCard
        title="Peças este mês"
        value="23"
        icon={FileText}
        color="blue"
      />
      <MetricCard
        title="Horas economizadas"
        value="47h"
        icon={Clock}
        color="green"
      />
      <MetricCard
        title="Modelos usados"
        value="8"
        icon={Layout}
        color="purple"
      />
      <MetricCard
        title="Clientes ativos"
        value="12"
        icon={Users}
        color="orange"
      />
    </div>
  );
}
