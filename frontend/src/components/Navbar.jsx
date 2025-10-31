import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();

  const linkClasses = ({ isActive }) =>
    `hover:text-sky-600 transition ${
      isActive ? "text-sky-700 font-semibold underline" : ""
    }`;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="backdrop-blur-md bg-white/40 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-bold text-sky-700 flex items-center gap-2 hover:text-sky-600 transition"
        >
          🐟 Fish Mart
        </NavLink>

        {/* Navigation */}
        <nav className="space-x-6 text-gray-700 font-medium flex items-center">
          <NavLink to="/" className={linkClasses}>
            Products
          </NavLink>

          <div className="relative inline-block">
            <NavLink to="/cart" className={linkClasses}>
              Cart
            </NavLink>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth Links */}
          {!user ? (
            <>
              <NavLink to="/signin" className={linkClasses}>
                Sign In
              </NavLink>
              <NavLink to="/signup" className={linkClasses}>
                Sign Up
              </NavLink>
            </>
          ) : (
            <>
              <span className="text-sky-700 font-semibold">
                Hello, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
