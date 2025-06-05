import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(t => t.id === parseInt(id));
        if (found) setTask(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(task)
    });

    toast.info('Zadanie zostało edytowane!');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  if (loading) return <p>Ładowanie...</p>;
  if (!task) return <p>Nie znaleziono zadania.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edytuj zadanie</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Tytuł"
          value={task.title}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="Opis"
          value={task.description}
          onChange={handleChange}
        /><br />
        <input
          type="date"
          name="due_date"
          value={task.due_date || ''}
          onChange={handleChange}
        /><br />
        <select
          name="category"
          value={task.category || ''}
          onChange={handleChange}
        >
          <option value="">Wybierz kategorię</option>
          <option value="Dom">Dom</option>
          <option value="Praca">Praca</option>
          <option value="Szkoła">Szkoła</option>
        </select><br />
        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
};

export default EditTaskPage;
