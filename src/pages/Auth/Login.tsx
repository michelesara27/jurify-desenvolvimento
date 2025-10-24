import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Falha no login", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Bem-vindo", description: "Login realizado com sucesso." });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md bg-background border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Acesso</h1>
        <p className="text-sm text-muted-foreground mb-6">Entre com seu e-mail e senha.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">E-mail</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@empresa.com" />
          </div>
          <div>
            <label className="text-sm">Senha</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
          </div>
          <div className="flex justify-between items-center">
            <Link to="/auth/recover-password" className="text-sm text-primary hover:underline">Esqueci minha senha</Link>
            <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Acessar"}</Button>
          </div>
        </form>
        <div className="mt-6 text-sm">
          <span className="text-muted-foreground">Não possui conta?</span>{" "}
          <Link to="/auth/register-company" className="text-primary hover:underline">Cadastre sua empresa</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
