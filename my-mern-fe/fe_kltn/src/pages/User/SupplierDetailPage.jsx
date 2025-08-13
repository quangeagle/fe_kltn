import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function SupplierDetailPage() {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    const fetchSupplierDetail = async () => {
      try {
        const res = await axios.get(`https://be-kltn-1.onrender.com/api/suppliers/supplier/${supplierId}`);
        setSupplier(res.data.supplier);
        
        // Fetch supplier's products
        const productsRes = await axios.get(`https://be-kltn-1.onrender.com/api/products/supplier/${supplierId}`);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('Lỗi lấy chi tiết cửa hàng:', error);
      }
      setLoading(false);
    };

    fetchSupplierDetail();
  }, [supplierId]);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://be-kltn-1.onrender.com/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Đã thêm vào giỏ hàng!');
    } catch (error) {
      console.error('❌ Thêm vào giỏ hàng lỗi:', error.response?.data || error.message);
      alert('Lỗi khi thêm vào giỏ hàng!');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Đang tải dữ liệu...</div>
    </div>
  );

  if (!supplier) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Không tìm thấy cửa hàng</div>
    </div>
  );

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

      {/* Shop Profile Banner */}
      <div className="relative">
        {/* Banner Background */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white opacity-30">
              <div className="text-2xl font-bold mb-2">Shop Nhân Ngày Ưu Đãi</div>
              <div className="text-lg">giảm giá từ shop</div>
            </div>
          </div>
        </div>

        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-purple-600 font-bold text-xl">
                {supplier.storeName?.charAt(0) || 'S'}
              </span>
            </div>

            {/* Shop Details */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold mb-2">{supplier.storeName || 'Cửa hàng'}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Online</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  Yêu Thích+
                </button>
                <button className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Theo Dõi</span>
                </button>
                <button className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Statistics */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Sản Phẩm</div>
                <div className="text-purple-400 font-semibold">{products.length}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Đang Theo</div>
                <div className="text-purple-400 font-semibold">{(Math.random() * 10 + 1).toFixed(0)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Tỉ Lệ Phản Hồi Chat</div>
                <div className="text-purple-400 font-semibold">100% (Trong Vài Giờ)</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Người Theo Dõi</div>
                <div className="text-purple-400 font-semibold">{(Math.random() * 100 + 50).toFixed(1)}k</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Đánh Giá</div>
                <div className="text-purple-400 font-semibold">{(Math.random() * 2 + 4).toFixed(1)} ({(Math.random() * 100 + 50).toFixed(1)}k Đánh Giá)</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Tham Gia</div>
                <div className="text-purple-400 font-semibold">{(Math.random() * 5 + 1).toFixed(0)} Năm Trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'browse', label: 'Dạo' },
              { id: 'products', label: 'Sản phẩm' },
              { id: 'gifts', label: 'SĂN QUÀ 0Đ' },
              { id: 'topsale', label: 'TOP SALE' },
              { id: 'sale', label: 'SALE UPTO 50%' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                  <div className="relative mb-4">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                      <span>❤️</span>
                      <span>{(Math.random() * 5 + 0.5).toFixed(1)}K</span>
                    </div>
                  </div>

                  <Link to={`/product/${product._id}`} className="text-white font-semibold mb-2 hover:text-purple-400 transition-colors block">
                    {product.name}
                  </Link>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description || 'Không có mô tả'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold text-lg">
                      {product.price?.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Thêm vào giỏ
                    </button>
                    <Link 
                      to={`/product/${product._id}`}
                      className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-white mb-2">Chào mừng đến với {supplier.storeName}</h3>
              <p className="text-gray-400">Khám phá các sản phẩm chất lượng từ cửa hàng này</p>
            </div>
          )}

          {activeTab === 'gifts' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-white mb-2">Săn quà 0đ</h3>
              <p className="text-gray-400">Các chương trình khuyến mãi đặc biệt</p>
            </div>
          )}

          {activeTab === 'topsale' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-white mb-2">Top Sale</h3>
              <p className="text-gray-400">Những sản phẩm bán chạy nhất</p>
            </div>
          )}

          {activeTab === 'sale' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-white mb-2">Sale Up To 50%</h3>
              <p className="text-gray-400">Giảm giá lên đến 50%</p>
            </div>
          )}
        </div>
      </div>

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

export default SupplierDetailPage; 