import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Upload
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Autenticação de dois fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Adiciona uma camada extra de segurança
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Inativo</Badge>
                  <Button variant="outline" size="sm">
                    Ativar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Alterar senha</Label>
                <div className="space-y-2">
                  <Input type="password" placeholder="Senha atual" />
                  <Input type="password" placeholder="Nova senha" />
                  <Input type="password" placeholder="Confirmar nova senha" />
                </div>
                <Button variant="outline">
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar senha
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Sessões ativas</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Sessão atual</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome - São Paulo, Brasil
                      </p>
                    </div>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
