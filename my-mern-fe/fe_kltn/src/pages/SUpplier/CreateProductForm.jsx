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

  const token = localStorage.getItem('token');

  // Lấy danh sách category để đổ vào dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
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
      const imageUrls = images.map(file => URL.createObjectURL(file)); // 🧪 tạm mock URL

      const res = await axios.post('http://localhost:5000/api/products', {
        name,
        description,
        price,
        unit,
        category,
        images: imageUrls,
      }, {
        headers: { Authorization: `Bearer ${token}` }
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
