import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/User/AuthPage';
import UserPage from './pages/User/UserPage';
import AdminPage from './pages/Admin/AdminPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SupplierPage from './pages/SUpplier/SupplierPage';
import ProductListPage from './pages/Admin/ProductListPage';
import ApprovePage from './pages/Admin/ApprovePage';
import RejectPage from './pages/Admin/RejectPage';
import NavbarAdmin from './components/NavbarAdmin';
import AdminSupplierListPage from './pages/Admin/AdminSupplierListPage';
import AdminSupplierDetailPage from './pages/Admin/AdminSupplierProductListPage';
import CreateProductForm from './pages/SUpplier/CreateProductForm';
import HomePage from './pages/User/HomePage';
import SupplierProductsPage from './pages/User/SupplierProductsPage';
import CategoryProductsPage from './pages/User/CategoryProductsPage';
import ProductDetailPage from './pages/User/ProductDetailPage';
import AdminSupplierProductsPage from './pages/Admin/AdminSupplierProductListPage';
import CartPage from './pages/User/CartPage';
import RegisterSupplier from './pages/SUpplier/RegisterSupplier';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/old" element={<AdminPage />} />
        <Route path="/supplier" element={<SupplierPage />} />
        <Route path="/admin/products" element={<ProductListPage />} />
        <Route path="/admin/approve" element={<ApprovePage />} />
        <Route path="/admin/reject" element={<RejectPage />} />
        <Route path="/admin/navbar" element={<NavbarAdmin />} />
        <Route path="/admin/suppliers" element={<AdminSupplierListPage />} />
        <Route path="/admin/supplier-products" element={<AdminSupplierDetailPage />} />
        <Route path="/supplier/create-product" element={<CreateProductForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin/supplier-products2/:supplierId" element={<SupplierProductsPage />} />
        <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin/supplier-products/:supplierId" element={<AdminSupplierProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/supplier/register" element={<RegisterSupplier />} />
      </Routes> 
    </Router>
  );
}

export default App;
