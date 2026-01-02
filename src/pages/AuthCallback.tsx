import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalizeAuth = async () => {
      const url = new URL(window.location.href);
      const errorDescription = url.searchParams.get("error_description");

      if (errorDescription) {
        setError(errorDescription);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (!data.session?.user) {
          setError("Authentication failed. Please try again.");
          return;
        }
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        if (profileError) {
          throw profileError;
        }
        navigate(profile ? "/dashboard" : "/profile/create", { replace: true });
      } catch (authError) {
        setError(authError instanceof Error ? authError.message : "Authentication failed.");
      }
    };

    void finalizeAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-bold">Signing you in...</h1>
        {error ? (
          <>
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => navigate("/auth", { replace: true })}
              className={cn(
                "inline-flex items-center justify-center px-4 py-2 rounded-lg",
                "bg-secondary border border-border text-sm font-medium",
                "hover:bg-accent transition-colors"
              )}
            >
              Back to sign in
            </button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Hang tight, we are finalizing your account.
          </p>
        )}
      </div>
    </div>
  );
}
