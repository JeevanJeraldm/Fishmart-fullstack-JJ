import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ On load, restore user + refresh cart count
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      refreshCartCount(token);
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    refreshCartCount(token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCartCount(0);
  };

  const refreshCartCount = async (maybeToken) => {
    const token = maybeToken || localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('https://fishmart-fullstack-jj.onrender.com/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items || [];
      const count = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (err) {
      console.error('Failed to refresh cart count', err);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to add items to your cart.');
      return;
    }

    try {
      const res = await fetch('https://fishmart-fullstack-jj.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      await refreshCartCount(token);
      alert('Added to cart 🐟');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Could not add to cart.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, cartCount, refreshCartCount, addToCart }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
