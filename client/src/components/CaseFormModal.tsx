// client/src/components/CaseFormModal.tsx
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

interface CaseFormData {
  clienteId: string;
  numeroProcesso: string;
  tipoCaso: string;
  status: string;
  assunto: string;
  valorCausa: string;
  tribunal: string;
  observacoes: string;
  dataInicio: string;
  dataFim: string;
}

interface CaseFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CaseFormData) => Promise<void>;
  clienteId: string;
  clienteName: string;
  initialData?: Partial<CaseFormData>;
  isEditing?: boolean;
  isLoading?: boolean;
}

const TIPOS_CASO = [
  "Trabalhista",
  "Civil",
  "Criminal",
  "Previdenciário",
  "Tributário",
  "Empresarial",
  "Família",
  "Consumidor",
  "Administrativo",
];

const STATUS_CASO = ["Ativo", "Finalizado", "Suspenso", "Arquivado"];

export function CaseFormModal({
  open,
  onClose,
  onSubmit,
  clienteId,
  clienteName,
  initialData,
  isEditing = false,
  isLoading = false,
}: CaseFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CaseFormData>({
    clienteId: clienteId,
    numeroProcesso: "",
    tipoCaso: "",
    status: "Ativo",
    assunto: "",
    valorCausa: "",
    tribunal: "",
    observacoes: "",
    dataInicio: new Date().toISOString().split("T")[0],
    dataFim: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        clienteId: clienteId,
        dataInicio: initialData.dataInicio
          ? new Date(initialData.dataInicio).toISOString().split("T")[0]
          : prev.dataInicio,
        dataFim: initialData.dataFim
          ? new Date(initialData.dataFim).toISOString().split("T")[0]
          : "",
      }));
    } else {
      setFormData({
        clienteId: clienteId,
        numeroProcesso: "",
        tipoCaso: "",
        status: "Ativo",
        assunto: "",
        valorCausa: "",
        tribunal: "",
        observacoes: "",
        dataInicio: new Date().toISOString().split("T")[0],
        dataFim: "",
      });
    }
  }, [initialData, open, clienteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipoCaso || !formData.assunto) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha tipo do caso e assunto.",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        dataInicio: formData.dataInicio
          ? new Date(formData.dataInicio).toISOString()
          : new Date().toISOString(),
        dataFim: formData.dataFim
          ? new Date(formData.dataFim).toISOString()
          : "",
      };

      await onSubmit(submitData);
      onClose();
      toast({
        title: isEditing ? "Caso atualizado" : "Caso criado",
        description: isEditing
          ? "O caso foi atualizado com sucesso."
          : "O novo caso foi criado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o caso. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: keyof CaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-auto"
        data-testid="case-form-modal"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Caso" : "Novo Caso"} - {clienteName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número do Processo */}
            <div>
              <Label htmlFor="numeroProcesso">Número do Processo</Label>
              <Input
                id="numeroProcesso"
                value={formData.numeroProcesso}
                onChange={(e) =>
                  updateFormData("numeroProcesso", e.target.value)
                }
                placeholder="Ex: 0001234-56.2024.5.02.0001"
                data-testid="input-numero-processo"
              />
            </div>

            {/* Tipo do Caso */}
            <div>
              <Label htmlFor="tipoCaso">Tipo do Caso *</Label>
              <Select
                value={formData.tipoCaso}
                onValueChange={(value) => updateFormData("tipoCaso", value)}
              >
                <SelectTrigger data-testid="select-tipo-caso">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_CASO.map((tipo) => (
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
                  {STATUS_CASO.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tribunal */}
            <div>
              <Label htmlFor="tribunal">Tribunal/Vara</Label>
              <Input
                id="tribunal"
                value={formData.tribunal}
                onChange={(e) => updateFormData("tribunal", e.target.value)}
                placeholder="Ex: TRT 2ª Região"
                data-testid="input-tribunal"
              />
            </div>

            {/* Valor da Causa */}
            <div>
              <Label htmlFor="valorCausa">Valor da Causa</Label>
              <Input
                id="valorCausa"
                value={formData.valorCausa}
                onChange={(e) => updateFormData("valorCausa", e.target.value)}
                placeholder="Ex: R$ 50.000,00"
                data-testid="input-valor-causa"
              />
            </div>

            {/* Data de Início */}
            <div>
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => updateFormData("dataInicio", e.target.value)}
                data-testid="input-data-inicio"
              />
            </div>

            {/* Data de Fim (opcional) */}
            <div>
              <Label htmlFor="dataFim">Data de Finalização</Label>
              <Input
                id="dataFim"
                type="date"
                value={formData.dataFim}
                onChange={(e) => updateFormData("dataFim", e.target.value)}
                data-testid="input-data-fim"
              />
            </div>
          </div>

          {/* Assunto */}
          <div>
            <Label htmlFor="assunto">Assunto *</Label>
            <Input
              id="assunto"
              value={formData.assunto}
              onChange={(e) => updateFormData("assunto", e.target.value)}
              placeholder="Ex: Rescisão Indireta por Assédio Moral"
              data-testid="input-assunto"
              required
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => updateFormData("observacoes", e.target.value)}
              placeholder="Observações adicionais sobre o caso..."
              className="min-h-24"
              data-testid="textarea-observacoes"
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
                : "Criar Caso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
