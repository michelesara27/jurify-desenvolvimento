import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  FileText,
  Clock
} from "lucide-react";

const documents = [
  {
    id: 1,
    title: "Petição Inicial - Ação Trabalhista",
    client: "Maria Santos",
    type: "Petição Inicial",
    category: "Trabalhista",
    status: "finalizado",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    wordCount: 2450,
    pages: 8,
  },
  {
    id: 2,
    title: "Contestação - Divórcio Consensual",
    client: "João Silva",
    type: "Contestação", 
    category: "Família",
    status: "rascunho",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-14",
    wordCount: 1820,
    pages: 6,
  },
  {
    id: 3,
    title: "Recurso de Apelação",
    client: "Ana Costa",
    type: "Recurso",
    category: "Cível",
    status: "enviado",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-13",
    wordCount: 3200,
    pages: 12,
  },
  {
    id: 4,
    title: "Contrato de Prestação de Serviços",
    client: "Carlos Oliveira",
    type: "Contrato",
    category: "Empresarial",
    status: "revisao",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-12",
    wordCount: 1950,
    pages: 7,
  },
  {
    id: 5,
    title: "Parecer Jurídico - Tributário",
    client: "Empresa XYZ",
    type: "Parecer",
    category: "Tributário",
    status: "finalizado",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-09",
    wordCount: 2800,
    pages: 10,
  },
];

const statusColors = {
  rascunho: "bg-muted text-muted-foreground",
  revisao: "bg-warning/10 text-warning",
  finalizado: "bg-success/10 text-success",
  enviado: "bg-primary/10 text-primary",
};

const categoryColors = {
  Trabalhista: "bg-chart-blue/10 text-chart-blue",
  Família: "bg-chart-green/10 text-chart-green",
  Cível: "bg-chart-orange/10 text-chart-orange",
  Empresarial: "bg-chart-purple/10 text-chart-purple",
  Tributário: "bg-chart-red/10 text-chart-red",
};

const MinhasPecas = () => {
  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Minhas Peças</h1>
            <p className="text-muted-foreground">Gerencie todos os documentos jurídicos criados com IA</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Peça Jurídica
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Peças</p>
                  <p className="text-xl font-bold">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Rascunho</p>
                  <p className="text-xl font-bold">
                    {documents.filter(d => d.status === 'rascunho').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <FileText className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Finalizados</p>
                  <p className="text-xl font-bold">
                    {documents.filter(d => d.status === 'finalizado').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-orange/10 rounded-lg">
                  <FileText className="h-5 w-5 text-chart-orange" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Páginas</p>
                  <p className="text-xl font-bold">
                    {documents.reduce((acc, d) => acc + d.pages, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar peças por título, cliente ou tipo..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Cliente: {doc.client}</span>
                        <span>•</span>
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.wordCount} palavras</span>
                        <span>•</span>
                        <span>{doc.pages} páginas</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className={categoryColors[doc.category as keyof typeof categoryColors]}
                      >
                        {doc.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={statusColors[doc.status as keyof typeof statusColors]}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Criado: {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Atualizado: {new Date(doc.updatedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MinhasPecas;
