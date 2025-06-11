import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Pobieranie ID z URL i obsługa nawigacji
import { toast } from 'react-toastify'; // Powiadomienia toastowe
import './EditTaskPage.css'; // Import arkusza stylów

const EditTaskPage = () => {
  const { id } = useParams(); // Wyciągnięcie parametru `id` z URL
  const navigate = useNavigate();

  // Stany komponentu
  const [task, setTask] = useState(null); // Obiekt zadania do edycji
  const [loading, setLoading] = useState(true); // Czy dane są w trakcie ładowania

  // Pobranie wszystkich zadań i wyszukanie tego o konkretnym ID
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks', {
      credentials: 'include', // Wysyłamy ciasteczka sesyjne
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(t => t.id === parseInt(id)); // Szukanie zadania po ID (z URL)
        if (found) setTask(found); // Jeśli znalezione – zapisujemy do stanu
        setLoading(false); // Kończymy ładowanie niezależnie od wyniku
      })
      .catch(() => setLoading(false)); // W razie błędu również kończymy ładowanie
  }, [id]);

  // Obsługa zmian w formularzu (aktualizacja stanu `task`)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  // Obsługa zapisu zmian do backendu
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja danych
    if (!task.title?.trim()) {
      toast.warn('⚠️ Tytuł jest wymagany');
      return;
    }
    if (task.title.length > 100) {
      toast.warn('⚠️ Tytuł nie może przekraczać 100 znaków');
      return;
    }
    if (task.description && task.description.length > 1000) {
      toast.warn('⚠️ Opis nie może przekraczać 1000 znaków');
      return;
    }

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(task)
    });

    toast.info('✅ Zadanie zostało edytowane!');
    setTimeout(() => navigate('/dashboard'), 1500); // Przekierowanie z lekkim opóźnieniem
  };

  // Widok ładowania lub błędu (brak zadania o podanym ID)
  if (loading) return <p className="loading">⏳ Ładowanie...</p>;
  if (!task) return <p className="error">❌ Nie znaleziono zadania.</p>;

  return (
    <div className="edit-task-container">
      <div className="edit-task-panel">
        <h2>✏️ Edytuj zadanie</h2>

        {/* Formularz edycji zadania */}
        <form onSubmit={handleSubmit} className="edit-task-form">
          {/* Pole: tytuł */}
          <input
            type="text"
            name="title"
            placeholder="Tytuł"
            value={task.title}
            onChange={handleChange}
            maxLength={100}
            required
          />

          {/* Pole: opis */}
          <textarea
            name="description"
            placeholder="Opis"
            value={task.description}
            onChange={handleChange}
            maxLength={1000}
          />

          {/* Pole: data wykonania */}
          <input
            type="date"
            name="due_date"
            value={task.due_date || ''}
            onChange={handleChange}
          />

          {/* Pole: kategoria */}
          <select
            name="category"
            value={task.category || ''}
            onChange={handleChange}
          >
            <option value="">Wybierz kategorię</option>
            <option value="Dom">Dom</option>
            <option value="Praca">Praca</option>
            <option value="Szkoła">Szkoła</option>
          </select>

          {/* Przyciski: zapisz lub anuluj */}
          <button type="submit">💾 Zapisz zmiany</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/dashboard')}
          >
            ↩️ Anuluj
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;
