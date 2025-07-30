import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://be-kltn-1.onrender.com/api/products/supplier/allsuppliers?status=pending', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📦 Danh sách sản phẩm đang chờ duyệt</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>{product.name} - {product.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListPage;