import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RevenuePrediction = () => {
  const [currentWeekData, setCurrentWeekData] = useState(null);
  const [nextWeekPrediction, setNextWeekPrediction] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [predictionLogs, setPredictionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  
  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    year: '',
    weekOfYear: ''
  });

  useEffect(() => {
    fetchPredictionData();
    fetchPredictionLogs();
  }, [currentPage, filters]);

  const fetchPredictionData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Decode JWT token to get supplier ID
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const supplierId = payload.id;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch current week data
      try {
        const currentWeekResponse = await axios.get(`https://be-kltn-1.onrender.com/api/predict/${supplierId}/current-week`);
        setCurrentWeekData(currentWeekResponse.data);
      } catch (error) {
        console.error('Error fetching current week data:', error);
        setCurrentWeekData(null);
      }

      // Initialize next week prediction as null
      setNextWeekPrediction(null);

      // Fetch summary data
      try {
        const summaryResponse = await axios.get(`https://be-kltn-1.onrender.com/api/predict/${supplierId}/summary`);
        setSummaryData(summaryResponse.data || []);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setSummaryData([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in fetchPredictionData:', error);
      setLoading(false);
    }
  };

  const fetchPredictionLogs = async () => {
    try {
      setLogsLoading(true);
      const token = localStorage.getItem('token');
      
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const supplierId = payload.id;

      const params = new URLSearchParams({
        page: currentPage,
        limit: limit
      });

      if (filters.year) params.append('year', filters.year);
      if (filters.weekOfYear) params.append('weekOfYear', filters.weekOfYear);

      const response = await axios.get(
        `https://be-kltn-1.onrender.com/api/predict/${supplierId}/prediction-logs?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPredictionLogs(response.data.data || []);
      // Calculate total pages based on total count (assuming backend returns total)
      // For now, we'll estimate based on current data length
      setTotalPages(Math.ceil((response.data.data?.length || 0) / limit));
      setLogsLoading(false);
    } catch (error) {
      console.error('Error fetching prediction logs:', error);
      setLogsLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const handlePredictNextWeek = async () => {
    try {
      setPredicting(true);
      
      const token = localStorage.getItem('token');
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const supplierId = payload.id;
  
      // Gọi API dự đoán
      console.log('Calling prediction API...');
      const response = await axios.post(`https://be-kltn-1.onrender.com/api/predict/${supplierId}`);
      
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      console.log('XGB value:', response.data.xgb);
      console.log('GRU value:', response.data.gru);
  
      const newPrediction = {
        predictedRevenue: response.data.xgb,
        predictedByXGB: response.data.xgb,
        predictedByGRU: response.data.gru,
        confidence: 85
      };
  
      setNextWeekPrediction(null);
      setTimeout(() => {
        setNextWeekPrediction(newPrediction);
      }, 100);
      console.log('Response từ POST /predict:', response.data);
      setPredicting(false);
      console.log('✅ Prediction completed successfully');
      
      // Refresh logs after prediction
      fetchPredictionLogs();
    } catch (error) {
      console.error('❌ Error predicting next week:', error);
      alert('Lỗi khi dự đoán: ' + (error.response?.data?.error || error.message));
      setPredicting(false);
    }
  };
  

  const generateChartPath = (data) => {
    if (!data || data.length === 0) return '';
    
    // Filter out invalid data points
    const validData = data.filter(item => 
      item.percentage !== undefined && 
      item.percentage !== null && 
      !isNaN(item.percentage) &&
      item.percentage >= 0 &&
      item.percentage <= 100
    );
    
    if (validData.length === 0) {
      console.log('No valid data points for chart path');
      return '';
    }
    
    const points = validData.map((item, index) => {
      // Handle single data point case
      const x = validData.length === 1 ? 50 : 10 + (index / (validData.length - 1)) * 80;
      const y = Math.max(0, Math.min(100, 100 - (item.percentage || 0)));
      console.log(`Point ${index}: x=${x}, y=${y}, percentage=${item.percentage}`);
      return `${x} ${y}`;
    });
    
    const path = `M ${points.join(' L ')}`;
    console.log('Generated chart path:', path);
    return path;
  };

  const calculateAccuracy = (predicted, actual) => {
    if (!actual || actual === 0 || !predicted || predicted === 0) return 0;
    const accuracy = Math.round(((actual - Math.abs(predicted - actual)) / actual) * 100);
    return Math.max(0, Math.min(100, accuracy)); // Ensure accuracy is between 0-100
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dự đoán doanh thu</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Dự đoán doanh thu</h3>
        <button
          onClick={handlePredictNextWeek}
          disabled={predicting}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {predicting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
              Đang dự đoán... (có thể mất 10-30 giây)
            </>
          ) : (
            '🔮 Dự đoán tuần tới'
          )}
        </button>
      </div>

      {/* Current Week vs Prediction */}
      {currentWeekData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📊 Tuần hiện tại</h4>
            <div className="space-y-2">
                               <div className="flex justify-between">
                   <span className="text-sm text-gray-600">Tuần:</span>
                   <span className="font-semibold">W{currentWeekData.weekOfYear}</span>
                 </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dự đoán (XGB):</span>
                <span className="font-semibold">₫{currentWeekData.predictedByXGB?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dự đoán (GRU):</span>
                <span className="font-semibold">₫{currentWeekData.predictedByGRU?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Thực tế:</span>
                <span className="font-semibold text-green-600">₫{currentWeekData.actualWeeklySales?.toLocaleString() || 'Chưa có'}</span>
              </div>
              {currentWeekData.predictedByXGB && currentWeekData.actualWeeklySales && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sai số (XGB):</span>
                  <span className={`font-semibold ${Math.abs(currentWeekData.predictedByXGB - currentWeekData.actualWeeklySales) < 100000 ? 'text-green-600' : 'text-yellow-600'}`}>
                    ₫{Math.abs(currentWeekData.predictedByXGB - currentWeekData.actualWeeklySales).toLocaleString()}
                  </span>
                </div>
              )}
              {currentWeekData.predictedByGRU && currentWeekData.actualWeeklySales && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sai số (GRU):</span>
                  <span className={`font-semibold ${Math.abs(currentWeekData.predictedByGRU - currentWeekData.actualWeeklySales) < 100000 ? 'text-green-600' : 'text-yellow-600'}`}>
                    ₫{Math.abs(currentWeekData.predictedByGRU - currentWeekData.actualWeeklySales).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">🔮 Tuần tới </h4>
            <div className="space-y-2">
              {nextWeekPrediction ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dự đoán (XGB):</span>
                    <span className="font-semibold text-purple-600">
                      ₫{nextWeekPrediction.predictedByXGB.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dự đoán (GRU):</span>
                    <span className="font-semibold text-purple-600">
                      ₫{nextWeekPrediction.predictedByGRU.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Độ tin cậy:</span>
                    <span className="font-semibold text-blue-600">
                      {nextWeekPrediction.confidence}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-2 text-gray-500">
                  Chưa có dự đoán
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <span className="text-2xl">📊</span>
          <p className="mt-2">Chưa có dữ liệu dự đoán</p>
        </div>
      )}

      {/* Prediction Chart */}
      {summaryData.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Biểu đồ dự đoán tuần {summaryData[0]?.weekOfYear}</h4>
          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>₫{(Math.max(summaryData[0]?.predictedByXGB || 0, summaryData[0]?.predictedByGRU || 0, summaryData[0]?.actualWeeklySales || 0)).toLocaleString()}</span>
              <span>₫{(Math.max(summaryData[0]?.predictedByXGB || 0, summaryData[0]?.predictedByGRU || 0, summaryData[0]?.actualWeeklySales || 0) * 0.75).toLocaleString()}</span>
              <span>₫{(Math.max(summaryData[0]?.predictedByXGB || 0, summaryData[0]?.predictedByGRU || 0, summaryData[0]?.actualWeeklySales || 0) * 0.5).toLocaleString()}</span>
              <span>₫{(Math.max(summaryData[0]?.predictedByXGB || 0, summaryData[0]?.predictedByGRU || 0, summaryData[0]?.actualWeeklySales || 0) * 0.25).toLocaleString()}</span>
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
              
              {/* Chart lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* XGB Predicted line */}
                <path
                  d={generateChartPath([{
                    percentage: summaryData[0]?.predictedByXGB ? 
                      (summaryData[0].predictedByXGB / Math.max(summaryData[0].predictedByXGB, summaryData[0].predictedByGRU, summaryData[0].actualWeeklySales)) * 100 
                      : 0
                  }])}
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5,5"
                />
               
                {/* GRU Predicted line */}
                <path
                  d={generateChartPath([{
                    percentage: summaryData[0]?.predictedByGRU ? 
                      (summaryData[0].predictedByGRU / Math.max(summaryData[0].predictedByXGB, summaryData[0].predictedByGRU, summaryData[0].actualWeeklySales)) * 100 
                      : 0
                  }])}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3,3"
                />
              
                {/* Actual line */}
                <path
                  d={generateChartPath([{
                    percentage: summaryData[0]?.actualWeeklySales ? 
                      (summaryData[0].actualWeeklySales / Math.max(summaryData[0].predictedByXGB, summaryData[0].predictedByGRU, summaryData[0].actualWeeklySales)) * 100 
                      : 0
                  }])}
                  stroke="#ec4899"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
                             {/* X-axis labels */}
               <div className="absolute bottom-0 left-0 right-0 flex justify-center text-xs text-gray-500 mt-2">
                 <span className="transform -rotate-45 origin-left">
                   Tuần {summaryData[0]?.weekOfYear}
                 </span>
               </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Dự đoán XGB</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Dự đoán GRU</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Thực tế</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {summaryData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Tuần</p>
            <p className="text-lg font-semibold text-green-600">
              {summaryData[0]?.weekOfYear || 'N/A'}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Năm</p>
            <p className="text-lg font-semibold text-blue-600">
              {summaryData[0]?.year || 'N/A'}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Doanh thu thực tế</p>
            <p className="text-lg font-semibold text-purple-600">
              ₫{summaryData[0]?.actualWeeklySales?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 mb-6">
          <p>Chưa có dữ liệu thống kê</p>
        </div>
      )}

      {/* Prediction Logs Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Lịch sử dự đoán</h4>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Năm:</label>
              <input
                type="number"
                placeholder="Năm"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Tuần:</label>
              <input
                type="number"
                placeholder="Tuần"
                value={filters.weekOfYear}
                onChange={(e) => handleFilterChange('weekOfYear', e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <button
              onClick={() => {
                setFilters({ year: '', weekOfYear: '' });
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {logsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Đang tải lịch sử...</span>
          </div>
        ) : predictionLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-2xl">📊</span>
            <p className="mt-2">Chưa có lịch sử dự đoán</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Tuần
                    </th>
                    
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Doanh thu thực tế
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Dự đoán GRU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Dự đoán XGB
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Độ chính xác GRU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Độ chính xác XGB
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictionLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                                             <td className="px-4 py-3 text-sm text-gray-900 border-b">
                         W{log.weekOfYear}
                       </td>
                      
                      <td className="px-4 py-3 text-sm font-medium text-green-600 border-b">
                        ₫{log.actualWeeklySales?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        ₫{log.predictedByGRU?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        ₫{log.predictedByXGB?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.accuracyGRU >= 90 ? 'bg-green-100 text-green-800' :
                          log.accuracyGRU >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.accuracyGRU?.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.accuracyXGB >= 90 ? 'bg-green-100 text-green-800' :
                          log.accuracyXGB >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.accuracyXGB?.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                                 </tbody>
                 
                 {/* Summary Row */}
                 <tfoot className="bg-gray-100">
                   <tr className="border-t-2 border-gray-300">
                     <td className="px-4 py-3 text-sm font-bold text-gray-900 border-b">
                       Trung bình
                     </td>
                     <td className="px-4 py-3 text-sm font-bold text-green-600 border-b">
                       -
                     </td>
                     <td className="px-4 py-3 text-sm font-bold text-gray-900 border-b">
                       -
                     </td>
                     <td className="px-4 py-3 text-sm font-bold text-gray-900 border-b">
                       -
                     </td>
                     <td className="px-4 py-3 text-sm font-bold border-b">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         predictionLogs.length > 0 ? 
                           (predictionLogs.reduce((sum, log) => sum + (log.accuracyGRU || 0), 0) / predictionLogs.length) >= 90 ? 'bg-green-100 text-green-800' :
                           (predictionLogs.reduce((sum, log) => sum + (log.accuracyGRU || 0), 0) / predictionLogs.length) >= 80 ? 'bg-yellow-100 text-yellow-800' :
                           'bg-red-100 text-red-800'
                         : 'bg-gray-100 text-gray-800'
                       }`}>
                         {predictionLogs.length > 0 ? 
                           (predictionLogs.reduce((sum, log) => sum + (log.accuracyGRU || 0), 0) / predictionLogs.length).toFixed(2)
                           : '0.00'
                         }%
                       </span>
                     </td>
                     <td className="px-4 py-3 text-sm font-bold border-b">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         predictionLogs.length > 0 ? 
                           (predictionLogs.reduce((sum, log) => sum + (log.accuracyXGB || 0), 0) / predictionLogs.length) >= 90 ? 'bg-green-100 text-green-800' :
                           (predictionLogs.reduce((sum, log) => sum + (log.accuracyXGB || 0), 0) / predictionLogs.length) >= 80 ? 'bg-yellow-100 text-yellow-800' :
                           'bg-red-100 text-red-800'
                         : 'bg-gray-100 text-gray-800'
                       }`}>
                         {predictionLogs.length > 0 ? 
                           (predictionLogs.reduce((sum, log) => sum + (log.accuracyXGB || 0), 0) / predictionLogs.length).toFixed(2)
                           : '0.00'
                         }%
                       </span>
                     </td>
                   </tr>
                 </tfoot>
               </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Trang {currentPage} của {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === page
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RevenuePrediction; 

