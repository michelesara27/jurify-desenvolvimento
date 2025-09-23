// client/src/pages/ClientesECasos.tsx
import { useState, useEffect } from "react";
import { ClientsFilterBar } from "@/components/ClientsFilterBar";
import { ClientsListTable } from "@/components/ClientsListTable";
import { ClientFormModal } from "@/components/ClientFormModal";
import { ClientViewModal } from "@/components/ClientViewModal";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClients } from "@/hooks/useSupabaseClients";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientData {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf_cnpj: string | null;
  endereco: string | null;
  created_at: string;
  status?: string;
}

export default function ClientesECasos() {
  const { toast } = useToast();
  const {
    clients: allClients,
    isLoading: isLoadingClients,
    createClient,
    updateClient,
    toggleClientStatus,
    getRecentClients,
    refreshClients,
  } = useSupabaseClients();

  const [recentClients, setRecentClients] = useState<ClientData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClientFormModalOpen, setIsClientFormModalOpen] = useState(false);
  const [isClientViewModalOpen, setIsClientViewModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [viewingClient, setViewingClient] = useState<ClientData | null>(null);
  const [clientToToggleStatus, setClientToToggleStatus] = useState<
    string | null
  >(null);

  // Carregar clientes recentes
  useEffect(() => {
    const loadRecentClients = async () => {
      try {
        const recent = await getRecentClients(6);
        setRecentClients(recent);
      } catch (error) {
        console.error("Erro ao carregar clientes recentes:", error);
      }
    };

    loadRecentClients();
  }, [allClients]);

  // Filtrar clientes (mostrar apenas ativos na lista principal)
  const filteredClients = allClients.filter(
    (client) =>
      client.status !== "inativo" &&
      (client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email &&
          client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.cpf_cnpj && client.cpf_cnpj.includes(searchTerm)))
  );

  // Handlers
  const handleNewClient = () => {
    setEditingClient(null);
    setIsClientFormModalOpen(true);
  };

  const handleViewClient = (id: string) => {
    const client = allClients.find((c) => c.id === id);
    if (client) {
      setViewingClient(client);
      setIsClientViewModalOpen(true);
    }
  };

  const handleEditClient = (id: string) => {
    const client = allClients.find((c) => c.id === id);
    if (client) {
      setEditingClient(client);
      setIsClientFormModalOpen(true);
    }
  };

  const handleToggleClientStatus = (id: string) => {
    setClientToToggleStatus(id);
  };

  const confirmToggleClientStatus = async () => {
    if (!clientToToggleStatus) return;

    try {
      const client = allClients.find((c) => c.id === clientToToggleStatus);

      await toggleClientStatus(clientToToggleStatus);

      toast({
        title:
          client?.status === "inativo"
            ? "Cliente reativado"
            : "Cliente inativado",
        description:
          client?.status === "inativo"
            ? "O cliente foi reativado com sucesso."
            : "O cliente foi inativado com sucesso.",
      });

      setClientToToggleStatus(null);
      refreshClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description:
          error.message || "Não foi possível alterar o status do cliente.",
        variant: "destructive",
      });
    }
  };

  const handleClientFormSubmit = async (data: any) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        });
      } else {
        await createClient(data);
        toast({
          title: "Cliente criado",
          description: "O novo cliente foi cadastrado com sucesso.",
        });
      }

      setIsClientFormModalOpen(false);
      setEditingClient(null);
      refreshClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o cliente.",
        variant: "destructive",
      });
    }
  };

  const handleViewCases = (id: string) => {
    const client = allClients.find((c) => c.id === id);
    if (client) {
      toast({
        title: "Visualizar Casos",
        description: `Funcionalidade de visualização de casos para ${client.nome} será implementada em breve.`,
      });
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="clientes-casos-page">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Clientes e Casos</h1>
        <p className="text-muted-foreground">
          Gerencie seus clientes e seus respectivos casos jurídicos.
        </p>
      </div>

      {/* Barra de filtros para clientes */}
      <ClientsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClient={handleNewClient}
      />

      {/* Seção de últimos clientes cadastrados */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Últimos Clientes Cadastrados</h2>
        <ClientsListTable
          clients={recentClients.map((client) => ({
            ...client,
            createdAt: new Date(client.created_at),
          }))}
          isLoading={isLoadingClients}
          onView={handleViewClient}
          onEdit={handleEditClient}
          onDelete={handleToggleClientStatus}
          onViewCases={handleViewCases}
          showRecentBadge={true}
        />
      </div>

      {/* Seção de todos os clientes (apenas quando pesquisando) */}
      {searchTerm && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold">Resultados da Pesquisa</h2>
          <ClientsListTable
            clients={filteredClients.map((client) => ({
              ...client,
              createdAt: new Date(client.created_at),
            }))}
            onView={handleViewClient}
            onEdit={handleEditClient}
            onDelete={handleToggleClientStatus}
            onViewCases={handleViewCases}
          />
        </div>
      )}

      {/* Modal de formulário de cliente */}
      <ClientFormModal
        open={isClientFormModalOpen}
        onClose={() => {
          setIsClientFormModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleClientFormSubmit}
        initialData={
          editingClient
            ? {
                nome: editingClient.nome,
                email: editingClient.email || "",
                telefone: editingClient.telefone || "",
                cpf_cnpj: editingClient.cpf_cnpj || "",
                endereco: editingClient.endereco || "",
              }
            : undefined
        }
        isEditing={!!editingClient}
        isLoading={false}
      />

      {/* Modal de visualização do cliente */}
      <ClientViewModal
        open={isClientViewModalOpen}
        onClose={() => {
          setIsClientViewModalOpen(false);
          setViewingClient(null);
        }}
        client={viewingClient}
        onEdit={() => {
          setIsClientViewModalOpen(false);
          setEditingClient(viewingClient);
          setIsClientFormModalOpen(true);
        }}
        onDelete={() => {
          setIsClientViewModalOpen(false);
          setClientToToggleStatus(viewingClient?.id || null);
        }}
      />

      {/* Dialog de confirmação de inativação/reativação */}
      <AlertDialog
        open={!!clientToToggleStatus}
        onOpenChange={() => setClientToToggleStatus(null)}
      >
        <AlertDialogContent data-testid="toggle-status-confirmation-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {clientToToggleStatus &&
              allClients.find((c) => c.id === clientToToggleStatus)?.status ===
                "inativo"
                ? "Reativar Cliente"
                : "Inativar Cliente"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {clientToToggleStatus &&
              allClients.find((c) => c.id === clientToToggleStatus)?.status ===
                "inativo"
                ? "Tem certeza que deseja reativar este cliente? Ele voltará a aparecer nas listagens."
                : "Tem certeza que deseja inativar este cliente? Ele não aparecerá mais nas listagens, mas os dados serão mantidos."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-toggle-status">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleClientStatus}
              data-testid="button-confirm-toggle-status"
              className={
                clientToToggleStatus &&
                allClients.find((c) => c.id === clientToToggleStatus)
                  ?.status === "inativo"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }
            >
              {clientToToggleStatus &&
              allClients.find((c) => c.id === clientToToggleStatus)?.status ===
                "inativo"
                ? "Reativar"
                : "Inativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
