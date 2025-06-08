import React from 'react';
import './Alert.css';

// Komponent Alert przyjmuje 3 propsy:
// - message: tekst do wyświetlenia
// - type: typ alertu (success, error, info) – wpływa na kolor
// - onClose: funkcja wywoływana po kliknięciu "×"
const Alert = ({ message, type, onClose }) => {
  if (!message) return null; // Jeśli nie ma wiadomości, nie wyświetlaj nic

  return (
    <div className={`alert ${type}`}> {/* Dynamiczna klasa CSS na podstawie typu alertu */}
      <span>{message}</span>
      <button onClick={onClose}>×</button> {/* Przycisk do zamykania alertu */}
    </div>
  );
};

export default Alert;
