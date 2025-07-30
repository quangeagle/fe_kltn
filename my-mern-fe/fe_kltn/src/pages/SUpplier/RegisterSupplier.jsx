import React, { useState } from 'react';
import axios from 'axios';

const RegisterSupplier = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    storeAddress: '',
    avatar: null
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const res = await axios.post('http://localhost:5000/api/suppliers/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Đăng ký thành công!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Đăng ký thất bại.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6">Đăng ký nhà cung cấp</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="storeName" placeholder="Tên cửa hàng" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="ownerName" placeholder="Chủ cửa hàng" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="storeAddress" placeholder="Địa chỉ cửa hàng" onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="w-full" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default RegisterSupplier;
