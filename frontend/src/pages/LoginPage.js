import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import './LoginPage.css';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
    toast.success('Zalogowano pomyślnie!');
    navigate('/dashboard');
    } else {
    setMessage(data.message || 'Błąd logowania');
    }
  };

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.offsetWidth, button.offsetHeight);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = "ripple";
    button.appendChild(ripple);
  
    setTimeout(() => ripple.remove(), 600); // usuń po animacji
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Logowanie</h2>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="ripple-button" onClick={handleRipple}>
          Zaloguj się
        </button>
      </form>
        <p>
          Nie masz konta?{' '}
          <span className="link" onClick={() => navigate('/register')}>
            Zarejestruj się
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
