// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCompanyMembership } from "@/hooks/use-company-membership";
import { useToast } from "@/hooks/use-toast";
import Landing from "./pages/Landing";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientesCasos = lazy(() => import("./pages/ClientesCasos"));
const MinhasPecas = lazy(() => import("./pages/MinhasPecas"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const ModelosTemplates = lazy(() => import("./pages/ModelosTemplates"));
const HistoricoGeracoes = lazy(() => import("./pages/HistoricoGeracoes"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Auth/Login"));
const RegisterCompany = lazy(() => import("./pages/Auth/RegisterCompany"));
const RecoverPassword = lazy(() => import("./pages/Auth/RecoverPassword"));
const InviteRegister = lazy(() => import("./pages/Auth/InviteRegister"));

const queryClient = new QueryClient();

const RequireCompany = () => {
  const { user, loading, signOut } = useAuth();
  const { data: membership, isLoading } = useCompanyMembership();
  const { toast } = useToast();
  if (loading || isLoading) return <div className="p-6">Carregando...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!membership) return <Navigate to="/auth/register-company" replace />;
  if (membership?.company && membership.company.is_active === false) {
    toast({
      title: "Acesso bloqueado",
      description: "Empresa vinculada ao usuário não se encontra ativa no sistema",
      variant: "destructive",
    });
    signOut();
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing pública como página inicial */}
          <Route path="/" element={<Landing />} />
          {/* Rotas públicas de autenticação (lazy) */}
          <Route
            path="/auth/login"
            element={
              <Suspense fallback={<div className="p-6">Carregando...</div>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/auth/register-company"
            element={
              <Suspense fallback={<div className="p-6">Carregando...</div>}>
                <RegisterCompany />
              </Suspense>
            }
          />
          <Route
            path="/auth/recover-password"
            element={
              <Suspense fallback={<div className="p-6">Carregando...</div>}>
                <RecoverPassword />
              </Suspense>
            }
          />
          <Route
            path="/auth/invite-register"
            element={
              <Suspense fallback={<div className="p-6">Carregando...</div>}>
                <InviteRegister />
              </Suspense>
            }
          />

          {/* Rotas protegidas: exigem login e vínculo com empresa */}
          <Route element={<RequireCompany />}>
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<div className="p-6">Carregando...</div>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="/clientes-casos"
              element={
                <Suspense fallback={<div className="p-6">Carregando...</div>}>
                  <ClientesCasos />
                </Suspense>
              }
            />
            <Route
              path="/minhas-pecas"
              element={
                <Suspense fallback={<div className="p-6">Carregando...</div>}>
                  <MinhasPecas />
                </Suspense>
              }
            />
            <Route
              path="/modelos"
              element={
                <Suspense fallback={<div className="p-6">Carregando...</div>}>
                  <ModelosTemplates />
                </Suspense>
              }
            />
            <Route
              path="/historico-geracoes"
              element={
                <Suspense fallback={<div className="p-6">Carregando...</div>}>
                  <HistoricoGeracoes />
                </Suspense>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <Suspense fallback={<div className="p-6">Carregando...</div>}>
                  <Configuracoes />
                </Suspense>
              }
            />
          </Route>

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <Suspense fallback={<div className="p-6">Carregando...</div>}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
