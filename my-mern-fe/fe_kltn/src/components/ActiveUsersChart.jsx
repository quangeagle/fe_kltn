import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Đăng ký các component cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActiveUsersChart = () => {
  // Mock data for supplier performance metrics
  const performanceData = [75, 85, 92, 78, 88, 95, 82, 90, 87, 93, 89, 96];
  
  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Hiệu suất (%)',
        data: performanceData,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Hiệu suất: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return `${value}%`;
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
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất kinh doanh</h3>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Hiệu suất tháng</p>
            <p className="text-2xl font-bold">(+18%) so với tháng trước</p>
          </div>
        </div>
        
        {/* Performance Chart */}
        <div className="h-32 mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
        
        {/* Y-axis labels */}
        <div className="flex justify-between text-xs opacity-75 mb-4">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Supplier Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📦</span>
            <span className="text-sm">Sản phẩm</span>
          </div>
          <span className="font-bold">85</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">📊</span>
            <span className="text-sm">Đơn hàng</span>
          </div>
          <span className="font-bold">156</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">💰</span>
            <span className="text-sm">Doanh thu</span>
          </div>
          <span className="font-bold">45.6M</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">⭐</span>
            <span className="text-sm">Đánh giá</span>
          </div>
          <span className="font-bold">4.8</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersChart;