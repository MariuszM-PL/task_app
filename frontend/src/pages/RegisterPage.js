import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
    toast.success('Rejestracja zakończona sukcesem!');
    navigate('/login');
    } else {
    setError(data.message || 'Wystąpił błąd.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Zarejestruj się</button>
        </form>
        <p>
          Masz już konto?{' '}
          <span className="link" onClick={() => navigate('/login')}>
            Zaloguj się
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
