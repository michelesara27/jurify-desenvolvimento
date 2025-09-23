// server/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@shared/schema";

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis de ambiente do Supabase não encontradas");
  console.error("SUPABASE_URL:", supabaseUrl ? "Definida" : "Não definida");
  console.error(
    "SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "Definida" : "Não definida"
  );

  // Para desenvolvimento, você pode usar valores padrão ou lançar um erro
  throw new Error("Supabase URL e ANON KEY são necessários no arquivo .env");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão
export async function testSupabaseConnection() {
  try {
    console.log("Testando conexão com Supabase...");

    const { data, error } = await supabase
      .from("clientes")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Erro na conexão com Supabase:", error);
      return false;
    }

    console.log("✅ Conexão com Supabase estabelecida com sucesso!");
    console.log("📊 Total de clientes:", data);
    return true;
  } catch (error) {
    console.error("❌ Erro ao testar conexão com Supabase:", error);
    return false;
  }
}
