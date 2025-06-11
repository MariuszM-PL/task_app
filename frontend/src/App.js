import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routing klienta
import { ToastContainer } from 'react-toastify'; // Powiadomienia typu toast
import 'react-toastify/dist/ReactToastify.css'; // Styl domyślny dla toastów

// Importy stron komponentowych
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddTaskPage from './pages/AddTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  // Główny komponent aplikacji – zawiera routing oraz globalne powiadomienia
  return (
    <>
      {/* Główna struktura routingu */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-task" element={<AddTaskPage />} />
          <Route path="/edit-task/:id" element={<EditTaskPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>

      {/* Konfiguracja kontenera toastów – globalny komponent */}
      <ToastContainer
        position="top-right"          // pozycja na ekranie
        autoClose={3000}             // zamyka się automatycznie po 3s
        hideProgressBar={false}      // pasek postępu widoczny
        newestOnTop={false}          // nowsze nie nad starszymi
        closeOnClick                 // zamykanie po kliknięciu
        rtl={false}                  // kierunek tekstu (lewo-prawo)
        pauseOnFocusLoss             // zatrzymuje licznik po zmianie zakładki
        draggable                    // można przeciągać
        pauseOnHover                 // zatrzymuje licznik po najechaniu
        limit={3}                    // maksymalnie 3 aktywne toast'y jednocześnie
        style={{ zIndex: 9999 }}     // żeby były zawsze nad innymi elementami
      />
    </>
  );
}

export default App;
