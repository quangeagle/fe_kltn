import React from 'react';
import { Link } from 'react-router-dom';

const NavbarAdmin = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/admin/products">📦 Tất cả sản phẩm</Link></li>
        <li><Link to="/admin/approve">✅ Duyệt sản phẩm</Link></li>
        <li><Link to="/admin/reject">❌ Từ chối sản phẩm</Link></li>
        <li><Link to="/admin/suppliers">👥 Danh sách nhà cung cấp</Link></li>
      </ul>
    </nav>
  );
};

export default NavbarAdmin;