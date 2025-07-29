import React from 'react';

const ActiveUsersChart = () => {
  // Mock data for bars
  const barData = [65, 45, 80, 35, 60, 75, 50, 85, 40, 70, 55, 90];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Active Users</p>
            <p className="text-2xl font-bold">(+23%) than last week</p>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="h-32 flex items-end justify-between mb-6">
          {barData.map((height, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-30 rounded-t"
              style={{
                width: '6px',
                height: `${height}%`,
                minHeight: '4px'
              }}
            />
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="flex justify-between text-xs opacity-75 mb-4">
          <span>0</span>
          <span>200</span>
          <span>400</span>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">👤</span>
              <span className="text-sm">Users</span>
            </div>
            <span className="font-bold">36K</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">🚀</span>
              <span className="text-sm">Clicks</span>
            </div>
            <span className="font-bold">2m</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span className="text-sm">Sales</span>
            </div>
            <span className="font-bold">435$</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">⭐</span>
              <span className="text-sm">Items</span>
            </div>
            <span className="font-bold">43</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersChart;