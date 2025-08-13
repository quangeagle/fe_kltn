import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    paymentMethod: 'cash',
  });

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://be-kltn-1.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Lỗi lấy giỏ hàng:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const fullAddress = `${form.address}, ${form.ward}, ${form.district}, ${form.province}`;
      await axios.post(
        'https://be-kltn-1.onrender.com/api/orders/place',
        {
          userId: cart.user,
          address: fullAddress,
          paymentMethod: form.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('🎉 Đặt hàng thành công!');
      window.location.href = '/home';
    } catch (err) {
      alert('❌ Lỗi đặt hàng');
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Đang tải...</div>
    </div>
  );

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QQ</span>
                </div>
                <span className="text-white font-bold text-xl">QuangEagle</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-white hover:text-purple-400 transition-colors">Home</Link>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">Tìm Kiếm</a>
                <Link to="/cart" className="text-white hover:text-purple-400 transition-colors">Giỏ Hàng</Link>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">Đăng Nhập</a>
                <Link to="/supplier/register" className="text-white hover:text-purple-400 transition-colors">Đăng Ký</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Wallet Connect</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold text-white mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-400 text-lg mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng</p>
            <Link 
              to="/cart" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <span className="text-white font-bold text-xl">NFT</span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Lorem ipsum dolor amet consectetur adipiscing elit do eiusmod tempor incididunt ut labore et dolore.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="text-center">
                <p className="text-gray-400">© Copyright 2025 - NFT, All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QQ</span>
              </div>
              <span className="text-white font-bold text-xl">QuangEagle</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-white hover:text-purple-400 transition-colors">Home</Link>
              <a href="#" className="text-white hover:text-purple-400 transition-colors">Tìm Kiếm</a>
              <Link to="/cart" className="text-white hover:text-purple-400 transition-colors">Giỏ Hàng</Link>
              <a href="#" className="text-white hover:text-purple-400 transition-colors">Đăng Nhập</a>
              <Link to="/supplier/register" className="text-white hover:text-purple-400 transition-colors">Đăng Ký</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Wallet Connect</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Checkout Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🧾 Đặt Hàng</h1>
            <p className="text-gray-400">Hoàn tất thông tin để đặt hàng</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Thông tin đặt hàng */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Thông Tin Đặt Hàng</h2>
              
              <div className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ và tên"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Địa chỉ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                    <select
                      name="province"
                      value={form.province}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Quận/Huyện</label>
                    <select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn quận/huyện</option>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận 2">Quận 2</option>
                      <option value="Quận 3">Quận 3</option>
                      <option value="Quận 4">Quận 4</option>
                      <option value="Quận 5">Quận 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Phường/Xã</label>
                    <select
                      name="ward"
                      value={form.ward}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn phường/xã</option>
                      <option value="Phường 1">Phường 1</option>
                      <option value="Phường 2">Phường 2</option>
                      <option value="Phường 3">Phường 3</option>
                      <option value="Phường 4">Phường 4</option>
                      <option value="Phường 5">Phường 5</option>
                    </select>
                  </div>
                </div>

                {/* Địa chỉ chi tiết */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Địa chỉ chi tiết</label>
                  <textarea
                    name="address"
                    placeholder="Số nhà, tên đường, tên khu phố..."
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Phương thức thanh toán</label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="cash">Thanh toán khi nhận hàng (COD)</option>
                    <option value="momo">Thanh toán qua Momo</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>
                    <option value="vnpay">Thanh toán qua VNPay</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Danh sách sản phẩm */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Sản Phẩm Đặt Hàng</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-1">
                        {item.product.price?.toLocaleString()}₫
                      </p>
                      <p className="text-gray-400 text-sm">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-purple-400 font-bold text-lg">
                        {(item.quantity * item.product.price)?.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng tiền */}
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-300">Tạm tính:</span>
                  <span className="text-white font-semibold">{total?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2">
                  <span className="text-gray-300">Phí vận chuyển:</span>
                  <span className="text-green-400">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-gray-600">
                  <span className="text-white">Tổng cộng:</span>
                  <span className="text-purple-400">{total?.toLocaleString()}₫</span>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Đặt Hàng Ngay</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-white font-bold text-xl">NFT</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Lorem ipsum dolor amet consectetur adipiscing elit do eiusmod tempor incididunt ut labore et dolore.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="text-center">
              <p className="text-gray-400">© Copyright 2025 - NFT, All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CheckoutPage;
