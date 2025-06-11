import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook do przekierowań
import './AddTaskPage.css'; // Import stylów CSS
import { toast } from 'react-toastify'; // Powiadomienia

const AddTaskPage = () => {
  // Stany lokalne dla pól formularza
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Dom'); // domyślnie "Dom"
  const navigate = useNavigate();

  // Obsługa przesłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title,
        description,
        due_date: dueDate,
        category,
      }),
    });

    if (response.ok) {
      toast.info('✅ Dodano nowe zadanie', { autoClose: 2000 });
      navigate('/dashboard');
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
            required
          />

          <textarea
            placeholder="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

          {/* Przycisk zatwierdzenia */}
          <button type="submit">💾 Dodaj</button>

          {/* Anulowanie i powrót */}
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
