// client/src/components/ClientViewModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, FileText, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Client {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf_cnpj: string | null;
  endereco: string | null;
  created_at: string;
  status?: string;
}

interface ClientViewModalProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientViewModal({
  open,
  onClose,
  client,
  onEdit,
  onDelete,
}: ClientViewModalProps) {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações completas do cliente {client.nome}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Informações Pessoais</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nome Completo
                  </label>
                  <p className="text-sm">{client.nome}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    CPF/CNPJ
                  </label>
                  <p className="text-sm">
                    {client.cpf_cnpj || "Não informado"}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "inativo"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300"
                    }`}
                  >
                    {client.status === "inativo" ? "Inativo" : "Ativo"}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Data de Cadastro
                  </label>
                  <p className="text-sm">
                    {format(
                      new Date(client.created_at),
                      "dd/MM/yyyy 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Contato</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <p className="text-sm">{client.email || "Não informado"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefone
                  </label>
                  <p className="text-sm">
                    {client.telefone || "Não informado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-full dark:bg-orange-900/20">
                  <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold">Endereço</h3>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Endereço Completo
                </label>
                <p className="text-sm">{client.endereco || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Editar Cliente
          </Button>
          <Button
            variant={client.status === "inativo" ? "default" : "destructive"}
            onClick={onDelete}
          >
            {client.status === "inativo"
              ? "Reativar Cliente"
              : "Inativar Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
