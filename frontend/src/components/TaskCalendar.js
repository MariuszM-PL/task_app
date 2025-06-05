import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TaskCalendar.css';

const localizer = momentLocalizer(moment);

const TaskCalendar = ({ tasks }) => {
  const events = tasks
    .filter(task => task.due_date)
    .map(task => ({
      title: task.title,
      start: new Date(task.due_date),
      end: new Date(task.due_date),
      allDay: true,
      resource: task,
    }));

  return (
    <div style={{ height: 400 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month']}
        defaultView="month"
        eventPropGetter={(event) => {
          let color = '#888';
          if (event.resource.category === 'Dom') color = '#007bff';
          else if (event.resource.category === 'Praca') color = '#dc3545';
          else if (event.resource.category === 'Szkoła') color = '#28a745';
          return { style: { backgroundColor: color, color: 'white' } };
        }}
      />
    </div>
  );
};

export default TaskCalendar;
