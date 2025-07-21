import { Navigate, useLocation } from 'react-router-dom';

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // ✅ Avoid redirect loop if already on "/"
  if (isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
