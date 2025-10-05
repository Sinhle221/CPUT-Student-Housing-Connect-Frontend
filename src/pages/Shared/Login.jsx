import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <div className="center-screen">
        <div className="form-container">
          <h2 className="form-title">Hello, Welcome back!</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="login-input"
            />

            <div style={{ marginBottom: '32px' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="login-input"
                style={{ paddingRight: '40px' }}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-18px', marginBottom: '24px' }}>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            {error && (
              <div style={{ 
                color: 'red', 
                textAlign: 'center', 
                marginBottom: '16px',
                padding: '8px',
                backgroundColor: '#ffe6e6',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-button orange" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
      <style>{`
        .center-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to right, #f0f4f8, #ffffff);
        }
        .form-container {
          width: 100%;
          max-width: 440px;
          padding: 48px 36px;
          background-color: #f8f8f8;
          border-radius: 16px;
          box-shadow: 0 0 18px rgba(0, 0, 0, 0.10);
          position: relative;
        }
        .form-title {
          font-weight: bold;
          text-align: center;
          margin-bottom: 32px;
          font-size: 2rem;
          color: #003366;
        }
        .login-input {
          width: 100%;
          padding: 16px 18px;
          margin-bottom: 32px;
          border-radius: 10px;
          border: 1px solid #ccc;
          background-color: #eaeaea;
          font-size: 1.1rem;
          box-sizing: border-box;
        }
        .login-input::placeholder {
          color: #b0b0b0;
          opacity: 1;
        }
        .login-button {
          width: 100%;
          padding: 16px;
          margin-top: 8px;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        .login-button.orange {
          background-color: #ff6600;
          color: white;
        }
        .login-button:hover {
          opacity: 0.9;
        }
        .forgot-link {
          color: #003366;
          font-size: 1rem;
          text-decoration: none;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }
        .signup-text {
          text-align: center;
          margin-top: 28px;
          font-size: 1.08rem;
          color: #333;
        }
        .signup-link {
          color: #ff6600;
          font-weight: 600;
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .form-container {
            width: 95%;
            padding: 18px;
          }
          .form-title {
            font-size: 1.2rem;
          }
          .login-button {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default LoginForm;
