import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import ErrorPage from '../pages/ErrorPage.jsx';
import Register from '../pages/Register.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
// import App from './App.jsx';
import AppShell from './AppShell.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [{ index: true, element: <Dashboard /> }],
  },

  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },

  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },

  {
    path: '/dashboard',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
