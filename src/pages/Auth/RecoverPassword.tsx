import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const RecoverPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Fluxo de recuperação de senha não implementado para autenticação custom.
    // Em produção, implemente geração de token, e-mail e redefinição via tabela própria.
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Recuperação não disponível", description: "Com autenticação custom, a recuperação deve ser implementada via token e e-mail próprio.", variant: "destructive" });
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md bg-background border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground mb-6">Informe seu e-mail cadastrado para receber o link de recuperação.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">E-mail</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@empresa.com" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar link"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;
