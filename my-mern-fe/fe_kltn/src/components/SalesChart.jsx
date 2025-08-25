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

const SalesChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Decode JWT token to get supplier ID
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }
        
        const payload = JSON.parse(atob(tokenParts[1]));
        const supplierId = payload.id;
        
        const response = await axios.get(`https://be-kltn-1.onrender.com/api/revenue/${supplierId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // If API returns data, use it; otherwise use mock data
        if (response.data && response.data.length > 0) {
          setRevenueData(response.data);
        } else {
          console.log('API returned no data, using mock data for demo');
          setRevenueData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        console.log('Using mock data due to API error');
        setRevenueData([]);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Chuẩn bị dữ liệu cho Chart.js
  const chartData = {
    labels: revenueData.map(item => `Tuần ${item.weekOfYear}`),
    datasets: [
      {
        label: 'Doanh thu tuần (₫)',
        data: revenueData.map(item => item.actualWeeklySales),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
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
            size: 12,
            weight: 'bold'
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
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Doanh thu: ₫${context.parsed.y.toLocaleString()}`;
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
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgb(236, 72, 153)',
        hoverBorderColor: '#fff',
        hoverBorderWidth: 3
      }
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tuần</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tuần</h3>
      <p className="text-sm text-gray-600 mb-6">
        {revenueData.length > 0 
          ? `Tổng doanh thu: ₫${revenueData.reduce((sum, item) => sum + item.actualWeeklySales, 0).toLocaleString()}`
          : 'Chưa có dữ liệu doanh thu'
        }
      </p>
      
      {/* Chart Container */}
      <div className="h-64 mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {/* Revenue details */}
      {revenueData.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Tuần cao nhất</p>
            <p className="text-lg font-semibold text-green-600">
              ₫{Math.max(...revenueData.map(item => item.actualWeeklySales)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Tuần thấp nhất</p>
            <p className="text-lg font-semibold text-red-600">
              ₫{Math.min(...revenueData.map(item => item.actualWeeklySales)).toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Doanh thu tuần (₫)</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;