import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Đăng ký các component cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenuePrediction = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không có token xác thực');
        setLoading(false);
        return;
      }

      // Decode JWT token to get supplier ID
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        setError('Token không hợp lệ');
        setLoading(false);
        return;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const supplierId = payload.id;

      console.log('🔍 Fetching revenue data for supplier:', supplierId);

      // Gọi API doanh thu thực tế
      const response = await axios.get(`https://be-kltn-1.onrender.com/api/revenue/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.length > 0) {
        // Lọc chỉ lấy dữ liệu có doanh thu thực tế
        const realRevenueData = response.data.filter(item => 
          item.revenue && item.revenue > 0
        );
        
        if (realRevenueData.length > 0) {
          setRevenueData(realRevenueData);
          console.log('✅ Revenue data loaded from API:', realRevenueData);
        } else {
          setError('Không có dữ liệu doanh thu thực tế');
        }
      } else {
        setError('API không trả về dữ liệu');
      }
    } catch (error) {
      console.error('❌ Error fetching revenue data:', error);
      setError(`Lỗi khi tải dữ liệu: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Chuẩn bị dữ liệu cho Chart.js
  const getChartData = () => {
    if (!revenueData || revenueData.length === 0) return null;

    // Sắp xếp dữ liệu theo tuần
    const sortedData = [...revenueData].sort((a, b) => a.weekOfYear - b.weekOfYear);
    
    console.log('✅ Chart data prepared:', sortedData);
    
    return {
      labels: sortedData.map(item => `Tuần ${item.weekOfYear}`),
      datasets: [
        {
          label: 'Doanh thu tuần (₫)',
          data: sortedData.map(item => item.revenue || 0),
          borderColor: 'rgb(236, 72, 153)',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(236, 72, 153)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(236, 72, 153)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₫${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return `₫${(value / 1000000).toFixed(1)}M`;
          },
          font: {
            size: 11
          },
          padding: 10
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          padding: 10
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tuần</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu doanh thu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tuần</h3>
        <div className="text-center py-8 text-red-500">
          <span className="text-2xl">❌</span>
          <p className="mt-2">{error}</p>
          <button
            onClick={fetchRevenueData}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!revenueData || revenueData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tuần</h3>
        <div className="text-center py-8 text-gray-500">
          <span className="text-2xl">📊</span>
          <p className="mt-2">Chưa có dữ liệu doanh thu</p>
          <p className="text-sm mt-1">Dữ liệu sẽ hiển thị khi có doanh thu thực tế</p>
        </div>
      </div>
    );
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const maxRevenue = Math.max(...revenueData.map(item => item.revenue || 0));
  const minRevenue = Math.min(...revenueData.map(item => item.revenue || 0));
  const avgRevenue = Math.round(totalRevenue / revenueData.length);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tuần</h3>
        <button
          onClick={fetchRevenueData}
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Tổng doanh thu */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">Tổng doanh thu</p>
        <p className="text-2xl font-bold text-green-600">
          ₫{totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* Biểu đồ doanh thu */}
      {getChartData() && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Biểu đồ doanh thu theo tuần</h4>
          <div className="h-64 mb-4">
            <Line data={getChartData()} options={chartOptions} />
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Doanh thu tuần (₫)</span>
            </div>
          </div>
        </div>
      )}

      {/* Thống kê tóm tắt */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Trung bình/tuần</p>
          <p className="text-lg font-semibold text-blue-600">
            ₫{avgRevenue.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Tuần cao nhất</p>
          <p className="text-lg font-semibold text-green-600">
            ₫{maxRevenue.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Tuần thấp nhất</p>
          <p className="text-lg font-semibold text-red-600">
            ₫{minRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bảng dữ liệu chi tiết */}
      <div className="mt-8">
        <h4 className="font-semibold text-gray-900 mb-4">Chi tiết doanh thu các tuần</h4>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Tuần
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Doanh thu (₫)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  % so với TB
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData
                .sort((a, b) => a.weekOfYear - b.weekOfYear)
                .map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                      Tuần {item.weekOfYear}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600 border-b">
                      ₫{item.revenue?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.revenue > avgRevenue ? 'bg-green-100 text-green-800' :
                        item.revenue < avgRevenue ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {avgRevenue > 0 ? ((item.revenue / avgRevenue) * 100).toFixed(1) : '0.0'}%
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenuePrediction;
