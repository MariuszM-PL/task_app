import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji między stronami
import './HomePage.css'; // Styl dla strony głównej
import illustration from '../assets/taskmate.png'; // Ilustracja np. z logo aplikacji

const HomePage = () => {
  const navigate = useNavigate(); // Hook do zmiany ścieżki (routing)

  return (
    <div className="home-container">
      {/* Ilustracja główna */}
      <img
        src={illustration}
        alt="Ilustracja notatnika"
        className="illustration"
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
