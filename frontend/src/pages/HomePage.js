import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji między stronami
import './HomePage.css'; // Import stylów CSS dla tej strony
import logo from '../assets/taskmate.png'; // Import graficznego logo aplikacji

const HomePage = () => {
  const navigate = useNavigate(); // Hook z react-router-dom do zmiany ścieżki (nawigacja)

  return (
    <div className="home-container">
      {/* Logo aplikacji umieszczone na środku strony */}
      <img
        src={logo} // ścieżka do grafiki logo
        alt="Logo główne aplikacji" // tekst alternatywny dla dostępności
        className="logo" // stylizacja za pomocą klasy CSS
      />

      {/* Główny przycisk START przekierowujący użytkownika do ekranu logowania */}
      <button
        className="home-button" // styl przycisku
        onClick={() => navigate('/login')} // kliknięcie przenosi do strony logowania
        aria-label="Rozpocznij korzystanie z aplikacji" // a11y: dostępność dla czytników ekranu
      >
        START
      </button>
    </div>
  );
};

export default HomePage;
