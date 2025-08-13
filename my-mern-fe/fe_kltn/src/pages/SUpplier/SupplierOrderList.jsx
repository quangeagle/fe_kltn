import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SupplierOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://be-kltn-1.onrender.com/api/orders/supplier', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Lỗi lấy đơn hàng:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem('token');
      const url = `https://be-kltn-1.onrender.com/api/orders/${action}/${orderId}`;
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(); // Reload sau khi xử lý
    } catch (err) {
      console.error(`Lỗi khi ${action} đơn hàng:`, err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Đang tải danh sách đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-white p-6">📦 Không có đơn hàng nào.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Danh Sách Đơn Hàng</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-gray-800 p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-lg font-semibold">
                  Người đặt: {order.user?.fullName || 'Ẩn danh'}
                </p>
                <p className="text-sm text-gray-400">Email: {order.user?.email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-400">
                  Tổng tiền: {order.totalAmount.toLocaleString()}₫
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              {order.items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center py-1">
                  <p>{item.product.name}</p>
                  <p>
                    {item.quantity} x {item.product.price?.toLocaleString()}₫ ={' '}
                    {(item.quantity * item.product.price).toLocaleString()}₫
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded ${
                  order.status === 'pending'
                    ? 'bg-yellow-500'
                    : order.status === 'approved'
                    ? 'bg-green-600'
                    : order.status === 'cancelled'
                    ? 'bg-red-500'
                    : 'bg-gray-600'
                }`}
              >
                Trạng thái: {order.status}
              </span>

              {order.status === 'pending' && (
                <>
                  <button
                    className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 rounded font-semibold"
                    onClick={() => handleAction(order._id, 'approve')}
                  >
                    ✅ Duyệt
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded font-semibold"
                    onClick={() => handleAction(order._id, 'cancel')}
                  >
                    ❌ Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplierOrderList;
