import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji między stronami
import './RegisterPage.css'; // Import arkusza stylów
import { toast } from 'react-toastify'; // Import powiadomień typu toast
import { FaUser, FaLock } from 'react-icons/fa'; // Ikonki FontAwesome

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' }); // Stan formularza rejestracji
  const [error, setError] = useState(''); // Stan błędu
  const navigate = useNavigate(); // Hook do przekierowań

  // Obsługa zmiany pól formularza
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Wysłanie danych do backendu
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    // Obsługa odpowiedzi z backendu
    if (data.success) {
      toast.success('Rejestracja zakończona sukcesem!'); // Powiadomienie
      navigate('/login'); // Przejście do logowania
    } else {
      setError(data.message || 'Wystąpił błąd.'); // Wyświetlenie błędu
    }
  };

  // Efekt "ripple" przy kliknięciu
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
  
    setTimeout(() => ripple.remove(), 600); // Usunięcie efektu po animacji
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Rejestracja</h2>
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

          {/* Wyświetlenie błędu jeśli istnieje */}
          {error && <p className="error">{error}</p>}

          {/* Przycisk rejestracji z efektem ripple */}
          <button type="submit" className="ripple-button" onClick={handleRipple}>
            Zarejestruj się
          </button>
        </form>

        {/* Przejście do logowania */}
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
