import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPage = () => {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setMsg(`Welcome User: ${name}`))
    .catch(err => setMsg('Access denied'));
  }, []);

  return <h1>{msg}</h1>;
};

export default UserPage;
