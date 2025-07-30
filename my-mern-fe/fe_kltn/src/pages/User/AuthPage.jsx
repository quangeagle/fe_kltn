import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        navigate("/supplier");
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'password' 
                    ? 'text-black' 
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('password')}
              >
                Password
              </button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <button 
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  activeTab === 'phone' 
                    ? 'text-black' 
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('phone')}
              >
                Phone Number
              </button>
            </div>
          </div>
          <button className="text-black hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email/Phone Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Please enter your Phone or Email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Please enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-gray-500 text-sm hover:text-gray-700">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button 
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            LOGIN
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-500 text-sm">Don't have an account? </span>
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
              Sign up
            </a>
          </div>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or, login with</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => handleSocialLogin('Google')}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  G
                </div>
                <span className="text-gray-700 font-medium">Google</span>
              </button>

              <button 
                onClick={() => handleSocialLogin('Facebook')}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  f
                </div>
                <span className="text-gray-700 font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
