import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// 🔒 Private Route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <div className="decorative-blob" aria-hidden></div>
        <div className="page-wrap">
          <Navbar />
          <main className="main">
            <Routes>
              {/* 👇 Default route: opens SignIn first */}
              <Route path="/" element={<Navigate to="/signin" replace />} />

              {/* 🔑 Public routes */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* 🛒 Protected routes */}
              <Route
                path="/products"
                element={
                  <PrivateRoute>
                    <ProductList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }
              />

              {/* Redirect unknown routes to SignIn */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
