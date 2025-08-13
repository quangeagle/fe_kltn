import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        
        setRevenueData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Calculate chart data
  const maxRevenue = Math.max(...revenueData.map(item => item.actualWeeklySales || 0), 1);
  const chartData = revenueData.map((item, index) => ({
    week: `Week ${item.weekOfYear}`,
    revenue: item.actualWeeklySales || 0,
    percentage: ((item.actualWeeklySales || 0) / maxRevenue) * 100,
    date: new Date(item.weekStart).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
  }));

  // For single data point, create a more visible line
  const generatePath = (data) => {
    if (data.length === 0) return '';
    
    if (data.length === 1) {
      // Create a diagonal line for single data point to make it more visible
      const y = 100 - data[0].percentage;
      return `M 10 ${y} L 90 ${y}`;
    }
    
    const points = data.map((item, index) => {
      const x = 10 + (index / (data.length - 1)) * 80; // Add padding
      const y = 100 - item.percentage;
      return `${x} ${y}`;
    });
    
    return `M ${points.join(' L ')}`;
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
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>₫{(maxRevenue * 0.8).toLocaleString()}</span>
          <span>₫{(maxRevenue * 0.6).toLocaleString()}</span>
          <span>₫{(maxRevenue * 0.4).toLocaleString()}</span>
          <span>₫{(maxRevenue * 0.2).toLocaleString()}</span>
          <span>₫0</span>
        </div>
        
        {/* Chart Area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-200"
                style={{ top: `${(i * 25)}%` }}
              />
            ))}
          </div>
          
                     {/* Chart line */}
           {chartData.length > 0 && (
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               {/* Revenue line */}
               <path
                 d={generatePath(chartData)}
                 stroke="#ec4899"
                 strokeWidth="3"
                 fill="none"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
               
                               {/* Data points */}
                {chartData.map((item, index) => {
                  const x = chartData.length === 1 ? 50 : 10 + (index / (chartData.length - 1)) * 80;
                  const y = 100 - item.percentage;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#ec4899"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
             </svg>
           )}
          
                     {/* X-axis labels */}
           {chartData.length > 0 && (
             <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
               {chartData.length === 1 ? (
                 <span className="transform -rotate-45 origin-left">
                   {chartData[0].week}
                 </span>
               ) : (
                 chartData.map((item, index) => (
                   <span key={index} className="transform -rotate-45 origin-left">
                     {item.week}
                   </span>
                 ))
               )}
             </div>
           )}
        </div>
      </div>
      
      {/* Revenue details */}
      {chartData.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Tuần cao nhất</p>
            <p className="text-lg font-semibold text-green-600">
              ₫{Math.max(...chartData.map(item => item.revenue)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Tuần thấp nhất</p>
            <p className="text-lg font-semibold text-red-600">
              ₫{Math.min(...chartData.map(item => item.revenue)).toLocaleString()}
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