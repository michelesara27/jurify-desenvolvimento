// src/pages/Dashboard.tsx
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AIUsageProgress } from "@/components/dashboard/AIUsageProgress";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { GenerationChart } from "@/components/dashboard/GenerationChart";
import { FileText, Clock, BookOpen, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <WelcomeCard />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Peças este mês"
            value="23"
            icon={FileText}
            iconColor="blue"
          />
          <StatsCard
            title="Horas economizadas"
            value="47h"
            icon={Clock}
            iconColor="green"
          />
          <StatsCard
            title="Modelos usados"
            value="8"
            icon={BookOpen}
            iconColor="purple"
          />
          <StatsCard
            title="Clientes ativos"
            value="12"
            icon={Users}
            iconColor="orange"
          />
        </div>

        {/* AI Usage Progress */}
        <AIUsageProgress />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentDocuments />
          <GenerationChart />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
