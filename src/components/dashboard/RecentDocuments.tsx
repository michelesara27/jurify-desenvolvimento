// src/components/clients/RecentDocuments.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

const documents = [
  {
    id: 1,
    client: "Maria Santos",
    type: "Petição Inicial",
    status: "finalizado",
    statusColor: "success" as const,
  },
  {
    id: 2,
    client: "João Silva",
    type: "Contestação",
    status: "rascunho",
    statusColor: "warning" as const,
  },
  {
    id: 3,
    client: "Ana Costa",
    type: "Recurso",
    status: "enviado",
    statusColor: "blue" as const,
  },
];

const statusVariants = {
  success: "bg-success/10 text-success hover:bg-success/20",
  warning: "bg-warning/10 text-warning hover:bg-warning/20",
  blue: "bg-primary/10 text-primary hover:bg-primary/20",
};

export const RecentDocuments = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Últimas Peças Geradas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 pb-2 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-3">CLIENTE</div>
            <div className="col-span-3">TIPO</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-4">AÇÕES</div>
          </div>

          {/* Table Rows */}
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-12 gap-4 py-3 items-center"
            >
              <div className="col-span-3 font-medium text-foreground">
                {doc.client}
              </div>
              <div className="col-span-3 text-muted-foreground">{doc.type}</div>
              <div className="col-span-2">
                <Badge
                  variant="secondary"
                  className={statusVariants[doc.statusColor]}
                >
                  {doc.status}
                </Badge>
              </div>
              <div className="col-span-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary-hover"
                >
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80"
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
