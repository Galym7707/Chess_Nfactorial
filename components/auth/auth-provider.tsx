"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeJsonParse } from "@/lib/utils";
import type { Profile } from "@/types/app";

const DEMO_USER_KEY = "code-gambit:demo-user";
const DEMO_PROFILE_KEY = "code-gambit:demo-profile";

export type AppUser = {
  id: string;
  email: string;
  isDemo: boolean;
};

type AuthContextValue = {
  user: AppUser | null;
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, displayName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  startDemoSession: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<string | null>;
};

const authSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

const AuthContext = createContext<AuthContextValue | null>(null);

function toAppUser(user: User): AppUser {
  return { id: user.id, email: user.email ?? "player@codegambit.local", isDemo: false };
}

function demoProfile(userId: string): Profile {
  return {
    id: userId,
    display_name: "Demo Player",
    city: "Алматы",
    preferred_theme: "system",
    board_theme: "midnight",
    is_pro: false,
    rating: 1200,
    wins: 0,
    losses: 0,
    draws: 0,
  };
}

async function ensureProfile(user: AppUser) {
  if (user.isDemo) {
    const stored = safeJsonParse<Profile | null>(localStorage.getItem(DEMO_PROFILE_KEY), null);
    if (stored) return stored;
    const profile = demoProfile(user.id);
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (data) return data as Profile;

  const fallback = demoProfile(user.id);
  const { data: inserted } = await supabase
    .from("profiles")
    .insert({ id: user.id, display_name: user.email.split("@")[0], city: "Алматы" })
    .select("*")
    .single();
  return (inserted as Profile | null) ?? fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  const loadProfile = useCallback(async (nextUser: AppUser | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }
    const nextProfile = await ensureProfile(nextUser);
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    async function restore() {
      if (!configured || !supabase) {
        const demoUser = safeJsonParse<AppUser | null>(localStorage.getItem(DEMO_USER_KEY), null);
        if (mounted) {
          setUser(demoUser);
          if (demoUser) await loadProfile(demoUser);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ? toAppUser(data.session.user) : null;
      if (mounted) {
        setUser(currentUser);
        if (currentUser) await loadProfile(currentUser);
        setLoading(false);
      }
    }

    void restore();

    if (!supabase) return () => { mounted = false; };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ? toAppUser(session.user) : null;
      setUser(nextUser);
      void loadProfile(nextUser);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) return parsed.error.issues[0]?.message ?? "Проверьте форму";
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return "Supabase Auth не настроен. Используйте демо-сессию.";
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    return error?.message ?? null;
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) return parsed.error.issues[0]?.message ?? "Проверьте форму";
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return "Supabase Auth не настроен. Используйте демо-сессию.";
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { display_name: displayName } },
    });
    if (error) return error.message;
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, display_name: displayName || email.split("@")[0], city: "Алматы" });
    }
    return null;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    localStorage.removeItem(DEMO_USER_KEY);
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const startDemoSession = useCallback(() => {
    const nextUser: AppUser = { id: "demo-local-user", email: "demo@codegambit.local", isDemo: true };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    void loadProfile(nextUser);
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    if (!user) return "Нужен вход в аккаунт";
    const nextProfile = { ...(profile ?? demoProfile(user.id)), ...patch, id: user.id };
    if (user.isDemo) {
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(nextProfile));
      setProfile(nextProfile);
      return null;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return "Supabase не настроен";
    const { data, error } = await supabase.from("profiles").upsert(nextProfile).select("*").single();
    if (error) return error.message;
    setProfile(data as Profile);
    return null;
  }, [profile, user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    loading,
    configured,
    signIn,
    signUp,
    signOut,
    startDemoSession,
    refreshProfile,
    updateProfile,
  }), [configured, loading, profile, refreshProfile, signIn, signOut, signUp, startDemoSession, updateProfile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}