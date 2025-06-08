import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaCheck, FaUndo } from 'react-icons/fa';
import './DashboardPage.css';
import { toast } from 'react-toastify';
import TaskCalendar from '../components/TaskCalendar';
import { FaCog } from 'react-icons/fa'; // ikona do przycisku ustawień
import { IoIosAddCircle } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]); // lista zadań
  const [username, setUsername] = useState(''); // nazwa zalogowanego użytkownika
  const [selectedTask, setSelectedTask] = useState(null); // aktualnie zaznaczone zadanie
  const [filter, setFilter] = useState('all'); // filtr (wszystkie, ukończone, nieukończone)
  const [sort, setSort] = useState('date'); // sortowanie (data lub kategoria)
  const navigate = useNavigate();

  // Po załadowaniu komponentu, sprawdzamy czy użytkownik jest zalogowany
  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Brak sesji');
        return res.json();
      })
      .then((data) => {
        setUsername(data.username);
        loadTasks(); // pobranie zadań po udanym logowaniu
      })
      .catch(() => {
        navigate('/'); // jeśli nie jesteśmy zalogowani, wracamy na stronę główną
      });
  }, [navigate]);

  // Funkcja pobierająca zadania użytkownika
  const loadTasks = () => {
    fetch('http://localhost:5000/api/tasks', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  // Wylogowanie – czyści sesję i przenosi na Home
  const logout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      credentials: 'include',
    });
    navigate('/');
  };

  // Zmiana statusu ukończenia zadania
  const handleToggle = async (task) => {
    const updatedTask = { ...task, done: !task.done };

    await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedTask),
    });

    if (!task.done) {
      toast.success('Zadanie oznaczone jako ukończone');
    } else {
      toast.info('Zadanie oznaczone jako nieukończone');
    }

    loadTasks(); // odświeżenie listy
  };

  // Usuwanie zadania
  const handleDelete = async (taskId) => {
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    loadTasks();
    toast.error('Zadanie zostało usunięte');
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Filtrowanie zadań wg statusu i wyszukiwania
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.done;
      if (filter === 'incomplete') return !task.done;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Sortowanie zadań
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'date') {
      return new Date(a.due_date || Infinity) - new Date(b.due_date || Infinity);
    }
    if (sort === 'category') {
      return (a.category || '').localeCompare(b.category || '');
    }
    return 0;
  });

  // Klasa CSS zależna od kategorii zadania
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Dom': return 'dom';
      case 'Praca': return 'praca';
      case 'Szkoła': return 'szkola'; // poprawna kategoria
      default: return '';
    }
  };

  return (
    <div className="dashboard">
      {/* Nagłówek strony */}
      <div className="dashboard-header">
        <div className="header-buttons">
          <button className="settings-button" onClick={() => navigate('/settings')}>
            <FaCog /> Ustawienia
          </button>
          <button className="logout-button" onClick={logout}><IoMdLogOut /> Wyloguj</button>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-panel">
          <h2>Witaj, {username}!</h2>

          <div className="top-buttons">
            <button onClick={() => navigate('/add-task')}>
              <IoIosAddCircle /> Dodaj zadanie
            </button>
          </div>

          {/* Filtry i sortowanie */}
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

          {/* Lista zadań */}
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

        {/* Kolumna z kalendarzem i legendą */}
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
