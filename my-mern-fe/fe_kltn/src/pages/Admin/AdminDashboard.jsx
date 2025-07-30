import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SalesChart from '../../components/SalesChart';
import ActiveUsersChart from '../../components/ActiveUsersChart';
import DottedGlobe from '../../components/DottedGlobe';

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApprovals: 0,
    totalSuppliers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    setAdminName(name);

    // Fetch dashboard stats
    axios.get('https://be-kltn-1.onrender.com/api/admins/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      // Mock data for now - replace with actual API response
      setStats({
        totalProducts: 1250,
        pendingApprovals: 23,
        totalSuppliers: 45,
        totalRevenue: 103430
      });
    })
    .catch(err => console.log('Error fetching dashboard data'));
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

  const SalesTable = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Country</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Country</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Sales</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Value</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Bounce</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 flex items-center">
                <span className="mr-2">🇺🇸</span>
                United States
              </td>
              <td className="py-3 px-4">2,500</td>
              <td className="py-3 px-4">$230,900</td>
              <td className="py-3 px-4">29.9%</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 flex items-center">
                <span className="mr-2">🇩🇪</span>
                Germany
              </td>
              <td className="py-3 px-4">3,900</td>
              <td className="py-3 px-4">$440,000</td>
              <td className="py-3 px-4">40.22%</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 flex items-center">
                <span className="mr-2">🇬🇧</span>
                Great Britain
              </td>
              <td className="py-3 px-4">1,400</td>
              <td className="py-3 px-4">$190,700</td>
              <td className="py-3 px-4">23.44%</td>
            </tr>
            <tr>
              <td className="py-3 px-4 flex items-center">
                <span className="mr-2">🇧🇷</span>
                Brasil
              </td>
              <td className="py-3 px-4">562</td>
              <td className="py-3 px-4">$143,960</td>
              <td className="py-3 px-4">32.14%</td>
            </tr>
          </tbody>
        </table>
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
              <span className="text-white text-sm font-bold">↑↑↑</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">DASHBOARDS</h3>
              <div className="space-y-1">
                <Link 
                  to="/admin" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                >
                  <span className="mr-3">🏠</span>
                  Default
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ADMIN PAGES</h3>
              <div className="space-y-1">
                <Link 
                  to="/admin/products" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">📦</span>
                  Tất cả sản phẩm
                </Link>
                <Link 
                  to="/admin/approve" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">✅</span>
                  Duyệt sản phẩm
                </Link>
                <Link 
                  to="/admin/reject" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">❌</span>
                  Từ chối sản phẩm
                </Link>
                <Link 
                  to="/admin/suppliers" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">👥</span>
                  Danh sách nhà cung cấp
                </Link>
                <Link 
                  to="/admin/supplier-products" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="mr-3">🏪</span>
                  Sản phẩm nhà cung cấp
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
                <h1 className="text-2xl font-bold text-gray-900 mt-2">General Statistics</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 max-w-4xl">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Today's Money"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change="+55%"
                changeType="positive"
                icon="💰"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
              <StatCard
                title="New Clients"
                value="+3,462"
                change="-2%"
                changeType="negative"
                icon="👥"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
              <StatCard
                title="Today's Users"
                value="2,300"
                change="+3%"
                changeType="positive"
                icon="⏰"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
              <StatCard
                title="Sales"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change="+5%"
                changeType="positive"
                icon="🛒"
                bgColor="bg-gradient-to-r from-purple-600 to-pink-600"
              />
            </div>

            {/* Sales by Country and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesTable />
              <SalesChart />
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

export default AdminDashboard;