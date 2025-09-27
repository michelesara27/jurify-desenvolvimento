import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ClientesCasos from "./pages/ClientesCasos";
import MinhasPecas from "./pages/MinhasPecas";
import Configuracoes from "./pages/Configuracoes";
import ModelosTemplates from "./pages/ModelosTemplates";
import HistoricoGeracoes from "./pages/HistoricoGeracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes-casos" element={<ClientesCasos />} />
          <Route path="/minhas-pecas" element={<MinhasPecas />} />
          <Route path="/modelos" element={<ModelosTemplates />} />
          <Route path="/historico-geracoes" element={<HistoricoGeracoes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
