import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import illustration from '../assets/taskmate.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img
        src={illustration}
        alt="Ilustracja notatnika"
        className="illustration"
      />
      <button className="home-button" onClick={() => navigate('/login')}>
        START
      </button>
    </div>
  );
};

export default HomePage;
