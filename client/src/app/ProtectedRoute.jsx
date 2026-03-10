import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isBooting } = useAuth();

  if (isBooting) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
