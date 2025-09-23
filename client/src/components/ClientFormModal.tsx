// client/src/components/ClientFormModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface ClientFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  endereco: string;
}

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  initialData?: Partial<ClientFormData>;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function ClientFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isLoading = false,
}: ClientFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientFormData>({
    nome: "",
    email: "",
    telefone: "",
    cpf_cnpj: "",
    endereco: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        // Garantir que campos vazios sejam tratados como string vazia
        email: initialData.email || "",
        telefone: initialData.telefone || "",
        cpf_cnpj: initialData.cpf_cnpj || "",
        endereco: initialData.endereco || "",
      }));
    } else {
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf_cnpj: "",
        endereco: "",
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do cliente é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    // Validação de email se fornecido
    if (formData.email && !isValidEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação de telefone se fornecido
    if (formData.telefone && !isValidPhone(formData.telefone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um telefone válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação de CPF/CNPJ se fornecido
    if (formData.cpf_cnpj && !isValidCpfCnpj(formData.cpf_cnpj)) {
      toast({
        title: "CPF/CNPJ inválido",
        description: "Por favor, insira um CPF ou CNPJ válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
      toast({
        title: isEditing ? "Cliente atualizado" : "Cliente criado",
        description: isEditing
          ? "Os dados do cliente foram atualizados com sucesso."
          : "O novo cliente foi cadastrado com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro",
        description:
          error.message ||
          "Ocorreu um erro ao salvar o cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Funções de validação
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const isValidCpfCnpj = (cpfCnpj: string): boolean => {
    // Remove caracteres não numéricos
    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");

    // CPF (11 dígitos) ou CNPJ (14 dígitos)
    return cleanCpfCnpj.length === 11 || cleanCpfCnpj.length === 14;
  };

  // Funções de formatação
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      // Formato: (11) 99999-9999
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }

    return value;
  };

  const formatCpfCnpj = (value: string): string => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      // Formato CPF: 999.999.999-99
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else {
      // Formato CNPJ: 99.999.999/9999-99
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1"); // CORREÇÃO: Aspa dupla no final
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    updateFormData("telefone", formattedValue);
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCpfCnpj(e.target.value);
    updateFormData("cpf_cnpj", formattedValue);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-testid="client-form-modal">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do cliente abaixo."
              : "Preencha os dados do novo cliente abaixo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => updateFormData("nome", e.target.value)}
              placeholder="Ex: João Silva"
              data-testid="input-nome"
              required
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="Ex: joao@email.com"
              data-testid="input-email"
              disabled={isLoading}
            />
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={handlePhoneChange}
              placeholder="Ex: (11) 99999-9999"
              data-testid="input-telefone"
              disabled={isLoading}
              maxLength={15}
            />
          </div>

          {/* CPF/CNPJ */}
          <div>
            <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
            <Input
              id="cpf_cnpj"
              value={formData.cpf_cnpj}
              onChange={handleCpfCnpjChange}
              placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-90"
              data-testid="input-cpf-cnpj"
              disabled={isLoading}
              maxLength={18}
            />
          </div>

          {/* Endereço */}
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => updateFormData("endereco", e.target.value)}
              placeholder="Ex: Rua das Flores, 123 - Centro - São Paulo/SP"
              className="min-h-20"
              data-testid="textarea-endereco"
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel"
              disabled={isLoading}
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
                : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
