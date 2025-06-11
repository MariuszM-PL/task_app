import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Do przekierowań między stronami
import { FaUser, FaLock } from 'react-icons/fa'; // Ikonki pola użytkownika i hasła
import './LoginPage.css'; // Import stylów
import { toast } from 'react-toastify'; // Powiadomienia typu toast (np. sukces)

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' }); // Dane z formularza logowania
  const [message, setMessage] = useState(''); // Komunikat błędu (jeśli wystąpi)
  const navigate = useNavigate(); // Hook do zmiany ścieżki (routing)

  // Obsługa wpisywania do formularza
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Obsługa kliknięcia w przycisk logowania
  const handleSubmit = async (e) => {
    e.preventDefault(); // Blokujemy domyślne przeładowanie strony

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Wysyłamy ciasteczka do backendu
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Zalogowano pomyślnie!');
      navigate('/dashboard'); // Przekierowanie do panelu użytkownika
    } else {
      setMessage(data.message || 'Błąd logowania'); // Pokazujemy błąd (jeśli wystąpił)
    }
  };

  // Obsługa efektu ripple na przycisku logowania
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

    setTimeout(() => ripple.remove(), 600); // Usuwamy ripple po animacji
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Logowanie</h2>

        {/* Komunikat błędu (jeśli jest) */}
        {message && <p className="error">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Pole: użytkownik */}
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

          {/* Pole: hasło */}
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

          {/* Przycisk logowania z efektem kliknięcia */}
          <button
            type="submit"
            className="ripple-button"
            onClick={handleRipple}
          >
            Zaloguj się
          </button>
        </form>

        {/* Link do rejestracji */}
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
