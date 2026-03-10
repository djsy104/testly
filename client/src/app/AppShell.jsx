import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

function AppShell() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default AppShell;
