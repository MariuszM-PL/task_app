import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji
import { FaUser, FaLock } from 'react-icons/fa'; // Ikonki użytkownika i hasła
import './LoginPage.css'; // Import styli CSS
import { toast } from 'react-toastify'; // Powiadomienia toastowe (np. sukces logowania)

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' }); // Dane logowania
  const [message, setMessage] = useState(''); // Komunikat błędu
  const navigate = useNavigate(); // Hook do przekierowania

  // Obsługa zmian w polach formularza
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Obsługa logowania po wysłaniu formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiegamy przeładowaniu strony

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Przesyłanie ciasteczek sesyjnych
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Zalogowano pomyślnie!'); // Sukces
      navigate('/dashboard'); // Przejście do panelu użytkownika
    } else {
      setMessage(data.message || 'Błąd logowania'); // Błąd logowania
    }
  };

  // Efekt "ripple" po kliknięciu przycisku
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

    setTimeout(() => ripple.remove(), 600); // Usunięcie po animacji
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Logowanie</h2>
        
        {/* Komunikat błędu jeśli istnieje */}
        {message && <p className="error">{message}</p>}

        {/* Formularz logowania */}
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

          {/* Przycisk logowania z efektem ripple */}
          <button type="submit" className="ripple-button" onClick={handleRipple}>
            Zaloguj się
          </button>
        </form>

        {/* Przekierowanie do rejestracji */}
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

export default LoginPage; // Eksport komponentu
