import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminSupplierDetailPage = () => {
  const { supplierId } = useParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('approved'); // mặc định
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/products/supplier/${supplierId}?status=${status}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data.products);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId, status]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm của nhà cung cấp</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Lọc theo trạng thái:</label>
        <select
          className="border px-2 py-1 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : products.length === 0 ? (
        <p>Không có sản phẩm nào với trạng thái "{status}".</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product._id} className="border p-4 rounded shadow">
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.description}</p>
              <p>Giá: {product.price}đ | Đơn vị: {product.unit}</p>
              <p>Danh mục: {product.categoryGroup?.name}</p>
              <p>Trạng thái: <span className="capitalize">{product.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminSupplierDetailPage;
