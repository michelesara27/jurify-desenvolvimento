import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Phone, Mail, Calendar, FileText, Users } from "lucide-react";
import { NovoClienteForm } from "@/components/clients/NovoClienteForm";

const clients = [
  {
    id: 1,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 99999-9999",
    cases: 3,
    activeCases: 2,
    lastActivity: "2024-01-15",
    status: "ativo",
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao.silva@email.com", 
    phone: "(11) 88888-8888",
    cases: 1,
    activeCases: 1,
    lastActivity: "2024-01-12",
    status: "ativo",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 77777-7777", 
    cases: 5,
    activeCases: 0,
    lastActivity: "2023-12-20",
    status: "inativo",
  },
];

const cases = [
  {
    id: 1,
    title: "Ação Trabalhista - Horas Extras",
    client: "Maria Santos",
    type: "Trabalhista",
    status: "em_andamento",
    priority: "alta",
    startDate: "2024-01-01",
    nextHearing: "2024-02-15",
  },
  {
    id: 2,
    title: "Divórcio Consensual",
    client: "João Silva",
    type: "Família",
    status: "documentacao",
    priority: "media",
    startDate: "2024-01-10",
    nextHearing: null,
  },
  {
    id: 3,
    title: "Cobrança de Dívida",
    client: "Ana Costa",
    type: "Cível",
    status: "finalizado",
    priority: "baixa",
    startDate: "2023-11-15",
    nextHearing: null,
  },
];

const statusColors = {
  ativo: "bg-success/10 text-success",
  inativo: "bg-muted text-muted-foreground",
  em_andamento: "bg-primary/10 text-primary",
  documentacao: "bg-warning/10 text-warning",
  finalizado: "bg-success/10 text-success",
};

const priorityColors = {
  alta: "bg-destructive/10 text-destructive",
  media: "bg-warning/10 text-warning",
  baixa: "bg-success/10 text-success",
};

const ClientesCasos = () => {
  const [novoClienteDialogOpen, setNovoClienteDialogOpen] = useState(false);
  
  const handleClienteAdicionado = () => {
    // Aqui poderia recarregar a lista de clientes
    console.log("Cliente adicionado com sucesso!");
  };
  
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes e Casos</h1>
            <p className="text-muted-foreground">Gerencie seus clientes e acompanhe o progresso dos casos</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Caso
            </Button>
            <Button className="gap-2" onClick={() => setNovoClienteDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>
        
        {/* Formulário de Novo Cliente */}
        <NovoClienteForm 
          open={novoClienteDialogOpen} 
          onOpenChange={setNovoClienteDialogOpen} 
          onClienteAdicionado={handleClienteAdicionado}
        />

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes ou casos..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div key={client.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{client.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={statusColors[client.status as keyof typeof statusColors]}
                      >
                        {client.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span><strong>{client.cases}</strong> casos totais</span>
                        <span><strong>{client.activeCases}</strong> ativos</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(client.lastActivity).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Casos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Casos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.map((caso) => (
                  <div key={caso.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{caso.title}</h3>
                        <p className="text-sm text-muted-foreground">{caso.client} • {caso.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className={priorityColors[caso.priority as keyof typeof priorityColors]}
                        >
                          {caso.priority}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={statusColors[caso.status as keyof typeof statusColors]}
                        >
                          {caso.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Início: {new Date(caso.startDate).toLocaleDateString('pt-BR')}
                      </div>
                      {caso.nextHearing && (
                        <div className="flex items-center gap-1 text-primary">
                          <Calendar className="h-3 w-3" />
                          Próxima audiência: {new Date(caso.nextHearing).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientesCasos;
