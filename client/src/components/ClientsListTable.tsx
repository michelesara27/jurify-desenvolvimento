// client/src/components/CkientsListTable.tsx
// client/src/components/ClientsListTable.tsx (atualizado)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Users, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientListItem {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpfCnpj: string | null;
  endereco: string | null;
  createdAt: Date;
}

interface ClientsListTableProps {
  clients: ClientListItem[];
  isLoading?: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewCases: (id: string) => void;
  showRecentBadge?: boolean; // Nova prop para mostrar badge de "Recente"
}

export function ClientsListTable({
  clients,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onViewCases,
  showRecentBadge = false,
}: ClientsListTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Carregando clientes...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-2">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground">
              Comece adicionando seu primeiro cliente.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="clients-list-table">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {showRecentBadge
            ? "Últimos Clientes Cadastrados"
            : `Clientes (${clients.length})`}
          {showRecentBadge && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Últimos 6
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Cadastrado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} data-testid={`client-row-${client.id}`}>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate" title={client.nome}>
                    {client.nome}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.email || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.telefone || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {client.cpfCnpj || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(client.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onViewCases(client.id)}
                      data-testid={`button-cases-${client.id}`}
                      title="Ver casos do cliente"
                    >
                      <Briefcase className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onView(client.id)}
                      data-testid={`button-view-${client.id}`}
                      title="Visualizar cliente"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(client.id)}
                      data-testid={`button-edit-${client.id}`}
                      title="Editar cliente"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(client.id)}
                      data-testid={`button-delete-${client.id}`}
                      title="Excluir cliente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
