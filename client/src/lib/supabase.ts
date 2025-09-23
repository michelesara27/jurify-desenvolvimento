// client/src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Configurações do Supabase - substitua com suas credenciais
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://fqraestliwfjkqehzcfq.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcmFlc3RsaXdmamtxZWh6Y2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTE2NTQsImV4cCI6MjA3Mzk4NzY1NH0.O9YK-HwGm8CanxccW0NxjNl0tj_QQWDSZo7U6xLzgYs";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis de ambiente do Supabase não configuradas");
  console.log("Configure no arquivo .env:");
  console.log("VITE_SUPABASE_URL=sua_url_do_supabase");
  console.log("VITE_SUPABASE_ANON_KEY=sua_chave_anonima");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Testar conexão
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Erro na conexão com Supabase:", error);
      return false;
    }

    console.log("✅ Conexão com Supabase estabelecida!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com Supabase:", error);
    return false;
  }
}
