// client/src/components/AppSidebar.tsx
import {
  Home,
  FileText,
  FolderOpen,
  Layout,
  History,
  Users,
  Settings,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Nova Peça Jurídica",
    url: "#",
    icon: Plus,
  },
  {
    title: "Minhas Peças",
    url: "/pecas",
    icon: FileText,
  },
  {
    title: "Modelos & Templates",
    url: "#",
    icon: Layout,
  },
  {
    title: "Histórico de Serviços",
    url: "#",
    icon: History,
  },
  {
    title: "Clientes e Casos",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold text-foreground">Jurify</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-testid={`nav-${item.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
