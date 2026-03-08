import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);

  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:8080/api');
    console.log(response.data.message);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <h1>Hello world</h1>
    </>
  );
}

export default App;
