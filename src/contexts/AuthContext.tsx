import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface Profile {
  user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  bio: string | null;
  location: string | null;
  contest_rating: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  isProfileLoading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const isMountedRef = useRef(true);

  const loadProfile = async (activeSession: Session | null) => {
    if (!activeSession?.user) {
      if (!isMountedRef.current) return;
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    if (!isMountedRef.current) return;
    setIsProfileLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, first_name, last_name, username, bio, location, contest_rating")
      .eq("user_id", activeSession.user.id)
      .maybeSingle();
    if (!isMountedRef.current) return;
    if (error) {
      console.error("Failed to load profile:", error.message);
    }
    setProfile(data ?? null);
    setIsProfileLoading(false);
  };

  useEffect(() => {
    isMountedRef.current = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to load session:", error.message);
      }
      if (!isMountedRef.current) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
      await loadProfile(data.session ?? null);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMountedRef.current) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(false);
      void loadProfile(nextSession);
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const { data } = await supabase.auth.getSession();
    await loadProfile(data.session ?? null);
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        profile,
        isProfileLoading,
        signInWithGithub,
        signInWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
