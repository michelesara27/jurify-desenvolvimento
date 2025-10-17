// src/pages/Configuracoes.tsx
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Bell,
  Shield,
  Bot,
  Moon,
  Sun,
  Globe,
  Lock,
  Eye,
  Trash2,
  Download,
  Upload,
  UserPlus,
  Copy,
  Link as LinkIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompanyMembership } from "@/hooks/use-company-membership";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { verifyPassword, hashPassword } from "@/lib/hash";

const Configuracoes = () => {
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da plataforma
          </p>
        </div>

        {/* Perfil da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil da Empresa
            </CardTitle>
            <CardDescription>
              Área dedicada para edição das informações da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CompanyProfileForm />
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Informações pessoais e configurações da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  DR
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Alterar foto
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" placeholder="Seu nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oab">OAB</Label>
                <Input id="oab" placeholder="OAB/SP 123456" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Especialidades</Label>
              <Textarea
                id="bio"
                placeholder="Descreva suas áreas de especialização jurídica..."
                className="min-h-[80px]"
              />
            </div>

            <Button>Salvar alterações</Button>
          </CardContent>
        </Card>

        {/* Colaboradores / Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Colaboradores / Usuários
            </CardTitle>
            <CardDescription>
              Gerencie o time vinculado à empresa e convide novos colaboradores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CompanyUsersSection />
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Configurações de IA
            </CardTitle>
            <CardDescription>
              Personalize o comportamento da inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Modelo de IA preferido</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha o modelo para geração de documentos
                  </p>
                </div>
                <Select defaultValue="gpt-4">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Geração automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite sugestões automáticas durante a escrita
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Revisão inteligente</Label>
                  <p className="text-sm text-muted-foreground">
                    Analisa documentos em busca de inconsistências
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sugestões de melhoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Recebe sugestões para melhorar os documentos
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Aparência e idioma
            </CardTitle>
            <CardDescription>
              Personalize a interface da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre modo claro ou escuro
                  </p>
                </div>
                <Select defaultValue="system">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Escuro
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Sistema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Idioma da interface
                  </p>
                </div>
                <Select defaultValue="pt-br">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-br">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Português (BR)
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações por e-mail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Documentos gerados</Label>
                  <p className="text-sm text-muted-foreground">
                    Quando um documento for gerado com sucesso
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Lembretes de prazo</Label>
                  <p className="text-sm text-muted-foreground">
                    Sobre prazos importantes dos casos
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Atualizações do sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Novas funcionalidades e melhorias
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança e privacidade
            </CardTitle>
            <CardDescription>
              Configurações de segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SecuritySection />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;

// Formulário de Perfil da Empresa
function CompanyProfileForm() {
  const { toast } = useToast();
  const { data: membership } = useCompanyMembership();
  const isAdmin = membership?.role === "admin";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const c = membership?.company;
    if (!c) return;
    setName(c.name || "");
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setCnpj(c.cnpj || "");
    setAddress(c.address || "");
    setCity(c.city || "");
    setState(c.state || "");
    setZip(c.zip_code || "");
  }, [membership]);

  const onSave = async () => {
    if (!membership?.company?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from("companies")
      .update({
        name,
        email,
        phone,
        cnpj,
        address,
        city,
        state,
        zip_code: zip,
      })
      .eq("id", membership.company.id);
    setSaving(false);
    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Dados atualizados", description: "Informações da empresa salvas com sucesso." });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="empresa_nome">Razão social / Nome fantasia</Label>
          <Input id="empresa_nome" value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} placeholder="Nome da empresa" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa_email">E-mail</Label>
          <Input id="empresa_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isAdmin} placeholder="contato@empresa.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa_telefone">Telefone</Label>
          <Input id="empresa_telefone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isAdmin} placeholder="(11) 99999-9999" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa_cnpj">CNPJ</Label>
          <Input id="empresa_cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} disabled={!isAdmin} placeholder="00.000.000/0000-00" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="empresa_endereco">Endereço</Label>
          <Input id="empresa_endereco" value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isAdmin} placeholder="Logradouro, número, complemento, bairro" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa_cep">CEP</Label>
          <Input id="empresa_cep" value={zip} onChange={(e) => setZip(e.target.value)} disabled={!isAdmin} placeholder="00000-000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa_cidade">Cidade</Label>
          <Input id="empresa_cidade" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isAdmin} placeholder="Cidade" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa_estado">Estado</Label>
          <Input id="empresa_estado" value={state} onChange={(e) => setState(e.target.value)} disabled={!isAdmin} placeholder="UF" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {membership?.role ? (
            <span>
              Perfil atual: <Badge variant="secondary">{membership.role}</Badge>
            </span>
          ) : (
            <span>Carregando perfil...</span>
          )}
        </div>
        <Button onClick={onSave} disabled={!isAdmin || saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}

// Seção de colaboradores vinculados à empresa e geração de link mágico
function CompanyUsersSection() {
  const { toast } = useToast();
  const { data: membership } = useCompanyMembership();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; role: string; email: string; name: string | null; is_active: boolean }>>([]);
  const [inviteRole, setInviteRole] = useState<"member" | "manager" | "admin">("member");
  const [inviteLink, setInviteLink] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!membership?.company?.id) return;
      setLoading(true);
      const { data: companyUsers, error } = await supabase
        .from("company_users")
        .select("id, user_id, role")
        .eq("company_id", membership.company.id);
      if (error) {
        setLoading(false);
        return;
      }
      const userIds = (companyUsers || []).map((u: any) => u.user_id);
      if (userIds.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      const { data: appUsers, error: usersError } = await supabase
        .from("app_users")
        .select("id, email, name, is_active")
        .in("id", userIds);
      setLoading(false);
      if (usersError) return;
      const byId: Record<string, any> = {};
      for (const au of appUsers || []) byId[au.id] = au;
      const merged = (companyUsers || []).map((cu: any) => ({
        id: cu.id,
        role: cu.role,
        email: byId[cu.user_id]?.email ?? "",
        name: byId[cu.user_id]?.name ?? null,
        is_active: !!byId[cu.user_id]?.is_active,
      }));
      setUsers(merged);
    };
    fetchUsers();
  }, [membership]);

  const generateToken = () => {
    // Random token: UUID + short random suffix
    const base = crypto.randomUUID();
    const extra = Math.random().toString(36).slice(2, 10);
    return `${base}-${extra}`;
  };

  const onGenerateInvite = async () => {
    if (!membership?.company?.id) return;
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("company_invites")
      .insert({
        token,
        company_id: membership.company.id,
        role: inviteRole,
        expires_at: expiresAt,
        status: "pending",
        created_by: user?.id ?? null,
      })
      .select("token")
      .single();
    if (error) {
      toast({ title: "Erro ao gerar convite", description: error.message, variant: "destructive" });
      return;
    }
    const link = `${window.location.origin}/auth/invite-register?token=${data.token}`;
    setInviteLink(link);
    toast({ title: "Convite gerado", description: "Compartilhe o link com o colaborador." });
  };

  const onCopyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    toast({ title: "Link copiado", description: "Link mágico copiado para a área de transferência." });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Equipe vinculada</Label>
        <div className="space-y-2">
          {loading && <div className="text-sm text-muted-foreground">Carregando colaboradores...</div>}
          {!loading && users.length === 0 && (
            <div className="text-sm text-muted-foreground">Nenhum colaborador vinculado ainda.</div>
          )}
          {!loading && users.length > 0 && (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{u.name || u.email}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{u.role}</Badge>
                    <Badge variant={u.is_active ? "outline" : "destructive"}>{u.is_active ? "Ativo" : "Inativo"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Gerar link mágico para novo colaborador</Label>
        <div className="flex items-center gap-3">
          <Select value={inviteRole} onValueChange={(val) => setInviteRole(val as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Membro</SelectItem>
              <SelectItem value="manager">Gestor</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onGenerateInvite}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Gerar link mágico
          </Button>
        </div>
        {inviteLink && (
          <div className="flex items-center gap-2">
            <Input readOnly value={inviteLink} />
            <Button variant="secondary" onClick={onCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Seção de segurança com alteração de senha
function SecuritySection() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const passwordStrongEnough = (pwd: string) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd);
  };

  const onChangePassword = async () => {
    if (!user?.id) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Confirmação incorreta", description: "A nova senha e a confirmação devem ser iguais.", variant: "destructive" });
      return;
    }
    if (!passwordStrongEnough(newPassword)) {
      toast({ title: "Senha fraca", description: "Use ao menos 8 caracteres, com letras maiúsculas, minúsculas e números.", variant: "destructive" });
      return;
    }
    setChanging(true);
    const { data: appUser, error } = await supabase
      .from("app_users")
      .select("id, email, password_hash")
      .eq("id", user.id)
      .maybeSingle();
    if (error || !appUser) {
      setChanging(false);
      toast({ title: "Erro ao validar usuário", description: error?.message, variant: "destructive" });
      return;
    }
    const emailSanitized = (appUser as any).email?.trim().toLowerCase();
    const ok = await verifyPassword(currentPassword, emailSanitized, (appUser as any).password_hash);
    if (!ok) {
      setChanging(false);
      toast({ title: "Senha atual incorreta", variant: "destructive" });
      return;
    }
    const newHash = await hashPassword(newPassword, emailSanitized);
    const { error: updateError } = await supabase
      .from("app_users")
      .update({ password_hash: newHash })
      .eq("id", user.id);
    setChanging(false);
    if (updateError) {
      toast({ title: "Erro ao alterar senha", description: updateError.message, variant: "destructive" });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "Senha alterada", description: "Sua senha foi atualizada com sucesso." });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Alterar senha</Label>
          <div className="space-y-2">
            <Input type="password" placeholder="Senha atual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <Input type="password" placeholder="Nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input type="password" placeholder="Confirmar nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button variant="outline" onClick={onChangePassword} disabled={changing}>
            <Lock className="h-4 w-4 mr-2" />
            {changing ? "Alterando..." : "Alterar senha"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-destructive">Zona de perigo</Label>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar dados
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir conta
          </Button>
        </div>
      </div>
    </div>
  );
}
