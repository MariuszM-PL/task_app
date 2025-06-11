import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do przekierowań
import { toast } from 'react-toastify'; // Powiadomienia toast
import './SettingsPage.css'; // Import stylów

const SettingsPage = () => {
  // Stany dla danych użytkownika i pól formularza
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // Po załadowaniu strony pobieramy nazwę użytkownika (jeśli zalogowany)
  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include', // ważne – ciasteczka sesyjne
    })
      .then(res => {
        if (!res.ok) throw new Error('Brak autoryzacji');
        return res.json();
      })
      .then(data => setUsername(data.username))
      .catch(() => navigate('/')); // Brak sesji – przekierowanie
  }, [navigate]);

  // Obsługa formularza zmiany hasła
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('✅ Hasło zostało zmienione!');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      toast.error(`❌ ${data.message || 'Wystąpił błąd'}`);
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
          <button type="submit">💾 Zmień hasło</button>
        </form>

        {/* Przycisk powrotu do dashboardu */}
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ↩️ Powrót do zadań
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
