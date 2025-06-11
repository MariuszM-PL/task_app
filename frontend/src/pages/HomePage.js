import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji między stronami
import './HomePage.css'; // Import stylów
import logo from '../assets/taskmate.png'; // logo aplikacji

const HomePage = () => {
  const navigate = useNavigate(); // Hook do zmiany ścieżki (routing)

  return (
    <div className="home-container">
      {/* Logo główne aplikacji */}
      <img
        src={logo}
        alt="Logo główne aplikacji"
        className="logo"
      />

      {/* Przycisk START przekierowuje do logowania */}
      <button
        className="home-button"
        onClick={() => navigate('/login')}
        aria-label="Rozpocznij korzystanie z aplikacji"
      >
        START
      </button>
    </div>
  );
};

export default HomePage;
