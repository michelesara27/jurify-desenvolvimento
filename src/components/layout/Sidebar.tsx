// src/components/layout/Sidebar.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  History,
  Settings,
  Plus,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useCompanyMembership } from "@/hooks/use-company-membership";

const baseItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Nova Peça Jurídica", href: "/nova-peca", icon: Plus, variant: "primary" as const },
  { title: "Minhas Peças", href: "/minhas-pecas", icon: FileText },
  { title: "Modelos e Templates", href: "/modelos", icon: FolderOpen },
  { title: "Histórico de Gerações", href: "/historico-geracoes", icon: History },
  { title: "Clientes e Casos", href: "/clientes-casos", icon: Users },
  { title: "Configurações", href: "/configuracoes", icon: Settings, requiresRole: "admin" as const },
];

export const Sidebar = () => {
  const location = useLocation();
  const { data: membership } = useCompanyMembership();

  const sidebarItems = baseItems.filter((item: any) => {
    if (item.requiresRole && membership?.role !== item.requiresRole) return false;
    return true;
  });

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center justify-start px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Jurify</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={
                  item.variant === "primary"
                    ? "default"
                    : isActive
                    ? "secondary"
                    : "ghost"
                }
                className={cn(
                  "w-full justify-start gap-3 h-11 font-medium transition-colors",
                  item.variant === "primary" &&
                    "bg-primary hover:bg-primary-hover text-primary-foreground",
                  isActive &&
                    item.variant !== "primary" &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                  !isActive &&
                    item.variant !== "primary" &&
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
