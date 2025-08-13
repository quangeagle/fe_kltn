// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function CartPage() {
//   const [cart, setCart] = useState(null);

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('https://be-kltn-1.onrender.com/api/cart', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCart(res.data);
//       } catch (error) {
//         console.error('Lỗi lấy giỏ hàng:', error.response?.data || error.message);
//       }
//     };
//     fetchCart();
//   }, []);

//   if (!cart) return <div className="text-white p-6">Đang tải giỏ hàng...</div>;

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6">🛒 Giỏ Hàng</h1>
//       {cart.items.length === 0 ? (
//         <p>Giỏ hàng đang trống</p>
//       ) : (
//         <ul className="space-y-4">
//           {cart.items.map((item) => (
//             <li key={item._id} className="bg-gray-800 p-4 rounded">
//               <div className="flex justify-between">
//                 <span>{item.product.name}</span>
//                 <span>{item.quantity} x {item.product.price?.toLocaleString()}₫</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default CartPage;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://be-kltn-1.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://be-kltn-1.onrender.com/api/cart/update-quantity',
        { productId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // Cập nhật lại giỏ hàng sau khi thay đổi
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error.response?.data || error.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://be-kltn-1.onrender.com/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart(); // Cập nhật lại giỏ hàng sau khi xóa
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error.response?.data || error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Đang tải giỏ hàng...</div>
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

        {/* Empty Cart Section */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold text-white mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-400 text-lg mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link 
              to="/products" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Mua sắm ngay</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Identity Section */}
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
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-purple-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About company</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Company services</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Job opportunities</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact us</a></li>
                </ul>
              </div>

              {/* Customer Column */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Customer</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Client support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Latest news</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Company Details</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Who we are</a></li>
                </ul>
              </div>

              {/* Newsletter Subscription Section */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Subscribe Now</h3>
                <p className="text-gray-400 mb-4">
                  Enter your email address for receiving valuable newsletters.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-r-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-gray-700">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="text-center">
                <p className="text-gray-400">
                  © Copyright 2025 - NFT, All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

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

      {/* Cart Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🛒 Giỏ Hàng</h1>
            <p className="text-gray-400">Quản lý sản phẩm trong giỏ hàng của bạn</p>
          </div>

          {/* Cart Items */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-white mb-6">Sản phẩm ({cart.items.length})</h2>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product.images ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-lg truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">
                              {item.product.description?.substring(0, 100)}...
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleUpdateQuantity(item.product._id, 'decrease')}
                                  className="w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="text-white font-bold text-lg px-4">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.product._id, 'increase')}
                                  className="w-8 h-8 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-purple-400 font-semibold text-lg">
                                  {(item.quantity * item.product.price)?.toLocaleString()}₫
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {item.product.price?.toLocaleString()}₫/sản phẩm
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.product._id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 sticky top-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Tóm tắt đơn hàng</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-300">
                        <span>Tạm tính:</span>
                        <span>{totalAmount.toLocaleString()}₫</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Phí vận chuyển:</span>
                        <span>Miễn phí</span>
                      </div>
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between text-white font-bold text-lg">
                          <span>Tổng cộng:</span>
                          <span className="text-purple-400">{totalAmount.toLocaleString()}₫</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => (window.location.href = '/order')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Tiến hành đặt hàng</span>
                    </button>

                    <div className="mt-4 text-center">
                      <Link 
                        to="/products" 
                        className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      >
                        ← Tiếp tục mua sắm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Identity Section */}
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
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About company</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Company services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Job opportunities</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact us</a></li>
              </ul>
            </div>

            {/* Customer Column */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Customer</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Client support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Latest news</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Company Details</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Who we are</a></li>
              </ul>
            </div>

            {/* Newsletter Subscription Section */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Subscribe Now</h3>
              <p className="text-gray-400 mb-4">
                Enter your email address for receiving valuable newsletters.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-r-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="text-center">
              <p className="text-gray-400">
                © Copyright 2025 - NFT, All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CartPage;