import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hashPassword } from "@/lib/hash";
import { useAuth } from "@/hooks/use-auth";

const InviteRegister = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("company_invites")
        .select("id, company_id, role, status, expires_at")
        .eq("token", token)
        .maybeSingle();
      setLoading(false);
      if (error || !data) return;
      setInvite(data);
    };
    loadInvite();
  }, [token]);

  const canUseInvite = () => {
    if (!invite) return false;
    if (invite.status !== "pending") return false;
    const exp = new Date(invite.expires_at).getTime();
    return Date.now() < exp;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUseInvite()) {
      toast({ title: "Convite inválido ou expirado", variant: "destructive" });
      return;
    }
    const emailSanitized = email.trim().toLowerCase();
    if (!emailSanitized || !name || !password || password.length < 8) {
      toast({ title: "Preencha corretamente", description: "Informe nome, e-mail válido e senha com 8+ caracteres.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const password_hash = await hashPassword(password, emailSanitized);
    const { data: appUser, error: userError } = await supabase
      .from("app_users")
      .insert({ email: emailSanitized, password_hash, name })
      .select("id, email")
      .single();
    if (userError) {
      setSaving(false);
      toast({ title: "Erro ao criar usuário", description: userError.message, variant: "destructive" });
      return;
    }
    const { error: linkError } = await supabase
      .from("company_users")
      .insert({ user_id: appUser.id, company_id: invite.company_id, role: invite.role });
    if (linkError) {
      setSaving(false);
      toast({ title: "Erro ao vincular usuário", description: linkError.message, variant: "destructive" });
      return;
    }
    const { error: updError } = await supabase
      .from("company_invites")
      .update({ status: "accepted", accepted_by: appUser.id, accepted_at: new Date().toISOString() })
      .eq("id", invite.id);
    setSaving(false);
    if (updError) {
      toast({ title: "Convite não pôde ser marcado como utilizado", description: updError.message, variant: "destructive" });
      return;
    }
    toast({ title: "Cadastro concluído", description: "Bem-vindo à empresa." });
    await signIn(emailSanitized, password);
    navigate("/", { replace: true });
  };

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro por convite</CardTitle>
          <CardDescription>
            Preencha seu nome, e-mail e defina sua senha para ingressar na empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!canUseInvite() ? (
            <div className="space-y-4">
              <p className="text-sm text-destructive">Convite inválido ou expirado.</p>
              <Link to="/auth/login" className="text-sm text-primary hover:underline">Ir para login</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input id="full_name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@empresa.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Defina sua senha" />
              </div>
              <Button type="submit" disabled={saving}>{saving ? "Cadastrando..." : "Concluir cadastro"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteRegister;
