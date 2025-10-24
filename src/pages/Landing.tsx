import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, Users, Shield, Rocket, Sparkles } from "lucide-react";

const features = [
  {
    icon: Scale,
    title: "Automação Jurídica Inteligente",
    desc: "Gere peças com precisão usando modelos e variáveis dinâmicas.",
    benefit: "Economiza tempo e padroniza a qualidade.",
  },
  {
    icon: FileText,
    title: "Modelos e Templates",
    desc: "Biblioteca centralizada com organização por tipo de documento.",
    benefit: "Acelera a produção e garante consistência.",
  },
  {
    icon: Users,
    title: "Colaboração em Equipe",
    desc: "Convites, papéis e permissões para trabalho coordenado.",
    benefit: "Melhora a visibilidade e controle do time.",
  },
  {
    icon: Shield,
    title: "Segurança e Governança",
    desc: "Controles de acesso e política de ativação de empresas.",
    benefit: "Protege dados e mantém conformidade.",
  },
  {
    icon: Rocket,
    title: "Fluxos Otimizados",
    desc: "Histórico de gerações, reuso e acompanhamento de produtividade.",
    benefit: "Aumenta eficiência e reduz retrabalho.",
  },
  {
    icon: Sparkles,
    title: "Experiência Fluida",
    desc: "Interface moderna com microinterações e feedback instantâneo.",
    benefit: "Torna o uso simples e agradável.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Scale className="h-6 w-6 text-primary transition-transform group-hover:scale-105" />
            <span className="font-semibold tracking-tight">Jurify</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm hover:text-primary transition-colors">Login</Link>
            <Button onClick={handleCTA} className="bg-primary hover:bg-primary-hover text-primary-foreground">Começar a usar</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-3" variant="secondary">Sistema de Automação Jurídica</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Produza peças jurídicas com velocidade, precisão e controle
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Centralize modelos, colabore com sua equipe e garanta qualidade em cada entrega.
              Jurify guia sua prática com fluxos claros e segurança integrada.
            </p>
            <div className="mt-6 flex gap-3">
              <Button size="lg" onClick={handleCTA} className="bg-primary hover:bg-primary-hover text-primary-foreground transition-transform hover:translate-y-0.5">
                Começar a usar
              </Button>
              <Link to="#features" className="text-sm md:text-base text-primary hover:underline">Ver funcionalidades</Link>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ao clicar, você irá para a página de login. Após autenticação, acesse o dashboard e comece a gerar documentos.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Scale className="h-12 w-12 text-primary" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Interface moderna e responsiva, pronta para equipes jurídicas que buscam produtividade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Principais funcionalidades</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 text-primary p-2">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Benefício: <span className="font-medium text-foreground/90">{f.benefit}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl border bg-card p-8 md:p-10 shadow-sm">
          <div className="md:flex items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">Pronto para elevar sua operação jurídica?</h3>
              <p className="text-muted-foreground mt-2">
                Clique abaixo para iniciar. Você fará login e, se necessário, poderá criar ou ativar sua empresa.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <Button size="lg" onClick={handleCTA} className="bg-primary hover:bg-primary-hover text-primary-foreground transition-transform hover:scale-[1.02]">
                Começar a usar
              </Button>
              <Link to="/auth/login" className="text-sm text-primary hover:underline">Ir para Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-semibold">Jurify</span>
            </div>
            <p className="text-muted-foreground mt-2">Automação jurídica com foco em performance e segurança.</p>
          </div>
          <div>
            <h4 className="font-medium">Contato</h4>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>Email: jurify@kafuryprogramador.com.br</li>
              <li>Suporte Whatsapp: 67 981026261</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Links úteis</h4>
            <ul className="mt-2 space-y-1">
              <li><Link to="#" className="text-primary hover:underline">Documentação</Link></li>
              <li><Link to="#" className="text-primary hover:underline">Política de Privacidade</Link></li>
              <li><Link to="#" className="text-primary hover:underline">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground">© {new Date().getFullYear()} Jurify. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
};

export default Landing;
