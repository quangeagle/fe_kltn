import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RejectPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/products/supplier/allsuppliers?status=pending', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err));
  }, []);

  const rejectProduct = (id) => {
    const token = localStorage.getItem('token');
    axios.patch(`https://be-kltn-1.onrender.com/api/products/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setProducts(products.filter(p => p._id !== id)))
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>❌ Từ chối sản phẩm</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} <button onClick={() => rejectProduct(product._id)}>Từ chối</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RejectPage;