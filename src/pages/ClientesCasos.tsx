// src/pages/ClientesCasos.tsx
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  FileText,
  Users,
  Edit,
  Loader2,
} from "lucide-react";
import { NovoClienteForm } from "@/components/clients/NovoClienteForm";
import { EditClientForm } from "@/components/clients/EditClientForm";
import { NovoCasoForm } from "@/components/clients/NovoCasoForm";
import { EditCasoForm } from "@/components/clients/EditCasoForm";
import { useClients } from "@/hooks/use-clients";
import { useCases } from "@/hooks/use-cases";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
  ativo: "bg-success/10 text-success",
  inativo: "bg-muted text-muted-foreground",
  active: "bg-primary/10 text-primary",
  pending: "bg-warning/10 text-warning",
  closed: "bg-success/10 text-success",
  archived: "bg-muted text-muted-foreground",
};

const priorityColors = {
  urgent: "bg-destructive/10 text-destructive",
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-success/10 text-success",
};

const statusLabels = {
  active: "Ativo",
  pending: "Pendente",
  closed: "Finalizado",
  archived: "Arquivado",
};

const priorityLabels = {
  urgent: "Urgente",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const ClientesCasos = () => {
  const [novoClienteDialogOpen, setNovoClienteDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [novoCasoDialogOpen, setNovoCasoDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<string | null>(null);

  // Buscar os últimos 4 clientes cadastrados
  const {
    data: clients,
    isLoading: clientsLoading,
    error: clientsError,
    refetch: refetchClients,
  } = useClients(4);

  // Buscar os últimos 4 casos cadastrados
  const {
    data: cases,
    isLoading: casesLoading,
    error: casesError,
    refetch: refetchCases,
  } = useCases(4);

  const handleClienteAdicionado = () => {
    // O hook já invalida automaticamente as queries
    console.log("Cliente adicionado com sucesso!");
  };

  const handleEditClient = (clientId: string) => {
    setEditingClient(clientId);
  };

  const handleClienteAtualizado = () => {
    // O hook já invalida automaticamente as queries
    setEditingClient(null);
    console.log("Cliente atualizado com sucesso!");
  };

  const handleCasoAdicionado = () => {
    // O hook já invalida automaticamente as queries
    console.log("Caso adicionado com sucesso!");
  };

  const handleEditCase = (caseId: string) => {
    setEditingCase(caseId);
  };

  const handleCasoAtualizado = () => {
    // O hook já invalida automaticamente as queries
    setEditingCase(null);
    console.log("Caso atualizado com sucesso!");
  };

  const renderClientSkeleton = () => (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );

  const renderCaseSkeleton = () => (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Clientes e Casos
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus clientes e acompanhe o progresso dos casos
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Caso
            </Button>
            <Button
              className="gap-2"
              onClick={() => setNovoClienteDialogOpen(true)}
            >
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

        {/* Formulário de Edição de Cliente */}
        <EditClientForm
          clientId={editingClient}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onClienteAtualizado={handleClienteAtualizado}
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
                {clientsLoading ? (
                  // Skeleton loading para 4 clientes
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>{renderClientSkeleton()}</div>
                  ))
                ) : clientsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-2">
                      Erro ao carregar clientes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {clientsError.message}
                    </p>
                  </div>
                ) : clients && clients.length > 0 ? (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {client.name}
                          </h3>
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
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-success/10 text-success"
                          >
                            {client.client_type === "individual" ? "PF" : "PJ"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditClient(client.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">
                              CPF/CNPJ:
                            </strong>{" "}
                            {client.cpf_cnpj}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(client.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                      </div>

                      {client.notes && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <strong>Observações:</strong> {client.notes}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Nenhum cliente cadastrado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Novo Cliente" para começar
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Casos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Casos Recentes
                </CardTitle>
                <Button onClick={() => setNovoCasoDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Caso
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {casesLoading ? (
                  // Skeleton loading para 4 casos
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>{renderCaseSkeleton()}</div>
                  ))
                ) : casesError ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive mb-2">
                      Erro ao carregar casos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {casesError.message}
                    </p>
                  </div>
                ) : cases && cases.length > 0 ? (
                  cases.map((caso) => (
                    <div
                      key={caso.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {caso.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {caso.client?.name || "Cliente não encontrado"}
                            {caso.court && ` • ${caso.court}`}
                          </p>
                          {caso.case_number && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Processo: {caso.case_number}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="secondary"
                            className={priorityColors[caso.priority]}
                          >
                            {priorityLabels[caso.priority]}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={statusColors[caso.status]}
                          >
                            {statusLabels[caso.status]}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditCase(caso)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {caso.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {caso.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Criado:{" "}
                          {format(new Date(caso.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                        {caso.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Início:{" "}
                            {format(new Date(caso.start_date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Nenhum caso cadastrado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Clique em "Novo Caso" para começar
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Diálogos */}
      <NovoClienteForm
        open={novoClienteDialogOpen}
        onOpenChange={setNovoClienteDialogOpen}
        onClienteAdicionado={handleClienteAdicionado}
      />

      <EditClientForm
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        client={editingClient}
        onClienteAtualizado={handleClienteAtualizado}
      />

      <NovoCasoForm
        open={novoCasoDialogOpen}
        onOpenChange={setNovoCasoDialogOpen}
        onCasoAdicionado={handleCasoAdicionado}
      />

      <EditCasoForm
        open={!!editingCase}
        onOpenChange={(open) => !open && setEditingCase(null)}
        caso={editingCase}
        onCasoAtualizado={handleCasoAtualizado}
      />
    </MainLayout>
  );
};

export default ClientesCasos;
