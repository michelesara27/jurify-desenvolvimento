// client/src/components/PieceFormModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: string;
  nome: string;
}

interface PieceFormData {
  titulo: string;
  tipo: string;
  status: string;
  clienteId: string;
  conteudo: string;
  templateUsado: string;
}

interface PieceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PieceFormData) => Promise<void>;
  clientes: Cliente[];
  initialData?: Partial<PieceFormData>;
  isEditing?: boolean;
  isLoading?: boolean;
}

const TIPOS_PECA = [
  "Petição Inicial",
  "Contrato",
  "Recurso",
  "Parecer",
  "Consultoria",
  "Procuração",
  "Acordo",
];

const STATUS_PECA = ["Rascunho", "Finalizado", "Executivo", "Recursos"];

export function PieceFormModal({
  open,
  onClose,
  onSubmit,
  clientes,
  initialData,
  isEditing = false,
  isLoading = false,
}: PieceFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PieceFormData>({
    titulo: "",
    tipo: "",
    status: "Rascunho",
    clienteId: "",
    conteudo: "",
    templateUsado: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    } else {
      setFormData({
        titulo: "",
        tipo: "",
        status: "Rascunho",
        clienteId: "",
        conteudo: "",
        templateUsado: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.tipo || !formData.clienteId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
      toast({
        title: isEditing ? "Peça atualizada" : "Peça criada",
        description: isEditing
          ? "A peça jurídica foi atualizada com sucesso."
          : "A nova peça jurídica foi criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a peça. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: keyof PieceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-auto"
        data-testid="piece-form-modal"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Peça Jurídica" : "Nova Peça Jurídica"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => updateFormData("titulo", e.target.value)}
                placeholder="Ex: Petição Inicial - Rescisão Trabalhista"
                data-testid="input-titulo"
                required
              />
            </div>

            {/* Cliente */}
            <div>
              <Label htmlFor="cliente">Cliente *</Label>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => updateFormData("clienteId", value)}
              >
                <SelectTrigger data-testid="select-cliente">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div>
              <Label htmlFor="tipo">Tipo de Peça *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => updateFormData("tipo", value)}
              >
                <SelectTrigger data-testid="select-tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_PECA.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData("status", value)}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_PECA.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Usado */}
            <div>
              <Label htmlFor="template">Template Usado</Label>
              <Input
                id="template"
                value={formData.templateUsado}
                onChange={(e) =>
                  updateFormData("templateUsado", e.target.value)
                }
                placeholder="Ex: Template Trabalhista"
                data-testid="input-template"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <Label htmlFor="conteudo">Conteúdo da Peça</Label>
            <Textarea
              id="conteudo"
              value={formData.conteudo}
              onChange={(e) => updateFormData("conteudo", e.target.value)}
              placeholder="Digite o conteúdo da peça jurídica..."
              className="min-h-32"
              data-testid="textarea-conteudo"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="button-save"
            >
              {isLoading
                ? "Salvando..."
                : isEditing
                ? "Atualizar"
                : "Criar Peça"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
