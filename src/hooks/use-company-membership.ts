import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { hashPassword } from "@/lib/hash";

export interface CompanyUsersMembership {
  id: string;
  user_id: string;
  company_id: string;
  role: "admin" | "manager" | "member";
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    name: string;
    cnpj: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    phone: string | null;
    email: string | null;
  };
}

export interface RegisterCompanyPayload {
  company: {
    name: string;
    email: string;
    phone: string;
    cnpj: string;
    address: string; // logradouro, número, complemento, bairro concatenados
    city: string;
    state: string;
    zip_code: string; // CEP
  };
  credentials: {
    email: string;
    password: string;
  };
}

export const useCompanyMembership = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["company-membership", user?.id],
    queryFn: async (): Promise<CompanyUsersMembership | null> => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("company_users")
        .select(
          `*, company:companies(id, name, cnpj, address, city, state, zip_code, phone, email)`
        )
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return (data as CompanyUsersMembership) || null;
    },
    enabled: !!user?.id,
  });
};

export const useRegisterCompany = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: async (payload: RegisterCompanyPayload): Promise<CompanyUsersMembership> => {
      const { company, credentials } = payload;
      const emailSanitized = credentials.email.trim().toLowerCase();

      const { data: companyRow, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: company.name,
          email: company.email,
          phone: company.phone,
          cnpj: company.cnpj,
          address: company.address,
          city: company.city,
          state: company.state,
          zip_code: company.zip_code,
          is_active: true,
        })
        .select()
        .single();

      if (companyError) {
        throw new Error(`Erro ao criar empresa: ${companyError.message}`);
      }

      // Criar usuário custom
      const password_hash = await hashPassword(credentials.password, emailSanitized);
      const { data: appUser, error: userError } = await supabase
        .from("app_users")
        .insert({ email: emailSanitized, password_hash })
        .select("id, email")
        .single();

      if (userError) {
        throw new Error(`Erro ao criar usuário custom: ${userError.message}`);
      }

      const { data: membership, error: membershipError } = await supabase
        .from("company_users")
        .insert({
          user_id: appUser.id,
          company_id: companyRow.id,
          role: "admin",
        })
        .select("*")
        .single();

      if (membershipError) {
        throw new Error(`Erro ao vincular usuário à empresa: ${membershipError.message}`);
      }

      // Efetuar login e session
      await signIn(emailSanitized, credentials.password);

      toast({
        title: "Cadastro concluído",
        description: "Empresa criada e usuário definido como administrador.",
      });

      return membership as CompanyUsersMembership;
    },
  });
};