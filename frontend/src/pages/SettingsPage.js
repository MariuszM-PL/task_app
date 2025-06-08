import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SettingsPage.css';

const SettingsPage = () => {
  const [username, setUsername] = useState(''); // nazwa użytkownika
  const [currentPassword, setCurrentPassword] = useState(''); // pole: obecne hasło
  const [newPassword, setNewPassword] = useState(''); // pole: nowe hasło
  const navigate = useNavigate();

  // Pobranie danych użytkownika po załadowaniu komponentu
  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUsername(data.username)) // ustawiamy nazwę użytkownika
      .catch(() => navigate('/')); // przekieruj na login przy błędzie
  }, [navigate]);

  // Obsługa zmiany hasła
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/change-password', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Hasło zostało zmienione');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      toast.error(`❌ ${data.message || 'Błąd przy zmianie hasła'}`);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h2>⚙️ Ustawienia konta</h2>
        <p><strong>Zalogowany jako:</strong> {username}</p>

        <form onSubmit={handlePasswordChange} className="settings-form">
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
          <button type="submit">💾 Zmień hasło</button>
        </form>

        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ↩️ Powrót do zadań
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
