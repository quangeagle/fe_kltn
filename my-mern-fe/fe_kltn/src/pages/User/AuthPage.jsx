import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AuthPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    console.log("Bắt đầu đăng nhập...");
    console.log("Input:", { emailOrUsername, password });
  
    try {
      const loginUser = axios.post('https://be-kltn-1.onrender.com/api/users/login', {
        email: emailOrUsername,
        password,
      });
  
      const loginSupplier = axios.post('https://be-kltn-1.onrender.com/api/suppliers/login', {
        email: emailOrUsername,
        password,
      });
  
      const loginAdmin = axios.post('https://be-kltn-1.onrender.com/api/admins/login', {
        username: emailOrUsername,
        password,
      });
  
      const result = await Promise.any([loginUser, loginSupplier, loginAdmin]);
      console.log("🎯 Đăng nhập thành công. Dữ liệu trả về:", result.data);
  
      const { token, role, name } = result.data;
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
  
      if (role === "user") {
        navigate("/home");
      } else if (role === "supplier") {
        navigate("/supplier/dashboard");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        alert("Không xác định được loại tài khoản!");
      }
    } catch (err) {
      console.error("🚨 Đăng nhập thất bại toàn bộ:", err);
      alert("Đăng nhập thất bại! Sai thông tin hoặc lỗi server.");
    }
  };
  
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic here
  };

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

      {/* Auth Section */}
      <section className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QQ</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                      activeTab === 'password' 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('password')}
                  >
                    Password
                  </button>
                  <div className="w-px h-4 bg-gray-600 mx-2"></div>
                  <button 
                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                      activeTab === 'phone' 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab('phone')}
                  >
                    Phone Number
                  </button>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email/Phone Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Please enter your Phone or Email"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Please enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                LOGIN
              </button>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-gray-400 text-sm">Don't have an account? </span>
                <Link to="/supplier/register" className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">
                  Sign up
                </Link>
              </div>

              {/* Social Login */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">Or, login with</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleSocialLogin('Google')}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-5 h-5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      G
                    </div>
                    <span className="font-medium">Google</span>
                  </button>

                  <button 
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      f
                    </div>
                    <span className="font-medium">Facebook</span>
                  </button>
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

export default AuthPage;
