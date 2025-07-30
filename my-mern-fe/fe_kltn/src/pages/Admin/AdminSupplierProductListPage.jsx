import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminSupplierProductsPage = () => {
  const { supplierId } = useParams();
  const [status, setStatus] = useState('pending'); // default là chờ duyệt
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Bạn chưa đăng nhập');
          return;
        }
        console.log('🔑 Token đang dùng:', token);
        const res = await axios.get(
          `https://be-kltn-1.onrender.com/api/products/supplier/${supplierId}?status=${status}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error('❌ Lỗi lấy sản phẩm:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId, status]);
  const handleApprove = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `https://be-kltn-1.onrender.com/api/products/${productId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ Sản phẩm đã được duyệt');
      // Cập nhật lại danh sách
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('❌ Lỗi duyệt sản phẩm:', err);
      alert('❌ Không thể duyệt sản phẩm');
    }
  };
  
  const handleReject = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `https://be-kltn-1.onrender.com/api/products/${productId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('🚫 Sản phẩm đã bị từ chối');
      // Cập nhật lại danh sách
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('❌ Lỗi từ chối sản phẩm:', err);
      alert('❌ Không thể từ chối sản phẩm');
    }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm của nhà cung cấp</h2>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${status === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setStatus('pending')}
        >
          Đang chờ
        </button>
        <button
          className={`px-4 py-2 rounded ${status === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setStatus('approved')}
        >
          Đã chấp nhận
        </button>
        <button
          className={`px-4 py-2 rounded ${status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setStatus('rejected')}
        >
          Đã từ chối
        </button>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : products.length === 0 ? (
        <p>Không có sản phẩm ở trạng thái này.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              <img
                src={product.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p><strong>Số lượng:</strong> {product.quantity}</p>
              <p><strong>Giá:</strong> {product.price?.toLocaleString('vi-VN')}₫</p>
              <p><strong>Mô tả:</strong> {product.description?.slice(0, 100)}...</p>
              <p><strong>Danh mục:</strong> {product.categoryGroup?.name || 'Không xác định'}</p>
              <p><strong>Trạng thái:</strong> {product.status}</p>

              {status === 'pending' && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleApprove(product._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(product._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Từ chối
                  </button>
                </div>
  )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSupplierProductsPage;
