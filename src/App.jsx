import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import CartDrawer from "./components/CartDrawer.jsx";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Checkout from "./pages/Checkout.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Product from "./pages/admin/Product.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import CategoryForm from "./pages/admin/CategoryForm.jsx";
import Order from "./pages/admin/Order.jsx";
import Customer from "./pages/admin/Customer.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";

import AdminProtectedRoute from "./routes/AdminProtectedRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawer />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          
          {/* Category shortcuts */}
          <Route path="/smart-watches" element={<CategoryPage categoryName="Smart Watches" />} />
          <Route path="/earbuds" element={<CategoryPage categoryName="Zero Earbuds" />} />
          <Route path="/headphones" element={<CategoryPage categoryName="Headphones" />} />
          <Route path="/sale" element={<CategoryPage categoryName="11 11 Sale" />} />
          <Route path="/vision-2025" element={<CategoryPage categoryName="Vision 2025" />} />

          {/* User protected */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/order/create" element={<Checkout />} />
          {/* Admin protected */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Product />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="orders" element={<Order />} />
            <Route path="users" element={<Customer />} />
          </Route>
        </Routes>

        <Toaster position="top-center" />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
