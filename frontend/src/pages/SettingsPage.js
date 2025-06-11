import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji (przekierowań)
import { toast } from 'react-toastify'; // Powiadomienia typu "toast"
import './SettingsPage.css'; // Styl lokalny dla strony ustawień

const SettingsPage = () => {
  // Stany dla nazwy użytkownika i pól hasła
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(''); // Komunikat walidacyjny

  const navigate = useNavigate(); // Do przekierowywania użytkownika

  // Po załadowaniu komponentu pobierz dane użytkownika (jeśli zalogowany)
  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include', // Wysyłamy ciasteczka sesyjne
    })
      .then(res => {
        if (!res.ok) throw new Error('Brak autoryzacji');
        return res.json();
      })
      .then(data => setUsername(data.username))
      .catch(() => navigate('/')); // Jeśli błąd – przekieruj na stronę główną
  }, [navigate]);

  // Obsługa wysłania formularza zmiany hasła
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Walidacja długości nowego hasła
    if (newPassword.length < 6) {
      setError('Nowe hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    if (newPassword.length > 100) {
      setError('Nowe hasło nie może przekraczać 100 znaków.');
      return;
    }

    // Wysłanie danych do backendu
    const response = await fetch('http://localhost:5000/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      // Jeśli sukces – toast i reset pól
      toast.success('✅ Hasło zostało zmienione!');
      setCurrentPassword('');
      setNewPassword('');
      setError('');
    } else {
      // Jeśli błąd – wyświetl komunikat
      setError(data.message || 'Wystąpił błąd podczas zmiany hasła.');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h2>⚙️ Ustawienia konta</h2>
        <p><strong>Zalogowany jako:</strong> {username}</p>

        {/* Formularz zmiany hasła */}
        <form className="settings-form" onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Obecne hasło"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nowe hasło"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />

          {/* Komunikat walidacyjny lub błąd z backendu */}
          {error && <p className="error">{error}</p>}

          <button type="submit">💾 Zmień hasło</button>
        </form>

        {/* Przycisk powrotu */}
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ↩️ Powrót do zadań
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
