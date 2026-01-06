import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import ProblemPage from "./pages/ProblemPage";
import ProblemCreate from "./pages/ProblemCreate";
import Leaderboard from "./pages/Leaderboard";
import ProblemLeaderboard from "./pages/ProblemLeaderboard";
import SubmissionDetail from "./pages/SubmissionDetail";
import Profile from "./pages/Profile";
import ProfileCreate from "./pages/ProfileCreate";
import Privacy from "./pages/Privacy";
import Tutorials from "./pages/Tutorials";
import TutorialDetail from "./pages/TutorialDetail";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60_000, // 1 minute
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function FullscreenLoader() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-sm text-muted-foreground">Loading…</div>
    </div>
  );
}

function ProfileRequiredRoute({ children }) {
  const { isAuthenticated, isLoading, profile, isProfileLoading } = useAuth();
  const location = useLocation();

  // Only block on initial auth bootstrap
  if (isLoading) return <FullscreenLoader />;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  // If profile is missing, wait for it / redirect
  if (!profile) {
    if (isProfileLoading) return <FullscreenLoader />;
    if (location.pathname !== "/profile/create") {
      return <Navigate to="/profile/create" replace />;
    }
  }

  // IMPORTANT: keep children mounted even if isProfileLoading is true
  return (
    <>
      {children}
      {/* optional: show a tiny non-blocking “Syncing…” badge instead of unmounting */}
      {/* {isProfileLoading && <div className="fixed bottom-4 right-4 text-xs">Syncing…</div>} */}
    </>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading, profile, isProfileLoading } = useAuth();

  if (isLoading) return <FullscreenLoader />;

  // If already authed, redirect (don’t block UI on profile loading)
  if (isAuthenticated) {
    if (!profile && isProfileLoading) return <FullscreenLoader />;
    return <Navigate to={profile ? "/dashboard" : "/profile/create"} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, profile, isProfileLoading } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated
            ? isProfileLoading
              ? null
              : <Navigate to={profile ? "/dashboard" : "/profile/create"} replace />
            : <Landing />
        } 
      />
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } 
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProfileRequiredRoute>
            <Dashboard />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/problem/:id" 
        element={
          <ProfileRequiredRoute>
            <ProblemPage />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/problem/create" 
        element={
          <ProfileRequiredRoute>
            <ProblemCreate />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/problem/:id/leaderboard" 
        element={
          <ProfileRequiredRoute>
            <ProblemLeaderboard />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/problem/:id/submission/:submissionId" 
        element={
          <ProfileRequiredRoute>
            <SubmissionDetail />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <ProfileRequiredRoute>
            <Leaderboard />
          </ProfileRequiredRoute>
        } 
      />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route 
        path="/tutorial/:id" 
        element={
          <ProfileRequiredRoute>
            <TutorialDetail />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/subscriptions" 
        element={
          <ProfileRequiredRoute>
            <Subscriptions />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProfileRequiredRoute>
            <Profile />
          </ProfileRequiredRoute>
        } 
      />
      <Route 
        path="/profile/create" 
        element={
          <ProtectedRoute>
            <ProfileCreate />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
