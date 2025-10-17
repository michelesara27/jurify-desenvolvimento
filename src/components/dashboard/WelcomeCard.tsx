// src/components/clients/WelcomeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCompanyMembership } from "@/hooks/use-company-membership";

export const WelcomeCard = () => {
  const { user } = useAuth();
  const { data: membership } = useCompanyMembership();
  const displayName = user?.email?.split("@")[0] ?? "Usuário";
  const companyName = membership?.company?.name ?? "Sua empresa";
  const role = membership?.role ?? "membro";

  return (
    <Card className="bg-gradient-to-r from-sidebar to-sidebar-accent border-0 text-sidebar-foreground">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Bem-vindo, {displayName}! ({role})
            </h2>
            <p className="text-sidebar-foreground/80">
              {companyName}: gere peças jurídicas inteligentes e economize tempo.
            </p>
          </div>
          <Link to="/nova-peca">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Peça Jurídica
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
