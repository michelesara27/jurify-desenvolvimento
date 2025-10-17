// src/hooks/use-auth.ts (custom auth)
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { hashPassword, verifyPassword } from "@/lib/hash";

export interface CustomUser {
  id: string;
  email: string;
  is_active: boolean;
}

export interface AuthState {
  user: CustomUser | null;
  loading: boolean;
}

const SESSION_KEY = "jurify.custom_auth.session";

function readSession(): { userId: string; email: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSession(session: { userId: string; email: string } | null) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const init = async () => {
      const session = readSession();
      if (!session) {
        setAuthState({ user: null, loading: false });
        return;
      }
      const { data, error } = await supabase
        .from("app_users")
        .select("id, email, is_active")
        .eq("id", session.userId)
        .maybeSingle();
      if (error || !data) {
        writeSession(null);
        setAuthState({ user: null, loading: false });
        return;
      }
      setAuthState({ user: data as CustomUser, loading: false });
    };
    init();
  }, []);

  const signIn = async (email: string, password: string) => {
    const emailSanitized = email.trim().toLowerCase();
    const { data: user, error } = await supabase
      .from("app_users")
      .select("id, email, is_active, password_hash")
      .eq("email", emailSanitized)
      .maybeSingle();
    if (error) return { data: null, error };
    if (!user) return { data: null, error: { message: "Usuário não encontrado" } } as any;
    if (!user.is_active) return { data: null, error: { message: "Usuário inativo" } } as any;
    const ok = await verifyPassword(password, emailSanitized, (user as any).password_hash);
    if (!ok) return { data: null, error: { message: "Credenciais inválidas" } } as any;
    writeSession({ userId: user.id, email: user.email });
    setAuthState({ user: { id: user.id, email: user.email, is_active: user.is_active }, loading: false });
    return { data: { user }, error: null } as any;
  };

  const signUp = async (email: string, password: string) => {
    const emailSanitized = email.trim().toLowerCase();
    const password_hash = await hashPassword(password, emailSanitized);
    const { data, error } = await supabase
      .from("app_users")
      .insert({ email: emailSanitized, password_hash })
      .select("id, email, is_active")
      .single();
    return { data, error };
  };

  const signOut = async () => {
    writeSession(null);
    setAuthState({ user: null, loading: false });
    return { error: null };
  };

  const getCurrentUserId = (): string | null => {
    return authState.user?.id ?? null;
  };

  const isAuthenticated = (): boolean => {
    return !!authState.user;
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    getCurrentUserId,
    isAuthenticated,
  };
};
