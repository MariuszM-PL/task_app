import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji między stronami
import './HomePage.css'; // Import stylów CSS dla tej strony
import illustration from '../assets/taskmate.png'; // Ilustracja (np. logo, grafika tła)

const HomePage = () => {
  const navigate = useNavigate(); // Inicjalizacja hooka do przekierowywania

  return (
    <div className="home-container">
      {/* Ilustracja na środku strony */}
      <img
        src={illustration}
        alt="Ilustracja notatnika"
        className="illustration"
      />

      {/* Przycisk, który po kliknięciu przenosi na stronę logowania */}
      <button className="home-button" onClick={() => navigate('/login')}>
        START
      </button>
    </div>
  );
};

export default HomePage; // Eksport komponentu do użycia w innych plikach
