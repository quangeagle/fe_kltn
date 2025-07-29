import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from '../../components/NavbarAdmin';
const AdminPage = () => {
  const [msg, setMsg] = useState('');
  const name = localStorage.getItem('name');
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/admins/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setMsg(`Welcome Admin: ${name}`))
    .catch(err => setMsg('Access denied'));
  }, []);

  return (
    <div>
      <h1>{msg}</h1>
      <NavbarAdmin />
    </div>
  );
};

export default AdminPage;
