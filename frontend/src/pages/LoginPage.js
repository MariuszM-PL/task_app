import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do przekierowań między stronami
import { FaUser, FaLock } from 'react-icons/fa'; // Ikonki do pól: użytkownik i hasło
import './LoginPage.css'; // Lokalny plik stylów dla strony logowania
import { toast } from 'react-toastify'; // Komunikaty typu toast (np. sukces logowania)

const LoginPage = () => {
  // Stan do przechowywania danych formularza logowania
  const [formData, setFormData] = useState({ username: '', password: '' });

  // Stan do przechowywania komunikatu błędu (np. nieprawidłowe dane)
  const [message, setMessage] = useState('');

  // Hook do nawigacji między stronami (np. przekierowanie po zalogowaniu)
  const navigate = useNavigate();

  // Obsługa zmiany wartości w polach formularza
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Obsługa wysłania formularza logowania
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiegamy przeładowaniu strony

    // Walidacja danych wejściowych po stronie klienta
    if (formData.username.length < 3) {
      setMessage('Nazwa użytkownika musi mieć co najmniej 3 znaki.');
      return;
    }
    if (formData.username.length > 20) {
      setMessage('Nazwa użytkownika nie może przekraczać 20 znaków.');
      return;
    }
    if (formData.password.length < 6) {
      setMessage('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    if (formData.password.length > 100) {
      setMessage('Hasło nie może przekraczać 100 znaków.');
      return;
    }

    // Wysyłanie danych logowania do backendu
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Typ przesyłanych danych
      credentials: 'include', // Wysyłanie ciasteczek sesyjnych
      body: JSON.stringify(formData), // Przesłanie danych jako JSON
    });

    const data = await response.json(); // Odczytanie odpowiedzi z serwera

    if (data.success) {
      // Użytkownik zalogowany poprawnie – wyświetlamy toast i przekierowujemy
      toast.success('Zalogowano pomyślnie!');
      navigate('/dashboard');
    } else {
      // Wystąpił błąd – wyświetlamy komunikat w interfejsie
      setMessage(data.message || 'Błąd logowania');
    }
  };

  // Efekt animacji ripple (kliknięcie w przycisk)
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.offsetWidth, button.offsetHeight);

    // Ustawienie rozmiaru i pozycji ripple
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = "ripple";

    button.appendChild(ripple);

    // Usunięcie ripple po animacji
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Logowanie</h2>

        {/* Komunikat błędu (jeśli istnieje) */}
        {message && <p className="error">{message}</p>}

        {/* Formularz logowania */}
        <form onSubmit={handleSubmit}>
          {/* Pole: użytkownik (tekstowe) */}
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

          {/* Przycisk logowania z efektem ripple */}
          <button
            type="submit"
            className="ripple-button"
            onClick={handleRipple}
          >
            Zaloguj się
          </button>
        </form>

        {/* Link do strony rejestracji */}
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
