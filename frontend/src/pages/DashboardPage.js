import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Ikony
import { FaTrashAlt, FaEdit, FaCheck, FaUndo, FaCog } from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

// Komponent kalendarza
import TaskCalendar from '../components/TaskCalendar';

// Styl
import './DashboardPage.css';

const DashboardPage = () => {
  // === STANY ===
  const [tasks, setTasks] = useState([]); // lista zadań użytkownika
  const [username, setUsername] = useState(''); // aktualna nazwa użytkownika
  const [selectedTask, setSelectedTask] = useState(null); // ID zaznaczonego zadania
  const [filter, setFilter] = useState('all'); // filtr statusu
  const [sort, setSort] = useState('date'); // tryb sortowania
  const [searchTerm, setSearchTerm] = useState(''); // fraza do wyszukiwania
  const navigate = useNavigate();

  // === SPRAWDZANIE AUTORYZACJI I POBRANIE ZADAŃ ===
  useEffect(() => {
    fetch('http://localhost:5000/api/user', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Brak sesji');
        return res.json();
      })
      .then(data => {
        setUsername(data.username);
        loadTasks(); // załaduj zadania po uwierzytelnieniu
      })
      .catch(() => navigate('/')); // przekierowanie przy braku sesji
  }, [navigate]);

  // === FUNKCJA POBIERANIA ZADAŃ ===
  const loadTasks = () => {
    fetch('http://localhost:5000/api/tasks', { credentials: 'include' })
      .then(res => res.json())
      .then(setTasks);
  };

  // === WYLOGOWANIE UŻYTKOWNIKA ===
  const logout = async () => {
    await fetch('http://localhost:5000/api/logout', { credentials: 'include' });
    navigate('/');
  };

  // === ZMIANA STATUSU ZADANIA ===
  const handleToggle = async (task) => {
    const updatedTask = { ...task, done: !task.done };

    await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedTask),
    });

    toast[!task.done ? 'success' : 'info'](
      `Zadanie oznaczone jako ${!task.done ? 'ukończone' : 'nieukończone'}`
    );
    loadTasks();
  };

  // === USUWANIE ZADANIA ===
  const handleDelete = async (taskId) => {
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    loadTasks();
    toast.error('Zadanie zostało usunięte');
  };

  // === FILTROWANIE I SORTOWANIE ===
  const filteredTasks = tasks
    .filter(task =>
      filter === 'completed' ? task.done :
      filter === 'incomplete' ? !task.done :
      true
    )
    .filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      return new Date(a.due_date || Infinity) - new Date(b.due_date || Infinity);
    }
    if (sort === 'category') {
      return (a.category || '').localeCompare(b.category || '');
    }
    return 0;
  });

  // === KOLOROWE KROPKI WEDŁUG KATEGORII ===
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Dom': return 'dom';
      case 'Praca': return 'praca';
      case 'Szkoła': return 'szkola';
      default: return '';
    }
  };

  // === RENDER ===
  return (
    <div className="dashboard">
      {/* GÓRNY PANEL */}
      <div className="dashboard-header">
        <div className="header-buttons">
          <button className="settings-button" onClick={() => navigate('/settings')}>
            <FaCog /> Ustawienia
          </button>
          <button className="logout-button" onClick={logout}>
            <IoMdLogOut /> Wyloguj
          </button>
        </div>
      </div>

      {/* GŁÓWNA ZAWARTOŚĆ */}
      <div className="content-wrapper">
        {/* LEWA KOLUMNA – ZADANIA */}
        <div className="main-panel">
          <h2>Witaj, {username}!</h2>

          <div className="top-buttons">
            <button onClick={() => navigate('/add-task')}>
              <IoIosAddCircle /> Dodaj zadanie
            </button>
          </div>

          {/* FILTRY */}
          <div className="filters">
            <label>Filtruj:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Wszystkie</option>
              <option value="incomplete">Nieukończone</option>
              <option value="completed">Ukończone</option>
            </select>

            <label>Sortuj:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date">Według terminu</option>
              <option value="category">Według kategorii</option>
            </select>

            <label>Szukaj:</label>
            <input
              type="text"
              placeholder="Wpisz tytuł zadania"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* LISTA ZADAŃ */}
          <h3>Twoje zadania:</h3>
          {sortedTasks.length === 0 ? (
            <p>Brak zadań</p>
          ) : (
            <ul className="task-list">
              {sortedTasks.map((task) => (
                <li key={task.id} className={task.done ? 'done' : ''}>
                  <div className="task-header">
                    <div className="task-title-with-dot">
                      <span className={`dot ${getCategoryClass(task.category)}`}></span>
                      <span className="task-title">{task.title}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={selectedTask === task.id}
                      onChange={() =>
                        setSelectedTask(selectedTask === task.id ? null : task.id)
                      }
                    />
                  </div>

                  {task.description && (
                    <div className="task-description">– {task.description}</div>
                  )}
                  <div className="task-meta">
                    <small>
                      {task.due_date ? `Termin: ${task.due_date}` : '(brak terminu)'}
                    </small>
                    {task.category && <small> • Kategoria: {task.category}</small>}
                  </div>

                  {/* AKCJE PO ZAZNACZENIU */}
                  {selectedTask === task.id && (
                    <div className="task-actions">
                      {task.done ? (
                        <FaUndo
                          title="Oznacz jako nieukończone"
                          className="icon blue"
                          onClick={() => handleToggle(task)}
                        />
                      ) : (
                        <FaCheck
                          title="Oznacz jako ukończone"
                          className="icon green"
                          onClick={() => handleToggle(task)}
                        />
                      )}
                      <FaEdit
                        title="Edytuj"
                        className="icon blue"
                        onClick={() => navigate(`/edit-task/${task.id}`)}
                      />
                      <FaTrashAlt
                        title="Usuń"
                        className="icon red"
                        onClick={() => handleDelete(task.id)}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* PRAWA KOLUMNA – KALENDARZ */}
        <div className="calendar-column">
          <h3>Kalendarz zadań</h3>
          <TaskCalendar tasks={tasks} />
          <div className="legend">
            <p><span className="dot dom"></span> Dom</p>
            <p><span className="dot praca"></span> Praca</p>
            <p><span className="dot szkola"></span> Szkoła</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
