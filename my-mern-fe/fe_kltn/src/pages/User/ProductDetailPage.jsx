import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://be-kltn-1.onrender.com/api/products/${id}`).then(res => setProduct(res.data.data));
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Mô tả: {product.description}</p>
      <p>Giá: {product.price}</p>
    </div>
  );
}

export default ProductDetailPage;