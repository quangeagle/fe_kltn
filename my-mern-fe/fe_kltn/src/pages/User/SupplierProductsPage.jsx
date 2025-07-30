import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function SupplierProductsPage() {
  const { supplierId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/supplier/${supplierId}`).then(res => setProducts(res.data.data));
  }, [supplierId]);

  return (
    <div>
      <h2>Sản phẩm đã được duyệt của cửa hàng</h2>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            <Link to={`/product/${p._id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupplierProductsPage;