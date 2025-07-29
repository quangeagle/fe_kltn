import { useNavigate } from 'react-router-dom';

function SupplierPage() {
  const navigate = useNavigate();

  const goToCreateProduct = () => {
    navigate('/supplier/create-product');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Chào mừng nhà cung cấp!</h1>
        <p className="mb-6 text-gray-600">Bạn có thể bắt đầu thêm sản phẩm mới vào hệ thống.</p>
        <button
          onClick={goToCreateProduct}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
        >
          ➕ Tạo sản phẩm mới
        </button>
      </div>
    </div>
  );
}

export default SupplierPage;
