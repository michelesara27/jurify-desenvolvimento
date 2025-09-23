// client/src/components/CasesListTable.tsx
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
import { Eye, Edit, Trash2, Briefcase, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CaseListItem {
  id: string;
  numeroProcesso: string | null;
  tipoCaso: string;
  status: "Ativo" | "Finalizado" | "Suspenso" | "Arquivado";
  assunto: string;
  valorCausa: string | null;
  tribunal: string | null;
  dataInicio: Date;
  dataFim: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CasesListTableProps {
  cases: CaseListItem[];
  clientName: string;
  isLoading?: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onNewCase: () => void;
  onBack: () => void;
}

const statusColors = {
  Ativo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Finalizado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Suspenso:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Arquivado: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function CasesListTable({
  cases,
  clientName,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onNewCase,
  onBack,
}: CasesListTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Carregando casos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="cases-list-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back-to-clients"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Casos de {clientName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {cases.length}{" "}
                {cases.length === 1 ? "caso encontrado" : "casos encontrados"}
              </p>
            </div>
          </div>
          <Button onClick={onNewCase} data-testid="button-new-case">
            <Briefcase className="h-4 w-4 mr-2" />
            Novo Caso
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Nenhum caso encontrado</h3>
            <p className="text-muted-foreground">
              Este cliente ainda não possui casos cadastrados.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor da Causa</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caso) => (
                <TableRow key={caso.id} data-testid={`case-row-${caso.id}`}>
                  <TableCell className="font-mono text-sm">
                    {caso.numeroProcesso || "-"}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate" title={caso.assunto}>
                      {caso.assunto}
                    </div>
                  </TableCell>
                  <TableCell>{caso.tipoCaso}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[caso.status]}
                      data-testid={`status-${caso.status.toLowerCase()}`}
                    >
                      {caso.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {caso.valorCausa || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(caso.dataInicio), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onView(caso.id)}
                        data-testid={`button-view-${caso.id}`}
                        title="Visualizar caso"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(caso.id)}
                        data-testid={`button-edit-${caso.id}`}
                        title="Editar caso"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(caso.id)}
                        data-testid={`button-delete-${caso.id}`}
                        title="Excluir caso"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
