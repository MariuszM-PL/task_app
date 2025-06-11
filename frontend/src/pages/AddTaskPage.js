import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do przekierowań między stronami
import './AddTaskPage.css'; // Import pliku stylów
import { toast } from 'react-toastify'; // Biblioteka do powiadomień typu toast

const AddTaskPage = () => {
  // Stany lokalne dla danych formularza
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Dom'); // domyślnie "Dom"
  const navigate = useNavigate();

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zablokowanie domyślnego przeładowania strony

    // Walidacja danych przed wysłaniem
    if (!title.trim()) {
      toast.warn('⚠️ Tytuł jest wymagany');
      return;
    }
    if (title.length > 100) {
      toast.warn('⚠️ Tytuł nie może przekraczać 100 znaków');
      return;
    }
    if (description.length > 1000) {
      toast.warn('⚠️ Opis nie może przekraczać 1000 znaków');
      return;
    }

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Wysłanie ciasteczek sesyjnych
      body: JSON.stringify({
        title,
        description,
        due_date: dueDate,
        category,
      }),
    });

    if (response.ok) {
      // Wyczyść pola formularza
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategory('Dom');
      toast.info('✅ Dodano nowe zadanie', { autoClose: 2000 });
      navigate('/dashboard'); // Powrót do panelu użytkownika
    } else {
      toast.error('❌ Błąd podczas dodawania zadania');
    }
  };

  return (
    <div className="add-task-container">
      <div className="add-task-panel">
        <h2>📝 Dodaj zadanie</h2>

        {/* Formularz dodawania zadania */}
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tytuł"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />

          <textarea
            placeholder="Napisz coś więcej o zadaniu…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Dom">Dom</option>
            <option value="Praca">Praca</option>
            <option value="Szkoła">Szkoła</option>
          </select>

          {/* Przycisk zatwierdzający dodanie */}
          <button type="submit">💾 Dodaj</button>

          {/* Przycisk anulowania i powrotu */}
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

export default AddTaskPage;
