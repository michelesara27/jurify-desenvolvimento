import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRegisterCompany } from "@/hooks/use-company-membership";
import { isValidCNPJ, formatCNPJ } from "@/lib/validate-cnpj";

const passwordSchema = z
  .string()
  .min(8, "Mínimo de 8 caracteres")
  .refine((val) => /[A-Z]/.test(val), "Ao menos 1 maiúscula")
  .refine((val) => /[a-z]/.test(val), "Ao menos 1 minúscula")
  .refine((val) => /\d/.test(val), "Ao menos 1 número")
  .refine((val) => /[^A-Za-z0-9]/.test(val), "Ao menos 1 símbolo");

const emailSchema = z
  .string()
  .trim()
  .email("E-mail inválido");

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const registerCompany = useRegisterCompany();

  const [form, setForm] = useState({
    fantasia: "",
    corporateEmail: "",
    phone: "",
    cnpj: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    cidade: "",
    estado: "",
    password: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fantasia || !form.corporateEmail || !form.phone || !form.cnpj || !form.logradouro || !form.numero || !form.bairro || !form.cep || !form.cidade || !form.estado || !form.password) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }

    if (!isValidCNPJ(form.cnpj)) {
      toast({ title: "CNPJ inválido", description: "Verifique o número do CNPJ informado.", variant: "destructive" });
      return;
    }

    const emailCheck = emailSchema.safeParse(form.corporateEmail);
    if (!emailCheck.success) {
      toast({ title: "E-mail inválido", description: "Informe um e-mail corporativo válido.", variant: "destructive" });
      return;
    }

    const passCheck = passwordSchema.safeParse(form.password);
    if (!passCheck.success) {
      toast({ title: "Senha fraca", description: passCheck.error.errors.map((e) => e.message).join(", "), variant: "destructive" });
      return;
    }

    const address = `${form.logradouro}, ${form.numero}${form.complemento ? `, ${form.complemento}` : ""}, ${form.bairro}`;

    try {
      await registerCompany.mutateAsync({
        company: {
          name: form.fantasia,
          email: form.corporateEmail,
          phone: form.phone,
          cnpj: form.cnpj,
          address,
          city: form.cidade,
          state: form.estado,
          zip_code: form.cep,
        },
        credentials: {
          email: form.corporateEmail.trim().toLowerCase(),
          password: form.password,
        },
      });

      toast({ title: "Empresa cadastrada", description: "Aguarde ativação para acessar o sistema." });
      navigate("/auth/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao concluir cadastro";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-2xl bg-background border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Cadastro de Empresa</h1>
        <p className="text-sm text-muted-foreground mb-6">Preencha os dados para criar sua empresa e o primeiro administrador.</p>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm">Nome Fantasia</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.fantasia} onChange={(e) => update("fantasia", e.target.value)} placeholder="Ex.: Jurify Tech" />
          </div>
          <div>
            <label className="text-sm">E-mail corporativo</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="email" value={form.corporateEmail} onChange={(e) => update("corporateEmail", e.target.value)} placeholder="nome@empresa.com" />
          </div>
          <div>
            <label className="text-sm">Telefone</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="text-sm">CNPJ</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.cnpj} onChange={(e) => update("cnpj", formatCNPJ(e.target.value))} placeholder="00.000.000/0000-00" />
          </div>
          <div>
            <label className="text-sm">CEP</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.cep} onChange={(e) => update("cep", e.target.value)} placeholder="00000-000" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Logradouro</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.logradouro} onChange={(e) => update("logradouro", e.target.value)} placeholder="Rua, Avenida..." />
          </div>
          <div>
            <label className="text-sm">Número</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.numero} onChange={(e) => update("numero", e.target.value)} placeholder="123" />
          </div>
          <div>
            <label className="text-sm">Complemento</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.complemento} onChange={(e) => update("complemento", e.target.value)} placeholder="Sala, Bloco..." />
          </div>
          <div>
            <label className="text-sm">Bairro</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.bairro} onChange={(e) => update("bairro", e.target.value)} placeholder="Centro" />
          </div>
          <div>
            <label className="text-sm">Cidade</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.cidade} onChange={(e) => update("cidade", e.target.value)} placeholder="São Paulo" />
          </div>
          <div>
            <label className="text-sm">Estado</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.estado} onChange={(e) => update("estado", e.target.value)} placeholder="SP" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Senha de acesso</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Senha segura" />
            <p className="text-xs text-muted-foreground mt-1">Mínimo de 8 caracteres, contendo maiúscula, minúscula, número e símbolo.</p>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/auth/login")}>Já tenho conta</Button>
            <Button type="submit">Cadastrar Empresa</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
