import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Do przekierowań między stronami
import './RegisterPage.css'; // Style dla tej strony
import { toast } from 'react-toastify'; // Powiadomienia toast
import { FaUser, FaLock } from 'react-icons/fa'; // Ikony pól formularza

const RegisterPage = () => {
  // Stan przechowujący dane formularza i ewentualny błąd
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Obsługa zmian w inputach
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Wysłanie formularza rejestracji
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Rejestracja zakończona sukcesem!');
      navigate('/login');
    } else {
      setError(data.message || 'Wystąpił błąd rejestracji.');
    }
  };

  // Efekt kliknięcia przycisku (ripple)
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

    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Rejestracja</h2>

        {/* Formularz rejestracyjny */}
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

          {/* Komunikat błędu jeśli wystąpi */}
          {error && <p className="error">{error}</p>}

          {/* Przycisk z animacją ripple */}
          <button type="submit" className="ripple-button" onClick={handleRipple}>
            Zarejestruj się
          </button>
        </form>

        {/* Przekierowanie do logowania */}
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
