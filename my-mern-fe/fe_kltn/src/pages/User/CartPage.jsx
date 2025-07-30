import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CartPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://be-kltn-1.onrender.com/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data);
      } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error.response?.data || error.message);
      }
    };
    fetchCart();
  }, []);

  if (!cart) return <div className="text-white p-6">Đang tải giỏ hàng...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Giỏ Hàng</h1>
      {cart.items.length === 0 ? (
        <p>Giỏ hàng đang trống</p>
      ) : (
        <ul className="space-y-4">
          {cart.items.map((item) => (
            <li key={item._id} className="bg-gray-800 p-4 rounded">
              <div className="flex justify-between">
                <span>{item.product.name}</span>
                <span>{item.quantity} x {item.product.price?.toLocaleString()}₫</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;
