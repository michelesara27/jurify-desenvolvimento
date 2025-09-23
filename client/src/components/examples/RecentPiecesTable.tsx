// src/components/examples/RecentPiecesTable.tsx
import { RecentPiecesTable } from "../RecentPiecesTable";

export default function RecentPiecesTableExample() {
  // todo: remove mock functionality
  const mockPieces = [
    {
      id: "1",
      cliente: "Maria Santos",
      tipo: "Petição Inicial",
      status: "Finalizado" as const,
      acao: "Ver",
    },
    {
      id: "2",
      cliente: "João Silva",
      tipo: "Contrato",
      status: "Executivo" as const,
      acao: "Editar",
    },
    {
      id: "3",
      cliente: "Ana Costa",
      tipo: "Recurso",
      status: "Recursos" as const,
      acao: "Excluir",
    },
  ];

  return (
    <div className="p-4 max-w-4xl">
      <RecentPiecesTable pieces={mockPieces} />
    </div>
  );
}
