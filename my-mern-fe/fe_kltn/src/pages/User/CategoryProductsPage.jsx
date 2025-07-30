import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CategoryProductsPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`https://be-kltn-1.onrender.com/api/products/category/${categoryId}`).then(res => setProducts(res.data.data));
  }, [categoryId]);

  return (
    <div>
      <h2>Sản phẩm trong danh mục</h2>
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

export default CategoryProductsPage;