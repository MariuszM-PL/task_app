import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTaskPage.css';
import { toast } from 'react-toastify';

const AddTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Dom');
  const navigate = useNavigate();

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
        category
      })
    });

    if (response.ok) {
      toast.info('Dodano nowe zadanie', { autoClose: 2000 });
      navigate('/dashboard');
    } else {
      toast.error('Błąd podczas dodawania zadania');
    }
  };

  return (
    <div className="add-task-page">
      <h2>Dodaj zadanie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br />
        <textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        /><br />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Dom">Dom</option>
          <option value="Praca">Praca</option>
          <option value="Szkoła">Szkoła</option>
        </select><br />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default AddTaskPage;
