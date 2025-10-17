// src/services/document-generator.ts
/**
 * Serviço para geração de documentos formatados
 * Responsável por gerar petições formatadas com base nos dados do webhook
 */

export interface PeticaoData {
  peticao_inicial?: {
    autor?: string;
    reu?: string;
  };
  valor_da_causa?: string;
  [key: string]: any;
}

export interface DocumentoGerado {
  conteudo: string;
  dataGeracao: string;
}

class DocumentGeneratorService {
  /**
   * Template base para petição de indenização por danos morais
   */
  private readonly templatePeticao = `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DO [ESPECIFICAR O JUÍZO – Ex.: 2º JUAZADO ESPECIAL CÍVEL DA COMARCA DA CAPITAL]

AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS
Processo nº: [DEIXAR EM BRANCO PARA Nº DO PROTOCOLO]

Autor: {autor}
(nacionalidade), (estado civil), (profissão), portador do CPF nº [Nº DO CPF] e RG nº [Nº DO RG], residente e domiciliado na [ENDEREÇO COMPLETO], CEP [CEP].

Réu: {reu}
CNPJ/MF nº [INSERIR CNPJ DO BANCO], com sede na [ENDEREÇO DA MATRIZ], CEP [CEP], neste ato representado por seu representante legal, na forma de seus atos constitutivos.

DOS VALORES DA CAUSA E ISENÇÃO
Valor da Causa: {valor_da_causa}.
Autor, [INFORME SE É HIPOSSUFICIENTE/INCLUA PEDIDO DE ISENÇÃO SE FOR O CASO].

DOS FATOS

O autor é consumidor, na definição do art. 2º do Código de Defesa do Consumidor, e mantém/mantinha relação consumerista com o réu, {reu}, tendo contratado o serviço de [ESPECIFICAR O SERVIÇO OU PRODUTO FINANCEIRO, ex.: conta corrente, cartão de crédito, empréstimo].

Em data aproximada de [INFORMAR A DATA OU PERÍODO], o autor, surpreendentemente, tomou ciência de que seu nome foi indevidamente negativado perante órgãos de proteção ao crédito, como o SPC e a Serasa.

A negativação ocorreu de forma totalmente irregular, uma vez que não houve qualquer aviso prévio por parte do réu sobre a suposta inadimplência ou sobre a iminente medida de negativação, conforme impõe a boa-fé objetiva e as práticas comerciais leais que regem as relações de consumo.

Em decorrência desse ato ilícito, o autor foi submetido a constrangimentos, angústia e transtornos, além de ver sua honra objetiva e imagem perante a sociedade maculadas, sofrendo dificuldades para obter crédito e realizar operações comerciais rotineiras.

DO DIREITO

A relação mantida entre as partes é, inequivocamente, de consumo, aplicando-se integralmente o Código de Defesa do Consumidor (Lei nº 8.078/90).

O art. 14 do CDC estabelece a responsabilidade objetiva do fornecedor por danos causados aos consumidores por defeitos dos serviços prestados.

A negativação do nome do consumidor sem a devida comunicação e sem a observância do contraditório e da ampla defesa configura serviço defeituoso, violando os princípios da boa-fé e da confiança.

O ato praticado pelo réu configura violação a direitos da personalidade, previstos no art. 5º, X, da Constituição Federal, que assegura a inviolabilidade da intimidade, da honra e da imagem, gerando o dever de indenizar.

A jurisprudência dos Tribunais é pacífica no sentido de que a negativação indevida do nome, especialmente sem aviso prévio, gera o dever de indenizar por danos morais, independentemente da comprovação de dolo ou culpa, em razão da responsabilidade objetiva do fornecedor.

DO PEDIDO

Diante do exposto, requer o Autor:

a) O recebimento da presente petição inicial e a citação do Réu para responder aos termos desta ação;

b) Ao final, seja o Réu condenado a pagar ao Autor a quantia de {valor_da_causa} a título de danos morais, devidamente atualizados monetariamente desde a citação até o efetivo pagamento;

c) Seja condenado ao custeio das despesas processuais e honorários advocatícios, na forma da lei;

d) Outras provas e medidas judiciais que Vossa Excelência entender necessárias.

Termos em que
Pede e espera deferimento.

Local e data.

Assinatura do Advogado
[Nome do Advogado]
OAB/[UF] nº [Nº da OAB]`;

  /**
   * Extrai dados relevantes do conteúdo do webhook
   */
  private extrairDadosDoWebhook(webhookContent: any): PeticaoData {
    try {
      // Se o conteúdo já é um objeto, usar diretamente
      if (typeof webhookContent === "object" && webhookContent !== null) {
        return webhookContent;
      }

      // Se é string, tentar fazer parse JSON
      if (typeof webhookContent === "string") {
        return JSON.parse(webhookContent);
      }

      return {};
    } catch (error) {
      console.error("Erro ao extrair dados do webhook:", error);
      return {};
    }
  }

  /**
   * Substitui as variáveis no template pelos dados extraídos
   */
  private substituirVariaveis(template: string, dados: PeticaoData): string {
    let documentoFormatado = template;

    // Substituir {autor}
    const autor = dados.peticao_inicial?.autor || "[NOME DO AUTOR]";
    documentoFormatado = documentoFormatado.replace(/{autor}/g, autor);

    // Substituir {reu}
    const reu = dados.peticao_inicial?.reu || "[NOME DO RÉU]";
    documentoFormatado = documentoFormatado.replace(/{reu}/g, reu);

    // Substituir {valor_da_causa}
    const valorCausa = dados.valor_da_causa || "[VALOR DA CAUSA]";
    documentoFormatado = documentoFormatado.replace(
      /{valor_da_causa}/g,
      valorCausa
    );

    return documentoFormatado;
  }

  /**
   * Gera documento formatado com base nos dados do webhook
   */
  public gerarDocumento(webhookResponseContent: any): DocumentoGerado {
    try {
      // Extrair dados do webhook
      const dadosExtraidos = this.extrairDadosDoWebhook(webhookResponseContent);

      // Substituir variáveis no template
      const conteudoFormatado = this.substituirVariaveis(
        this.templatePeticao,
        dadosExtraidos
      );

      // Retornar documento gerado
      return {
        conteudo: conteudoFormatado,
        dataGeracao: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Erro ao gerar documento:", error);
      throw new Error("Falha na geração do documento formatado");
    }
  }

  /**
   * Valida se os dados necessários estão presentes
   */
  public validarDados(webhookResponseContent: any): {
    valido: boolean;
    camposFaltantes: string[];
  } {
    const dadosExtraidos = this.extrairDadosDoWebhook(webhookResponseContent);
    const camposFaltantes: string[] = [];

    if (!dadosExtraidos.peticao_inicial?.autor) {
      camposFaltantes.push("peticao_inicial.autor");
    }

    if (!dadosExtraidos.peticao_inicial?.reu) {
      camposFaltantes.push("peticao_inicial.reu");
    }

    if (!dadosExtraidos.valor_da_causa) {
      camposFaltantes.push("valor_da_causa");
    }

    return {
      valido: camposFaltantes.length === 0,
      camposFaltantes,
    };
  }
}

// Exportar instância singleton
export const documentGeneratorService = new DocumentGeneratorService();
