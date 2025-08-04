import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import ProductManagement from './admin/ProductManagement';
import DashboardStats from './admin/DashboardStats';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import PaymentManagement from './admin/PaymentManagement';
import ViewQuote from './admin/ViewQuote';
import Reviews from './admin/Reviews';

import Header from './components/Header';
import { FullPageSpinner } from './components/FullPageSpinner';

import ClientLayout from './admin/ClientLayout';
import AdminLayout from './admin/AdminLayout';

import SignUp from './pages/SignUp';
import Login from './pages/Login';
import HomePage from './pages/Homepage';
import ProductList from './BridgeComponents/ProductList';

import './App.css';


const App: React.FC = () => {
  const { userRole, isLoading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;

  const noHeaderRoutes = ['/login', '/signup', '/unauthorized'];
  const showHeader =
    !noHeaderRoutes.includes(location.pathname) &&
    !location.pathname.startsWith('/admin-dashboard');

  return (
    <div className="app-container">
      {showHeader && <Header />}

      <main className="main-content">
        <Routes>
          {/* redirect root to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Home layout with nested ProductList */}
          <Route path="/home" element={<HomePage />}>
            {/* /home */}
            <Route index element={<ProductList />} />
            {/* /home/product-list */}
            <Route path="product-list" element={<ProductList />} />
          </Route>

          {/* Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Client Routes */}
          <Route
            element={
              isAuthenticated ? (
                <ClientLayout />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          >
            {/* add client routes here */}
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              userRole === 'admin' ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          >
            <Route index element={<DashboardStats />} />
            <Route path="product-management" element={<ProductManagement />} />
            <Route path="order-management" element={<OrderManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="payment-management" element={<PaymentManagement />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="view-quote" element={<ViewQuote />} />
          </Route>

          {/* Catch–all: redirect unknown paths to /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
