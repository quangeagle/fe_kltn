import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SalesChart from '../../components/SalesChart';
import ActiveUsersChart from '../../components/ActiveUsersChart';
import DottedGlobe from '../../components/DottedGlobe';
import RevenuePrediction from '../../components/RevenuePrediction';

const SupplierDashboard = () => {
  const [supplierName, setSupplierName] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    setSupplierName(name);

    // Fetch supplier dashboard stats - using mock data for now
    setStats({
      totalProducts: 85,
      totalOrders: 156,
      totalRevenue: 45680,
      pendingOrders: 12
    });

    // Fetch recent orders
    axios.get('https://be-kltn-1.onrender.com/api/orders/supplier', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      // Check if response has orders array or is direct array
      const ordersData = res.data.orders || res.data;
      setRecentOrders(ordersData.slice(0, 4)); // Get latest 4 orders
      setLoading(false);
    })
    .catch(err => {
      console.log('Error fetching recent orders:', err);
      setLoading(false);
    });
  }, []);

  const StatCard = ({ title, value, change, changeType, icon, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'đã giao':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã giao</span>;
      case 'processing':
      case 'đang xử lý':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Đang xử lý</span>;
      case 'shipping':
      case 'đang vận chuyển':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Đang vận chuyển</span>;
      case 'pending':
      case 'chờ xác nhận':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Chờ xác nhận</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status || 'Không xác định'}</span>;
    }
  };

  const OrdersTable = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-2xl">📦</span>
            <p className="mt-2">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Mã đơn hàng</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Khách hàng</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sản phẩm</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
                             {recentOrders.map((order, index) => (
                 <tr key={order._id || index} className="border-b border-gray-100">
                   <td className="py-3 px-4">#{order.orderId || order._id?.slice(-6) || `ORD-${String(index + 1).padStart(3, '0')}`}</td>
                   <td className="py-3 px-4">{order.user?.fullName || order.user?.name || order.customerName || 'Khách hàng'}</td>
                   <td className="py-3 px-4">
                     {order.items?.length > 0 
                       ? order.items[0]?.product?.name || order.items[0]?.name || 'Sản phẩm'
                       : order.products?.length > 0 
                         ? order.products[0]?.product?.name || order.products[0]?.name || 'Sản phẩm'
                         : 'N/A'
                     }
                     {(order.items?.length > 1 || order.products?.length > 1) && 
                       ` +${(order.items?.length || order.products?.length || 0) - 1} sản phẩm khác`
                     }
                   </td>
                   <td className="py-3 px-4">
                     {getStatusBadge(order.status)}
                   </td>
                   <td className="py-3 px-4">₫{order.totalAmount?.toLocaleString() || order.total?.toLocaleString() || '0'}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">🏪</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Supplier Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">DASHBOARDS</h3>
              <div className="space-y-1">
                <Link 
                  to="/supplier" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                >
                  <span className="mr-3">🏠</span>
                  Default
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SUPPLIER PAGES</h3>
              <div className="space-y-1">
                <Link 
                  to="/supplier/products" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">📦</span>
                  Sản phẩm của tôi
                </Link>
                <Link 
                  to="/supplier/create-product" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">➕</span>
                  Thêm sản phẩm mới
                </Link>
                <Link 
                  to="/supplier/orders" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">📋</span>
                  Quản lý đơn hàng
                </Link>
                <Link 
                  to="/supplier/profile" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">👤</span>
                  Thông tin cá nhân
                </Link>
                <Link 
                  to="/supplier/analytics" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">📊</span>
                  Báo cáo thống kê
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Globe Background */}
        <DottedGlobe />

        {/* Content */}
        <div className="relative z-10 h-full overflow-auto">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <div className="flex items-center">
                        <span className="text-gray-400">🏠</span>
                        <span className="ml-4 text-sm font-medium text-gray-500">Pages</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <span className="text-gray-400">/</span>
                        <span className="ml-4 text-sm font-medium text-gray-900">Default</span>
                      </div>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Thống kê tổng quan</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Cập nhật
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 max-w-4xl">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tổng sản phẩm"
                value={stats.totalProducts}
                change="+12%"
                changeType="positive"
                icon="📦"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
              <StatCard
                title="Đơn hàng hôm nay"
                value={stats.totalOrders}
                change="+8%"
                changeType="positive"
                icon="📋"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
              <StatCard
                title="Doanh thu tháng"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change="+15%"
                changeType="positive"
                icon="💰"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
              <StatCard
                title="Đơn hàng chờ xử lý"
                value={stats.pendingOrders}
                change="-3%"
                changeType="negative"
                icon="⏳"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
            </div>

            {/* Orders Table and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OrdersTable />
              <SalesChart />
            </div>

            {/* Revenue Prediction */}
            <div className="mt-6">
              <RevenuePrediction />
            </div>

            {/* Active Users Card */}
            <div className="mt-6">
              <ActiveUsersChart />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              © 2025, made with ❤️ by Quang Eagle for a better web.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard; 