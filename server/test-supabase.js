// server/test-supabase.js
import { testSupabaseConnection } from "./lib/supabase.js";

async function main() {
  console.log("=== Teste de Conexão com Supabase ===");
  const success = await testSupabaseConnection();

  if (success) {
    console.log("✅ Teste concluído com sucesso!");
    process.exit(0);
  } else {
    console.log("❌ Falha no teste de conexão");
    process.exit(1);
  }
}

main().catch(console.error);
