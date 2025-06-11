import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TaskCalendar.css';

// Lokalizator do obsługi dat przy użyciu moment.js
const localizer = momentLocalizer(moment);

// Komponent do wyświetlania kalendarza z zadaniami
const TaskCalendar = ({ tasks }) => {
  // Filtrowanie tylko tych zadań, które mają datę wykonania (due_date)
  const events = tasks
    .filter(task => task.due_date)
    .map(task => ({
      title: task.title,
      start: new Date(task.due_date), // początek = termin
      end: new Date(task.due_date),   // koniec = ten sam dzień (wydarzenie jednodniowe)
      allDay: true,
      resource: task, // do użycia np. przy kolorowaniu
    }));

  return (
    <div className="calendar-wrapper">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month']}            // tylko widok miesięczny
        defaultView="month"
        eventPropGetter={(event) => {
          // Kolor tła wydarzenia w zależności od kategorii
          let color = '#888';
          if (event.resource.category === 'Dom') color = '#007bff';      // niebieski
          else if (event.resource.category === 'Praca') color = '#dc3545'; // czerwony
          else if (event.resource.category === 'Szkoła') color = '#28a745'; // zielony

          return {
            style: {
              backgroundColor: color,
              color: 'white',
            },
          };
        }}
      />
    </div>
  );
};

export default TaskCalendar;
