import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const PredictionDemo = () => {
  const [salesHistory, setSalesHistory] = useState(Array(10).fill(""));
  const [externalFactorsPrev, setExternalFactorsPrev] = useState({
    Temperature: "",
    Fuel_Price: "",
    CPI: "",
    Unemployment: ""
  });
  const [externalFactorsCurr, setExternalFactorsCurr] = useState({
    holidayFlag: "",
    temperature: "",
    fuelPrice: "",
    cpi: "",
    unemployment: "",
    month: "",
    weekOfYear: "",
    year: "",
    dayOfWeek: "",
    isWeekend: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 📌 Parse Excel file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      console.log("📂 Excel raw:", worksheet);

      // Giả sử Excel có dạng:
      // Hàng 1: 10 tuần sales
      // Hàng 2: externalFactorsPrev
      // Hàng 3: externalFactorsCurr

      if (worksheet.length >= 3) {
        setSalesHistory(worksheet[0]);
        setExternalFactorsPrev({
          temperature: worksheet[1][0],
          fuelPrice: worksheet[1][1],
          cpi: worksheet[1][2],
          unemployment: worksheet[1][3]
        });
        setExternalFactorsCurr({
          holidayFlag: worksheet[2][0],
          temperature: worksheet[2][1],
          fuelPrice: worksheet[2][2],
          cpi: worksheet[2][3],
          unemployment: worksheet[2][4],
          month: worksheet[2][5],
          weekOfYear: worksheet[2][6],
          year: worksheet[2][7],
          dayOfWeek: worksheet[2][8],
          isWeekend: worksheet[2][9]
        });
        // Clear errors when file is uploaded successfully
        setErrors({});
      } else {
        alert("❌ File Excel không đúng định dạng! Cần ít nhất 3 hàng dữ liệu.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 📌 Validation function
  const validateInputs = () => {
    const newErrors = {};

    // Validate sales history
    salesHistory.forEach((val, idx) => {
      if (!val || val === "" || isNaN(val) || Number(val) <= 0) {
        newErrors[`sales_${idx}`] = "Doanh thu phải là số dương";
      }
    });

    // Validate external factors previous
    Object.keys(externalFactorsPrev).forEach(key => {
      const val = externalFactorsPrev[key];
      if (!val || val === "" || isNaN(val)) {
        newErrors[`prev_${key}`] = "Giá trị không được để trống";
      }
    });

    // Validate external factors current
    Object.keys(externalFactorsCurr).forEach(key => {
      const val = externalFactorsCurr[key];
      if (!val || val === "" || isNaN(val)) {
        newErrors[`curr_${key}`] = "Giá trị không được để trống";
      }
      
      // Specific validations
      if (key === 'month' && (Number(val) < 1 || Number(val) > 12)) {
        newErrors[`curr_${key}`] = "Tháng phải từ 1-12";
      }
      if (key === 'weekOfYear' && (Number(val) < 1 || Number(val) > 53)) {
        newErrors[`curr_${key}`] = "Tuần trong năm phải từ 1-53";
      }
      if (key === 'year' && (Number(val) < 2000 || Number(val) > 2030)) {
        newErrors[`curr_${key}`] = "Năm phải từ 2000-2030";
      }
      if (key === 'dayOfWeek' && (Number(val) < 1 || Number(val) > 7)) {
        newErrors[`curr_${key}`] = "Ngày trong tuần phải từ 1-7";
      }
      if (key === 'holidayFlag' && ![0, 1].includes(Number(val))) {
        newErrors[`curr_${key}`] = "Cờ ngày lễ phải là 0 hoặc 1";
      }
      if (key === 'isWeekend' && ![0, 1].includes(Number(val))) {
        newErrors[`curr_${key}`] = "Cờ cuối tuần phải là 0 hoặc 1";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📌 Gửi API
  const handleSubmit = async () => {
    if (!validateInputs()) {
      alert("❌ Vui lòng kiểm tra lại các thông tin nhập vào!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        salesHistory: salesHistory.map(Number),
        externalFactorsPrevious: externalFactorsPrev,
        externalFactorsCurrent: externalFactorsCurr
      };
      console.log("📤 Payload gửi API:", payload);

      const res = await axios.post("https://be-kltn-1.onrender.com/api/prediction/predict-from-input", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setResult(res.data);
    } catch (err) {
      console.error("❌ API Error:", err);
      alert("Có lỗi khi gọi API");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'strong_increasing': return '📈';
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '➡️';
      case 'volatile': return '📊';
      default: return '❓';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'strong_increasing': return 'text-green-600';
      case 'increasing': return 'text-blue-600';
      case 'decreasing': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      case 'volatile': return 'text-purple-600';
      default: return 'text-gray-600';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔮 Demo Dự Đoán Doanh Thu
          </h1>
          <p className="text-gray-600 mt-2">Nhập dữ liệu và xem kết quả dự đoán chi tiết với phân tích SHAP</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📥 Nhập dữ liệu dự đoán</h2>
          
          {/* Upload Excel */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">📂 Tải file Excel</label>
            <input 
              type="file" 
              accept=".xlsx" 
              onChange={handleFileUpload} 
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors" 
            />
            
            {/* Excel Instructions */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Hướng dẫn định dạng file Excel:</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>Hàng 1:</strong> Doanh thu 10 tuần gần nhất (A1:J1) - Không có header</p>
                <p><strong>Hàng 2:</strong> Yếu tố tuần trước (A2:D2) - Nhiệt độ, Giá xăng, CPI, Thất nghiệp</p>
                <p><strong>Hàng 3:</strong> Yếu tố tuần hiện tại (A3:J3) - Cờ lễ, Nhiệt độ, Giá xăng, CPI, Thất nghiệp, Tháng, Tuần, Năm, Ngày, Cuối tuần</p>
                <p className="text-red-600 font-semibold">⚠️ Lưu ý: Dữ liệu phải bắt đầu từ ô A1, không có header, tất cả giá trị phải là số!</p>
              </div>
            </div>
          </div>

          {/* Sales History */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-3">📊 Doanh thu 10 tuần gần nhất</label>
            <div className="grid grid-cols-5 gap-3">
              {salesHistory.map((val, idx) => (
                <div key={idx}>
                  <label className="block text-xs text-gray-500 mb-1 font-medium">
                    T{idx + 1} (Tuần {idx + 1})
                  </label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => {
                      const updated = [...salesHistory];
                      updated[idx] = e.target.value;
                      setSalesHistory(updated);
                      // Clear error when user types
                      if (errors[`sales_${idx}`]) {
                        const newErrors = { ...errors };
                        delete newErrors[`sales_${idx}`];
                        setErrors(newErrors);
                      }
                    }}
                    placeholder={`T${idx + 1}`}
                    className={`border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                      errors[`sales_${idx}`] ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  {errors[`sales_${idx}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`sales_${idx}`]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* External Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Previous Week */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">🌡️ Yếu tố bên ngoài (Tuần trước)</h3>
              <div className="space-y-3">
                {Object.keys(externalFactorsPrev).map((key) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                      {key === 'Temperature' ? '🌡️ Nhiệt độ (°C)' :
                       key === 'Fuel_Price' ? '⛽ Giá xăng ($)' :
                       key === 'CPI' ? '📊 Chỉ số CPI' :
                       '👥 Tỷ lệ thất nghiệp (%)'}
                    </label>
                    <input
                      type="number"
                      placeholder={key}
                      value={externalFactorsPrev[key]}
                      onChange={(e) => {
                        setExternalFactorsPrev({ ...externalFactorsPrev, [key]: e.target.value });
                        // Clear error when user types
                        if (errors[`prev_${key}`]) {
                          const newErrors = { ...errors };
                          delete newErrors[`prev_${key}`];
                          setErrors(newErrors);
                        }
                      }}
                      className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                        errors[`prev_${key}`] ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    {errors[`prev_${key}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`prev_${key}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Week */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">📅 Yếu tố bên ngoài (Tuần hiện tại)</h3>
              <div className="space-y-3">
                {Object.keys(externalFactorsCurr).map((key) => (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1 font-medium">
                      {key === 'holidayFlag' ? '🎉 Cờ ngày lễ (0/1)' :
                       key === 'temperature' ? '🌡️ Nhiệt độ (°C)' :
                       key === 'fuelPrice' ? '⛽ Giá xăng ($)' :
                       key === 'cpi' ? '📊 Chỉ số CPI' :
                       key === 'unemployment' ? '👥 Tỷ lệ thất nghiệp (%)' :
                       key === 'month' ? '📅 Tháng (1-12)' :
                       key === 'weekOfYear' ? '📆 Tuần trong năm (1-53)' :
                       key === 'year' ? '📅 Năm (2000-2030)' :
                       key === 'dayOfWeek' ? '📅 Ngày trong tuần (1-7)' :
                       '🏖️ Cờ cuối tuần (0/1)'}
                    </label>
                    <input
                      type="number"
                      placeholder={key}
                      value={externalFactorsCurr[key]}
                      onChange={(e) => {
                        setExternalFactorsCurr({ ...externalFactorsCurr, [key]: e.target.value });
                        // Clear error when user types
                        if (errors[`curr_${key}`]) {
                          const newErrors = { ...errors };
                          delete newErrors[`curr_${key}`];
                          setErrors(newErrors);
                        }
                      }}
                      className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                        errors[`curr_${key}`] ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    {errors[`curr_${key}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`curr_${key}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Đang xử lý...
                </div>
              ) : (
                "🚀 Thực hiện dự đoán"
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="text-lg font-semibold mb-2">Tuần dự đoán</h3>
                <p className="text-3xl font-bold">
                  {result.weekOfYear || 'N/A'}
                </p>
                <p className="text-blue-100 text-sm">
                  Năm {result.year || 'N/A'}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold mb-2">XGBoost</h3>
                <p className="text-3xl font-bold">
                  {result.predictions?.[1]?.predictedSales ? 
                   formatCurrency(result.predictions[1].predictedSales) : 
                   'Chưa có dữ liệu'}
                </p>
                <p className="text-green-100 text-sm">
                  {result.predictions?.[1]?.confidenceScore ? 
                   `Độ tin cậy: ${(result.predictions[1].confidenceScore * 100).toFixed(0)}%` : 
                   'Đang xử lý...'}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl mb-2">🔮</div>
                <h3 className="text-lg font-semibold mb-2">GRU Neural</h3>
                <p className="text-3xl font-bold">
                  {result.predictions?.[0]?.predictedSales ? 
                   formatCurrency(result.predictions[0].predictedSales) : 
                   'Chưa có dữ liệu'}
                </p>
                <p className="text-purple-100 text-sm">
                  {result.predictions?.[0]?.confidenceScore ? 
                   `Độ tin cậy: ${(result.predictions[0].confidenceScore * 100).toFixed(0)}%` : 
                   'Đang xử lý...'}
                </p>
              </div>
            </div>

            {/* Model Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 Chi tiết mô hình dự đoán</h2>
              
              <div className="space-y-6">
                {result.predictions.map((prediction, index) => (
                  <div key={index} className="border-2 border-gray-100 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {prediction.modelUsed === 'XGB' ? '🌳 XGBoost Model' : '🧠 GRU Neural Network'}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getTrendColor(prediction.trend)} bg-gray-100`}>
                          {getTrendIcon(prediction.trend)} {prediction.trend.replace('_', ' ')}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getConfidenceColor(prediction.confidenceScore)} bg-gray-100`}>
                          Độ tin cậy: {getConfidenceText(prediction.confidenceScore)} ({(prediction.confidenceScore * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">📈 Kết quả dự đoán</h4>
                        <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
                          <p className="text-4xl font-bold text-green-600">{formatCurrency(prediction.predictedSales)}</p>
                          <p className="text-gray-500">Doanh thu dự kiến</p>
                        </div>
                      </div>

                      {prediction.featureImportance && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">🎯 Yếu tố ảnh hưởng</h4>
                          <div className="space-y-2">
                            {prediction.featureImportance.top_positive_factors?.slice(0, 3).map((factor, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                                <span className="text-sm text-green-700 font-medium">{factor.feature}</span>
                                <span className="text-sm font-bold text-green-600">+{factor.contribution}</span>
                              </div>
                            ))}
                            {prediction.featureImportance.top_negative_factors?.slice(0, 3).map((factor, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                                <span className="text-sm text-red-700 font-medium">{factor.feature}</span>
                                <span className="text-sm font-bold text-red-600">{factor.contribution}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {prediction.logs && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">📝 Thông tin chi tiết</h4>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-sm text-gray-600">
                          {prediction.logs.message}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* External Factors Display */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🌍 Yếu tố bên ngoài hiện tại</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-2xl mb-2">🌡️</div>
                  <p className="text-sm text-gray-600">Nhiệt độ</p>
                  <p className="text-xl font-bold text-blue-600">{result.externalFactorsCurrent?.temperature || 'N/A'}°C</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <div className="text-2xl mb-2">⛽</div>
                  <p className="text-sm text-gray-600">Giá xăng</p>
                  <p className="text-xl font-bold text-yellow-600">${result.externalFactorsCurrent?.fuelPrice || 'N/A'}</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm text-gray-600">CPI</p>
                  <p className="text-xl font-bold text-green-600">{result.externalFactorsCurrent?.cpi || 'N/A'}</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="text-sm text-gray-600">Thất nghiệp</p>
                  <p className="text-xl font-bold text-red-600">{result.externalFactorsCurrent?.unemployment || 'N/A'}%</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm text-gray-600">Tháng</p>
                  <p className="text-xl font-bold text-purple-600">{result.externalFactorsCurrent?.month || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Business Insights */}
            {result.predictions?.[1]?.featureImportance?.business_insights && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Insights kinh doanh</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.predictions[1].featureImportance.business_insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <span className="text-blue-600 text-xl">💡</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SHAP Analysis */}
            {result.predictions[1]?.featureImportance?.shap_analysis && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Phân tích SHAP (SHapley Additive exPlanations)</h2>
                
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                    <div className="text-3xl mb-2">📈</div>
                    <p className="text-sm text-gray-600 mb-2">Tổng đóng góp tích cực</p>
                    <p className="text-2xl font-bold text-green-600">+{(result.predictions[1].featureImportance.shap_analysis.total_positive_contribution * 100).toFixed(2)}%</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
                    <div className="text-3xl mb-2">📉</div>
                    <p className="text-sm text-gray-600 mb-2">Tổng đóng góp tiêu cực</p>
                    <p className="text-2xl font-bold text-red-600">{(result.predictions[1].featureImportance.shap_analysis.total_negative_contribution * 100).toFixed(2)}%</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                    <div className="text-3xl mb-2">⚖️</div>
                    <p className="text-sm text-gray-600 mb-2">Đóng góp ròng</p>
                    <p className={`text-2xl font-bold ${result.predictions[1].featureImportance.shap_analysis.net_contribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.predictions[1].featureImportance.shap_analysis.net_contribution >= 0 ? '+' : ''}
                      {(result.predictions[1].featureImportance.shap_analysis.net_contribution * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Feature Ranking */}
                {result.predictions[1].featureImportance.shap_analysis.feature_ranking && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Xếp hạng yếu tố theo tầm quan trọng</h3>
                    <div className="space-y-3">
                      {result.predictions[1].featureImportance.shap_analysis.feature_ranking.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:shadow-md transition-all">
                          <div className="flex items-center space-x-4">
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-orange-500 text-white' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{feature.feature}</p>
                              <p className="text-sm text-gray-500">SHAP Value: {feature.shap_value.toFixed(4)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${
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
                )}

                {/* Summary Statistics */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">📋 Thống kê tổng hợp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600 mb-2">Tổng số yếu tố được phân tích: <span className="font-bold text-gray-900">{result.predictions[1].featureImportance.shap_analysis.total_features_analyzed}</span></p>
                      <p className="text-gray-600 mb-2">Yếu tố tích cực: <span className="font-bold text-green-600">{result.predictions[1].featureImportance.shap_analysis.feature_ranking?.filter(f => f.shap_value > 0).length || 0}</span></p>
                      <p className="text-gray-600 mb-2">Yếu tố tiêu cực: <span className="font-bold text-red-600">{result.predictions[1].featureImportance.shap_analysis.feature_ranking?.filter(f => f.shap_value < 0).length || 0}</span></p>
                      <p className="text-gray-600">Yếu tố trung tính: <span className="font-bold text-gray-600">{result.predictions[1].featureImportance.shap_analysis.feature_ranking?.filter(f => f.shap_value === 0).length || 0}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">Yếu tố mạnh nhất: <span className="font-bold text-gray-900">{result.predictions[1].featureImportance.shap_analysis.feature_ranking?.[0]?.feature || 'N/A'}</span></p>
                      <p className="text-gray-600 mb-2">Yếu tố yếu nhất: <span className="font-bold text-gray-900">{result.predictions[1].featureImportance.shap_analysis.feature_ranking?.[result.predictions[1].featureImportance.shap_analysis.feature_ranking.length - 1]?.feature || 'N/A'}</span></p>
                      <p className="text-gray-600">Phạm vi ảnh hưởng: <span className="font-bold text-gray-900">{(Math.abs(result.predictions[1].featureImportance.shap_analysis.feature_ranking?.[0]?.shap_value || 0) + Math.abs(result.predictions[1].featureImportance.shap_analysis.feature_ranking?.[result.predictions[1].featureImportance.shap_analysis.feature_ranking.length - 1]?.shap_value || 0)).toFixed(4)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Data (Collapsible) */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <details className="group">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">🔍 Dữ liệu thô (Raw Data)</h2>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </div>
                </summary>
                <div className="mt-6">
                  <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto text-sm">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDemo;
