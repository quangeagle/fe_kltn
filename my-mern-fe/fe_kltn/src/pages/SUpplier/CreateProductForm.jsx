import { useState, useEffect } from 'react';
import axios from 'axios';

function CreateProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState('');
  const token = localStorage.getItem('token');
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqlpqcux3/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'ml_default';
  
  // Lấy danh sách category để đổ vào dropdown
  useEffect(() => {
    axios.get('https://be-kltn-1.onrender.com/api/categories')
      .then(res => {
        const categoryList = res.data?.data || [];
        setCategories(categoryList);
      })
      .catch(err => {
        console.error('Lỗi khi load category:', err);
        setCategories([]);
      });
  }, []);
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const uploadedImageUrls = [];
  
      // Upload từng ảnh lên Cloudinary
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append('file', images[i]);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
        const res = await axios.post(CLOUDINARY_URL, formData);
        uploadedImageUrls.push(res.data.secure_url);
      }
  
      // Gửi dữ liệu sản phẩm lên server
      const productData = {
        name,
        description,
        price,
        unit,
        quantity,
        category,
        images: uploadedImageUrls,
      };
  
      const res = await axios.post('https://be-kltn-1.onrender.com/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert('✅ Tạo sản phẩm thành công!');
      console.log('Kết quả:', res.data);
    } catch (error) {
      console.error('❌ Lỗi khi tạo sản phẩm:', error.response?.data || error.message);
      alert('Tạo sản phẩm thất bại');
    }
  };
  
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Tạo sản phẩm mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="number"
          placeholder="Số lượng"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />
        <input
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          placeholder="Đơn vị (ví dụ: chiếc, bộ)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Tạo sản phẩm
        </button>
      </form>
    </div>
  );
}

export default CreateProductForm;
