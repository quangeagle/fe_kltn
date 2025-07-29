import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminSupplierListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/suppliers/allsuppliers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setSuppliers(res.data.suppliers); // ✅ đúng key
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách nhà cung cấp</h2>
      {suppliers.length === 0 ? (
        <p>Không có nhà cung cấp nào.</p>
      ) : (
        <ul className="space-y-4">
          {suppliers.map((supplier) => (
            <li
              key={supplier._id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/admin/suppliers/${supplier._id}`)}
            >
              <p><strong>{supplier.storeName}</strong> — {supplier.ownerName}</p>
              <p>📍 {supplier.storeAddress}</p>
              <p>📞 {supplier.phone} | 📧 {supplier.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminSupplierListPage;
