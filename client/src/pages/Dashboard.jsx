import { useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  useEffect(() => {
    axios.get('http://localhost:8080/api');
  }, []);

  return <h1>Dashboard</h1>;
}

export default Dashboard;
