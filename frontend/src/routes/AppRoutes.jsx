import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Customer Pages
import HomePage from '../pages/customer/HomePage';
import ProductListPage from '../pages/customer/ProductListPage';
import ProductDetailPage from '../pages/customer/ProductDetailPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import WishlistPage from '../pages/customer/WishlistPage';
import MyOrdersPage from '../pages/customer/MyOrdersPage';
import OrderDetailPage from '../pages/customer/OrderDetailPage';
import ProfilePage from '../pages/customer/ProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminAdmins from '../pages/admin/AdminAdmins';
import AdminBanners from '../pages/admin/AdminBanners';

// Seller Pages
import SellerDashboard from '../pages/seller/SellerDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route path="/cart" element={
        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
          <CartPage />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/my-orders" element={
        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
          <MyOrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/wishlist" element={
        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
          <WishlistPage />
        </ProtectedRoute>
      } />
      <Route path="/my-orders/:id" element={
        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
          <OrderDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminProducts />
        </ProtectedRoute>
      } />
      <Route path="/admin/categories" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminCategories />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminOrders />
        </ProtectedRoute>
      } />
      <Route path="/admin/coupons" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminCoupons />
        </ProtectedRoute>
      } />
      <Route path="/admin/customers" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminCustomers />
        </ProtectedRoute>
      } />
      <Route path="/admin/admins" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminAdmins />
        </ProtectedRoute>
      } />
      <Route path="/admin/banners" element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <AdminBanners />
        </ProtectedRoute>
      } />

      {/* Seller Routes */}
      <Route path="/seller/dashboard" element={
        <ProtectedRoute allowedRoles={['ROLE_SELLER']}>
          <SellerDashboard />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
