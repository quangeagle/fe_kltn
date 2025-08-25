import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RevenueAnalyticsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);

  const handlePredict = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập hoặc token đã hết hạn");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/prediction/predict",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🔍 API Response:", res.data);
      console.log("🔍 SHAP Data Check:", {
        hasPredictions: !!res.data.predictions,
        xgbPrediction: res.data.predictions?.[1],
        hasXgbFeatureImportance: !!res.data.predictions?.[1]?.featureImportance,
        hasShapAnalysis: !!res.data.predictions?.[1]?.featureImportance?.shap_analysis,
        hasBusinessInsights: !!res.data.predictions?.[1]?.featureImportance?.business_insights,
        shapKeys: res.data.predictions?.[1]?.featureImportance?.shap_analysis ? Object.keys(res.data.predictions[1].featureImportance.shap_analysis) : 'N/A'
      });
      
      // Debug chi tiết hơn
      console.log("🔍 Detailed Structure Check:", {
        predictionsLength: res.data.predictions?.length,
        xgbPredictionKeys: res.data.predictions?.[1] ? Object.keys(res.data.predictions[1]) : 'No XGB prediction',
        featureImportanceKeys: res.data.predictions?.[1]?.featureImportance ? Object.keys(res.data.predictions[1].featureImportance) : 'No featureImportance',
        shapAnalysisKeys: res.data.predictions?.[1]?.featureImportance?.shap_analysis ? Object.keys(res.data.predictions[1].featureImportance.shap_analysis) : 'No shap_analysis'
      });
      
      // Kiểm tra trực tiếp dữ liệu
      console.log("🔍 Direct Data Access:", {
        xgbShapData: res.data.predictions?.[1]?.featureImportance?.shap_analysis,
        businessInsights: res.data.predictions?.[1]?.featureImportance?.business_insights,
        topFactors: res.data.predictions?.[1]?.featureImportance?.top_positive_factors
      });

      setPredictionData(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err.response?.data || err.message);
      alert("Có lỗi xảy ra khi dự đoán");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'strong_increasing':
        return '📈';
      case 'increasing':
        return '↗️';
      case 'decreasing':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '❓';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'strong_increasing':
        return 'text-green-600';
      case 'increasing':
        return 'text-blue-600';
      case 'decreasing':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConfidenceText = (score) => {
    if (score >= 0.8) return 'Rất cao';
    if (score >= 0.6) return 'Cao';
    if (score >= 0.4) return 'Trung bình';
    return 'Thấp';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/supplier/dashboard")}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Phân tích doanh thu</h1>
              <p className="text-gray-600 mt-1">Theo dõi và dự đoán doanh thu theo tuần</p>
            </div>
          </div>
        </div>

        {/* Nút dự đoán */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔮 Thực hiện dự đoán</h3>
          <button
            onClick={handlePredict}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang dự đoán...
              </div>
            ) : (
              "🚀 Dự đoán ngay"
            )}
          </button>
        </div>

        {/* Kết quả dự đoán */}
        {predictionData && (
          <div className="space-y-6">
            {/* Tổng quan dự đoán */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Tổng quan dự đoán</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm text-gray-600">Tuần dự đoán</p>
                  <p className="text-lg font-bold text-blue-600">Tuần {predictionData.weekOfYear}</p>
                  <p className="text-sm text-gray-500">{formatDate(predictionData.weekStart)}</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm text-gray-600">Dự đoán XGBoost</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(predictionData.predictedByXGB)}</p>
                  <p className="text-sm text-gray-500">Độ tin cậy cao</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="text-2xl mb-2">🔮</div>
                  <p className="text-sm text-gray-600">Dự đoán GRU</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(predictionData.predictedByGRU)}</p>
                  <p className="text-sm text-gray-500">Mô hình AI</p>
                </div>
              </div>
            </div>

            {/* Chi tiết từng mô hình */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">🤖 Chi tiết mô hình dự đoán</h3>
              
              <div className="space-y-6">
                {predictionData.predictions.map((prediction, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {prediction.modelUsed === 'XGB' ? '🌳 XGBoost Model' : '🧠 GRU Neural Network'}
                      </h4>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(prediction.trend)} bg-gray-100`}>
                          {getTrendIcon(prediction.trend)} {prediction.trend.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(prediction.confidenceScore)} bg-gray-100`}>
                          Độ tin cậy: {getConfidenceText(prediction.confidenceScore)} ({(prediction.confidenceScore * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">📈 Kết quả dự đoán</h5>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(prediction.predictedSales)}</p>
                          <p className="text-sm text-gray-500">Doanh thu dự kiến</p>
                        </div>
                      </div>

                      {prediction.featureImportance && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">🎯 Yếu tố ảnh hưởng</h5>
                          <div className="space-y-2">
                            {prediction.featureImportance.top_positive_factors?.slice(0, 3).map((factor, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-green-50 p-2 rounded">
                                <span className="text-sm text-green-700">{factor.feature}</span>
                                <span className="text-sm font-medium text-green-600">+{factor.contribution}</span>
                              </div>
                            ))}
                            {prediction.featureImportance.top_negative_factors?.slice(0, 3).map((factor, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-red-50 p-2 rounded">
                                <span className="text-sm text-red-700">{factor.feature}</span>
                                <span className="text-sm font-medium text-red-600">{factor.contribution}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {prediction.logs && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 mb-2">📝 Thông tin chi tiết</h5>
                        <div className="bg-white p-3 rounded border text-sm text-gray-600">
                          {prediction.logs.message}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Yếu tố bên ngoài */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">🌍 Yếu tố bên ngoài</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-lg mb-1">🌡️</div>
                  <p className="text-sm text-gray-600">Nhiệt độ</p>
                  <p className="font-semibold text-blue-600">{predictionData.externalFactorsCurrent.temperature}°C</p>
                </div>
                
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-lg mb-1">⛽</div>
                  <p className="text-sm text-gray-600">Giá xăng</p>
                  <p className="font-semibold text-yellow-600">${predictionData.externalFactorsCurrent.fuelPrice}</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-lg mb-1">📊</div>
                  <p className="text-sm text-gray-600">CPI</p>
                  <p className="font-semibold text-green-600">{predictionData.externalFactorsCurrent.cpi}</p>
                </div>
                
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-lg mb-1">👥</div>
                  <p className="text-sm text-gray-600">Thất nghiệp</p>
                  <p className="font-semibold text-red-600">{predictionData.externalFactorsCurrent.unemployment}%</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-lg mb-1">📅</div>
                  <p className="text-sm text-gray-600">Tháng</p>
                  <p className="font-semibold text-purple-600">{predictionData.externalFactorsCurrent.month}</p>
                </div>
                
                <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="text-lg mb-1">📆</div>
                  <p className="text-sm text-gray-600">Ngày trong tuần</p>
                  <p className="font-semibold text-indigo-600">{predictionData.externalFactorsCurrent.dayOfWeek}</p>
                </div>
                
                <div className="text-center p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="text-lg mb-1">🏖️</div>
                  <p className="text-sm text-gray-600">Cuối tuần</p>
                  <p className="font-semibold text-pink-600">{predictionData.externalFactorsCurrent.isWeekend ? 'Có' : 'Không'}</p>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-lg mb-1">🎉</div>
                  <p className="text-sm text-gray-600">Ngày lễ</p>
                  <p className="font-semibold text-orange-600">{predictionData.externalFactorsCurrent.holidayFlag ? 'Có' : 'Không'}</p>
                </div>
              </div>
            </div>

                         {/* Insights kinh doanh */}
             {predictionData.predictions[1]?.featureImportance?.business_insights && (
               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                 <h3 className="text-xl font-semibold text-gray-900 mb-6">💡 Insights kinh doanh</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {predictionData.predictions[1].featureImportance.business_insights.map((insight, index) => (
                     <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                       <span className="text-blue-600 text-lg">💡</span>
                       <p className="text-sm text-gray-700">{insight}</p>
                     </div>
                   ))}
                 </div>
               </div>
             )}

            {/* SHAP Analysis */}
            {predictionData.predictions && predictionData.predictions.length > 0 && predictionData.predictions[0] && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Phân tích SHAP (SHapley Additive exPlanations)</h3>
                
                                 {/* Debug info */}
                 <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                   <p className="text-sm text-yellow-800">
                     <strong>Debug Info:</strong> 
                     Has predictions: {!!predictionData.predictions}. 
                     Has XGB featureImportance: {!!predictionData.predictions[1]?.featureImportance}. 
                     Has SHAP analysis: {!!predictionData.predictions[1]?.featureImportance?.shap_analysis}
                   </p>
                   <p className="text-sm text-yellow-800 mt-2">
                     <strong>XGB Model Data:</strong>
                     Business insights: {!!predictionData.predictions[1]?.featureImportance?.business_insights} |
                     Top factors: {!!predictionData.predictions[1]?.featureImportance?.top_positive_factors}
                   </p>
                   <p className="text-sm text-yellow-800 mt-1">
                     <strong>XGB Prediction Keys:</strong> {predictionData.predictions?.[1] ? Object.keys(predictionData.predictions[1]).join(', ') : 'No XGB prediction'}
                   </p>
                 </div>
                
                                 {/* Tổng quan SHAP */}
                 {predictionData.predictions[1]?.featureImportance?.shap_analysis ? (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                     <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                       <div className="text-2xl mb-2">📈</div>
                       <p className="text-sm text-gray-600">Tổng đóng góp tích cực</p>
                       <p className="text-lg font-bold text-green-600">+{(predictionData.predictions[1].featureImportance.shap_analysis.total_positive_contribution * 100).toFixed(2)}%</p>
                     </div>
                     
                     <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                       <div className="text-2xl mb-2">📉</div>
                       <p className="text-sm text-gray-600">Tổng đóng góp tiêu cực</p>
                       <p className="text-lg font-bold text-red-600">{(predictionData.predictions[1].featureImportance.shap_analysis.total_negative_contribution * 100).toFixed(2)}%</p>
                     </div>
                     
                     <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                       <div className="text-2xl mb-2">⚖️</div>
                       <p className="text-sm text-gray-600">Đóng góp ròng</p>
                       <p className={`text-lg font-bold ${predictionData.predictions[1].featureImportance.shap_analysis.net_contribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {predictionData.predictions[1].featureImportance.shap_analysis.net_contribution >= 0 ? '+' : ''}
                         {(predictionData.predictions[1].featureImportance.shap_analysis.net_contribution * 100).toFixed(2)}%
                       </p>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-gray-50 rounded-lg border">
                     <p className="text-gray-600">📊 Dữ liệu SHAP analysis chưa có sẵn</p>
                     <p className="text-sm text-gray-500 mt-1">Vui lòng kiểm tra API response để đảm bảo có dữ liệu SHAP</p>
                   </div>
                 )}

                                 {/* Xếp hạng yếu tố */}
                 {predictionData.predictions[1]?.featureImportance?.shap_analysis?.feature_ranking ? (
                   <div className="mb-6">
                     <h4 className="text-lg font-semibold text-gray-900 mb-4">🏆 Xếp hạng yếu tố theo tầm quan trọng</h4>
                     <div className="space-y-3">
                       {predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking.map((feature, index) => (
                         <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                           <div className="flex items-center space-x-3">
                             <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                               index === 0 ? 'bg-yellow-500 text-white' :
                               index === 1 ? 'bg-gray-400 text-white' :
                               index === 2 ? 'bg-orange-500 text-white' :
                               'bg-gray-200 text-gray-700'
                             }`}>
                               {index + 1}
                             </span>
                             <div>
                               <p className="font-medium text-gray-900">{feature.feature}</p>
                               <p className="text-sm text-gray-500">SHAP Value: {feature.shap_value.toFixed(4)}</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <p className={`font-semibold ${
                               feature.shap_value >= 0 ? 'text-green-600' : 'text-red-600'
                             }`}>
                               {feature.shap_value >= 0 ? '+' : ''}{(feature.shap_value * 100).toFixed(2)}%
                             </p>
                             <p className="text-xs text-gray-500">Tầm quan trọng</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 ) : (
                   <div className="text-center p-4 bg-gray-50 rounded-lg border mb-6">
                     <p className="text-gray-600">🏆 Feature ranking data not available</p>
                   </div>
                 )}

                                 {/* Thống kê tổng hợp */}
                 {predictionData.predictions[1]?.featureImportance?.shap_analysis ? (
                   <div className="bg-gray-50 p-4 rounded-lg border">
                     <h4 className="font-medium text-gray-900 mb-2">📋 Thống kê tổng hợp</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                       <div>
                         <p className="text-gray-600">Tổng số yếu tố được phân tích: <span className="font-semibold text-gray-900">{predictionData.predictions[1].featureImportance.shap_analysis.total_features_analyzed}</span></p>
                         <p className="text-gray-600">Yếu tố tích cực: <span className="font-semibold text-green-600">{predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.filter(f => f.shap_value > 0).length || 0}</span></p>
                         <p className="text-gray-600">Yếu tố tiêu cực: <span className="font-semibold text-red-600">{predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.filter(f => f.shap_value < 0).length || 0}</span></p>
                         <p className="text-gray-600">Yếu tố trung tính: <span className="font-semibold text-gray-600">{predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.filter(f => f.shap_value === 0).length || 0}</span></p>
                       </div>
                       <div>
                         <p className="text-gray-600">Yếu tố mạnh nhất: <span className="font-semibold text-gray-900">{predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.[0]?.feature || 'N/A'}</span></p>
                         <p className="text-gray-600">Yếu tố yếu nhất: <span className="font-semibold text-gray-900">{predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.[predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking.length - 1]?.feature || 'N/A'}</span></p>
                         <p className="text-gray-600">Phạm vi ảnh hưởng: <span className="font-semibold text-gray-900">{(Math.abs(predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.[0]?.shap_value || 0) + Math.abs(predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking?.[predictionData.predictions[1].featureImportance.shap_analysis.feature_ranking.length - 1]?.shap_value || 0)).toFixed(4)}</span></p>
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center p-4 bg-gray-50 rounded-lg border">
                     <p className="text-gray-600">📋 Summary statistics not available</p>
                   </div>
                 )}
              </div>
            )}

            {/* Nút làm mới */}
            <div className="text-center">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 font-medium"
              >
                🔄 Cập nhật dự đoán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalyticsPage;
