import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage.jsx';
import Register from '../pages/Register.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AppShell from './AppShell.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicOnlyRoute from './PublicOnlyRoute.jsx';

const router = createBrowserRouter([
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [{ path: '/', element: <Dashboard /> }],
      },
    ],
  },

  // Public-only routes (redirect if logged in)
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
