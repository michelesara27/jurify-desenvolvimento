// client/src/components/PiecesListTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PieceListItem {
  id: string;
  titulo: string;
  tipo: string;
  status: "Finalizado" | "Executivo" | "Recursos" | "Rascunho";
  clienteNome: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PiecesListTableProps {
  pieces: PieceListItem[];
  isLoading?: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  Finalizado:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Executivo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Recursos:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Rascunho: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function PiecesListTable({
  pieces,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: PiecesListTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">
              Carregando peças jurídicas...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pieces.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-2">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Nenhuma peça encontrada</h3>
            <p className="text-muted-foreground">
              Comece criando sua primeira peça jurídica.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="pieces-list-table">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Minhas Peças Jurídicas ({pieces.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pieces.map((piece) => (
              <TableRow key={piece.id} data-testid={`piece-row-${piece.id}`}>
                <TableCell className="font-medium max-w-xs">
                  <div className="truncate" title={piece.titulo}>
                    {piece.titulo}
                  </div>
                </TableCell>
                <TableCell>{piece.clienteNome}</TableCell>
                <TableCell>{piece.tipo}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[piece.status]}
                    data-testid={`status-${piece.status.toLowerCase()}`}
                  >
                    {piece.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(piece.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onView(piece.id)}
                      data-testid={`button-view-${piece.id}`}
                      title="Visualizar peça"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(piece.id)}
                      data-testid={`button-edit-${piece.id}`}
                      title="Editar peça"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(piece.id)}
                      data-testid={`button-delete-${piece.id}`}
                      title="Excluir peça"
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
