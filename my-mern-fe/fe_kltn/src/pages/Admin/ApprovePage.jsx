import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/products/supplier/allsuppliers?status=pending', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err));
  }, []);

  const approveProduct = (id) => {
    const token = localStorage.getItem('token');
    axios.patch(`http://localhost:5000/api/products/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setProducts(products.filter(p => p._id !== id)))
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>✅ Duyệt sản phẩm</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} <button onClick={() => approveProduct(product._id)}>Duyệt</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovePage;