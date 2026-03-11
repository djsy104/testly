import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppShell() {
  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default AppShell;
