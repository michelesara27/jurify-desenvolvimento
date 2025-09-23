// client/src/components/RecentPiecesTable.tsx
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
import { Eye, Edit, Trash2 } from "lucide-react";

interface PieceData {
  id: string;
  cliente: string;
  tipo: string;
  status: "Finalizado" | "Executivo" | "Recursos";
  acao: string;
}

interface RecentPiecesTableProps {
  pieces: PieceData[];
}

const statusColors = {
  Finalizado:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Executivo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Recursos:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

export function RecentPiecesTable({ pieces }: RecentPiecesTableProps) {
  const handleAction = (action: string, pieceId: string) => {
    console.log(`${action} acionado para peça: ${pieceId}`);
  };

  return (
    <Card data-testid="recent-pieces-table">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Últimas Peças Geradas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pieces.map((piece) => (
              <TableRow key={piece.id} data-testid={`piece-row-${piece.id}`}>
                <TableCell className="font-medium">{piece.cliente}</TableCell>
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
                <TableCell>{piece.acao}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAction("Ver", piece.id)}
                      data-testid={`button-view-${piece.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAction("Editar", piece.id)}
                      data-testid={`button-edit-${piece.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAction("Excluir", piece.id)}
                      data-testid={`button-delete-${piece.id}`}
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
