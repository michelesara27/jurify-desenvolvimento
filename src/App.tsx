// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ClientesCasos from "./pages/ClientesCasos";
import MinhasPecas from "./pages/MinhasPecas";
import Configuracoes from "./pages/Configuracoes";
import ModelosTemplates from "./pages/ModelosTemplates";
import HistoricoGeracoes from "./pages/HistoricoGeracoes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import RegisterCompany from "./pages/Auth/RegisterCompany";
import RecoverPassword from "./pages/Auth/RecoverPassword";
import InviteRegister from "./pages/Auth/InviteRegister";
import { useAuth } from "@/hooks/use-auth";
import { useCompanyMembership } from "@/hooks/use-company-membership";

const queryClient = new QueryClient();

const RequireCompany = () => {
  const { user, loading } = useAuth();
  const { data: membership, isLoading } = useCompanyMembership();
  if (loading || isLoading) return <div className="p-6">Carregando...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!membership) return <Navigate to="/auth/register-company" replace />;
  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas de autenticação */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register-company" element={<RegisterCompany />} />
          <Route path="/auth/recover-password" element={<RecoverPassword />} />
          <Route path="/auth/invite-register" element={<InviteRegister />} />

          {/* Rotas protegidas: exigem login e vínculo com empresa */}
          <Route element={<RequireCompany />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes-casos" element={<ClientesCasos />} />
            <Route path="/minhas-pecas" element={<MinhasPecas />} />
            <Route path="/modelos" element={<ModelosTemplates />} />
            <Route path="/historico-geracoes" element={<HistoricoGeracoes />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
