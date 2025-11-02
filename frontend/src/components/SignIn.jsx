import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://fishmart-fullstack-jj.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔹 Login API response:', data);

      if (!response.ok) {
        setError(data.message || 'Invalid email or password');
        return;
      }

      if (data.user && data.token) {
        login(data.user, data.token);
        navigate('/products'); // ✅ Go to products page after successful login
      } else {
        setError('Invalid server response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to the server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Visible Submit Button */}
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
