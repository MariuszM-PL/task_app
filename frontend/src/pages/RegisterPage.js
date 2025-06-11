import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji (np. przekierowanie na stronę logowania)
import './RegisterPage.css'; // Styl lokalny dla formularza rejestracji
import { toast } from 'react-toastify'; // Komunikaty toast (np. sukces rejestracji)
import { FaUser, FaLock } from 'react-icons/fa'; // Ikony FontAwesome do pól formularza

const RegisterPage = () => {
  // Stan przechowujący dane formularza (nazwa użytkownika i hasło)
  const [formData, setFormData] = useState({ username: '', password: '' });

  // Stan do przechowywania błędów walidacji lub błędów z backendu
  const [error, setError] = useState('');

  // Hook do przekierowywania użytkownika po sukcesie
  const navigate = useNavigate();

  // Aktualizacja pól formularza po każdej zmianie (np. pisaniu)
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Obsługa przesłania formularza rejestracji
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony

    // Walidacja danych wejściowych po stronie klienta
    if (formData.username.length < 3) {
      setError('Nazwa użytkownika musi mieć co najmniej 3 znaki.');
      return;
    }
    if (formData.username.length > 20) {
      setError('Nazwa użytkownika nie może przekraczać 20 znaków.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    if (formData.password.length > 100) {
      setError('Hasło nie może przekraczać 100 znaków.');
      return;
    }

    // Wysłanie danych do backendu (rejestracja)
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Określenie typu danych
      body: JSON.stringify(formData), // Przesłanie danych jako JSON
    });

    const data = await response.json(); // Odczytanie odpowiedzi z serwera

    if (data.success) {
      toast.success('Rejestracja zakończona sukcesem!'); // Komunikat toast
      navigate('/login'); // Przekierowanie do strony logowania
    } else {
      // Wyświetlenie błędu jeśli rejestracja się nie powiodła
      setError(data.message || 'Wystąpił błąd rejestracji.');
    }
  };

  // Obsługa animacji "ripple" przy kliknięciu przycisku
  const handleRipple = (e) => {
    const button = e.currentTarget; // Referencja do klikniętego przycisku
    const ripple = document.createElement("span"); // Tworzymy element ripple
    const rect = button.getBoundingClientRect(); // Pobieramy pozycję przycisku
    const size = Math.max(button.offsetWidth, button.offsetHeight); // Określenie średnicy ripple

    // Ustawiamy pozycję i rozmiar efektu ripple
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = "ripple"; // Dodajemy klasę stylującą

    button.appendChild(ripple); // Wstawiamy ripple do DOM

    // Usunięcie ripple po czasie (600 ms)
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Rejestracja</h2>

        {/* Formularz rejestracyjny */}
        <form onSubmit={handleSubmit}>
          {/* Pole: nazwa użytkownika z ikoną */}
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

          {/* Pole: hasło z ikoną */}
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

          {/* Wyświetlenie komunikatu błędu, jeśli wystąpił */}
          {error && <p className="error">{error}</p>}

          {/* Przycisk rejestracji z animacją ripple */}
          <button type="submit" className="ripple-button" onClick={handleRipple}>
            Zarejestruj się
          </button>
        </form>

        {/* Link do logowania jeśli użytkownik już posiada konto */}
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
