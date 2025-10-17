// src/services/document-word-generator.ts
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export class DocumentWordGenerator {
  /**
   * Converte texto formatado em documento Word
   * @param content - Conteúdo do documento formatado
   * @param title - Título do documento (opcional)
   * @returns Promise<Blob> - Blob do documento Word
   */
  static async generateWordDocument(
    content: string,
    title?: string
  ): Promise<Blob> {
    try {
      // Dividir o conteúdo em linhas
      const lines = content.split("\n");
      const paragraphs: Paragraph[] = [];

      // Adicionar título se fornecido
      if (title) {
        paragraphs.push(
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            spacing: {
              after: 400,
            },
          })
        );
      }

      // Processar cada linha do conteúdo
      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine === "") {
          // Linha vazia - adicionar espaçamento
          paragraphs.push(
            new Paragraph({
              text: "",
              spacing: {
                after: 200,
              },
            })
          );
        } else if (this.isHeading(trimmedLine)) {
          // Detectar cabeçalhos (linhas que começam com números ou letras maiúsculas seguidas de ponto)
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: {
                before: 300,
                after: 200,
              },
            })
          );
        } else {
          // Parágrafo normal
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  size: 22,
                }),
              ],
              spacing: {
                after: 120,
              },
              alignment: "justify",
            })
          );
        }
      }

      // Criar o documento
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      // Gerar o blob do documento diretamente (compatível com navegador)
      const blob = await Packer.toBlob(doc);
      return blob;
    } catch (error) {
      console.error("Erro ao gerar documento Word:", error);
      throw new Error("Falha ao gerar documento Word");
    }
  }

  /**
   * Detecta se uma linha é um cabeçalho
   * @param line - Linha de texto
   * @returns boolean
   */
  private static isHeading(line: string): boolean {
    // Padrões para detectar cabeçalhos:
    // - Números seguidos de ponto (1., 2., 3.)
    // - Letras maiúsculas seguidas de ponto (A., B., C.)
    // - Texto em maiúsculas
    // - Linhas que começam com palavras específicas
    const headingPatterns = [
      /^\d+\.\s/, // 1., 2., 3.
      /^[A-Z]\.\s/, // A., B., C.
      /^[A-Z\s]+$/, // TEXTO EM MAIÚSCULAS
      /^(PETIÇÃO|REQUERIMENTO|CONSIDERANDO|PELOS FUNDAMENTOS|REQUER|NESTES TERMOS)/i,
    ];

    return headingPatterns.some((pattern) => pattern.test(line));
  }

  /**
   * Faz o download do documento Word
   * @param blob - Blob do documento
   * @param filename - Nome do arquivo
   */
  static downloadWordDocument(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".docx") ? filename : `${filename}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
