// client/src/pages/MinhasPecas.tsx
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PiecesFilterBar } from "@/components/PiecesFilterBar";
import { PiecesListTable } from "@/components/PiecesListTable";
import { PieceFormModal } from "@/components/PieceFormModal";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PieceData {
  id: string;
  titulo: string;
  tipo: string;
  status: "Finalizado" | "Executivo" | "Recursos" | "Rascunho";
  clienteId: string;
  clienteNome: string;
  conteudo: string;
  templateUsado: string;
  createdAt: string;
  updatedAt: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

export default function MinhasPecas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados do componente
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPiece, setEditingPiece] = useState<PieceData | null>(null);
  const [pieceToDelete, setPieceToDelete] = useState<string | null>(null);

  // Queries
  const { data: pieces = [], isLoading: isLoadingPieces } = useQuery<
    PieceData[]
  >({
    queryKey: ["/api/pecas"],
  });

  const { data: clientes = [] } = useQuery<Cliente[]>({
    queryKey: ["/api/clientes"],
  });

  // Mutations
  const createPieceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/pecas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create piece");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pecas"] });
    },
  });

  const updatePieceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/pecas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update piece");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pecas"] });
    },
  });

  const deletePieceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/pecas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete piece");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pecas"] });
    },
  });

  // Filtros aplicados
  const filteredPieces = useMemo(() => {
    let filtered: PieceData[] = pieces;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (piece) =>
          piece.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          piece.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          piece.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de status
    if (statusFilter !== "todos") {
      filtered = filtered.filter((piece) => piece.status === statusFilter);
    }

    // Filtro de tipo
    if (typeFilter !== "todos") {
      filtered = filtered.filter((piece) => piece.tipo === typeFilter);
    }

    return filtered;
  }, [pieces, searchTerm, statusFilter, typeFilter]);

  // Handlers
  const handleNewPiece = () => {
    setEditingPiece(null);
    setIsFormModalOpen(true);
  };

  const handleEditPiece = (id: string) => {
    const piece = pieces.find((p) => p.id === id);
    if (piece) {
      setEditingPiece(piece);
      setIsFormModalOpen(true);
    }
  };

  const handleViewPiece = (id: string) => {
    console.log(`Visualizar peça: ${id}`);
    toast({
      title: "Visualizar Peça",
      description: "Funcionalidade de visualização será implementada.",
    });
  };

  const handleDeletePiece = (id: string) => {
    setPieceToDelete(id);
  };

  const confirmDelete = async () => {
    if (!pieceToDelete) return;

    try {
      await deletePieceMutation.mutateAsync(pieceToDelete);
      toast({
        title: "Peça excluída",
        description: "A peça jurídica foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a peça. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setPieceToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (editingPiece) {
      await updatePieceMutation.mutateAsync({ id: editingPiece.id, data });
    } else {
      await createPieceMutation.mutateAsync(data);
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="minhas-pecas-page">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Minhas Peças</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas peças jurídicas em um só lugar.
        </p>
      </div>

      {/* Barra de filtros */}
      <PiecesFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        onNewPiece={handleNewPiece}
      />

      {/* Lista de peças */}
      <PiecesListTable
        pieces={filteredPieces.map((piece) => ({
          ...piece,
          createdAt: new Date(piece.createdAt),
          updatedAt: new Date(piece.updatedAt),
        }))}
        isLoading={isLoadingPieces}
        onView={handleViewPiece}
        onEdit={handleEditPiece}
        onDelete={handleDeletePiece}
      />

      {/* Modal de formulário */}
      <PieceFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        clientes={clientes}
        initialData={editingPiece || undefined}
        isEditing={!!editingPiece}
        isLoading={
          createPieceMutation.isPending || updatePieceMutation.isPending
        }
      />

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog
        open={!!pieceToDelete}
        onOpenChange={() => setPieceToDelete(null)}
      >
        <AlertDialogContent data-testid="delete-confirmation-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta peça jurídica? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
