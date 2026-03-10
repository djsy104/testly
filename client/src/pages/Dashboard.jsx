import { useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';

function Dashboard() {
  useEffect(() => {
    axios.get('http://localhost:8080/api');
  }, []);

  return (
    <>
      <Navbar />
      <h1>Dashboard</h1>
    </>
  );
}

export default Dashboard;
