import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Pobieranie parametrów URL i nawigacja
import { toast } from 'react-toastify'; // Powiadomienia toastowe
import './EditTaskPage.css'; // Import stylów

const EditTaskPage = () => {
  const { id } = useParams(); // ID zadania z URL
  const navigate = useNavigate();

  // Stany komponentu
  const [task, setTask] = useState(null); // Dane konkretnego zadania
  const [loading, setLoading] = useState(true); // Czy dane się ładują

  // Pobranie danych zadania po załadowaniu komponentu
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(t => t.id === parseInt(id)); // Znalezienie zadania po ID
        if (found) setTask(found);
        setLoading(false);
      })
      .catch(() => setLoading(false)); // Obsługa błędu
  }, [id]);

  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  // Obsługa zapisu zmian
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(task)
    });

    toast.info('✅ Zadanie zostało edytowane!');
    setTimeout(() => navigate('/dashboard'), 1500); // Opóźnienie powrotu
  };

  // Widok w trakcie ładowania lub gdy nie znaleziono zadania
  if (loading) return <p className="loading">⏳ Ładowanie...</p>;
  if (!task) return <p className="error">❌ Nie znaleziono zadania.</p>;

  return (
    <div className="edit-task-container">
      <div className="edit-task-panel">
        <h2>✏️ Edytuj zadanie</h2>

        {/* Formularz edycji zadania */}
        <form onSubmit={handleSubmit} className="edit-task-form">
          <input
            type="text"
            name="title"
            placeholder="Tytuł"
            value={task.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Opis"
            value={task.description}
            onChange={handleChange}
          />

          <input
            type="date"
            name="due_date"
            value={task.due_date || ''}
            onChange={handleChange}
          />

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
