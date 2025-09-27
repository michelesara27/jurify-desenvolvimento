import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Copy, 
  FileText,
  Crown
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentTemplate {
  id: string;
  name: string;
  description: string | null;
  document_type: string;
  is_system_template: boolean;
  created_at: string;
  updated_at: string;
}

const documentTypeLabels: Record<string, string> = {
  'petition': 'Petição',
  'contract': 'Contrato',
  'appeal': 'Recurso',
  'motion': 'Moção',
  'brief': 'Memorial',
  'complaint': 'Denúncia',
  'response': 'Contestação'
};

const statusVariants: Record<string, string> = {
  system: "bg-blue-500/10 text-blue-700 border-blue-200",
  user: "bg-green-500/10 text-green-700 border-green-200"
};

export default function ModelosTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedType, selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(template => template.document_type === selectedType);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(template => 
        selectedCategory === "system" ? template.is_system_template : !template.is_system_template
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleDuplicate = async (templateId: string) => {
    // Implementar lógica de duplicação
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A duplicação de templates será implementada em breve.",
    });
  };

  const handleEdit = (templateId: string) => {
    // Implementar navegação para edição
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de templates será implementada em breve.",
    });
  };

  const handleView = (templateId: string) => {
    // Implementar visualização
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A visualização de templates será implementada em breve.",
    });
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Modelos e Templates</h1>
            <p className="text-muted-foreground">
              Gerencie seus templates de documentos jurídicos
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Template
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates do Sistema</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter(t => t.is_system_template).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Templates</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter(t => !t.is_system_template).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {Object.entries(documentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="system">Templates do Sistema</SelectItem>
                  <SelectItem value="user">Meus Templates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum template encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NOME</TableHead>
                      <TableHead>TIPO</TableHead>
                      <TableHead>CATEGORIA</TableHead>
                      <TableHead>DESCRIÇÃO</TableHead>
                      <TableHead>AÇÕES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">
                          {template.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {documentTypeLabels[template.document_type] || template.document_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={template.is_system_template ? statusVariants.system : statusVariants.user}
                          >
                            {template.is_system_template ? (
                              <>
                                <Crown className="w-3 h-3 mr-1" />
                                Sistema
                              </>
                            ) : (
                              "Personalizado"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-muted-foreground">
                            {template.description || "Sem descrição"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(template.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(template.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDuplicate(template.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
