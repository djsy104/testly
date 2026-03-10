import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

function PublicOnlyRoute() {
  const { isAuthenticated, isBooting } = useAuth();

  if (isBooting) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicOnlyRoute;
