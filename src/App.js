import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Input, Calendar } from './components/ui';
// zapytac chatu jak sie tego uzywa i moze zmienic na to co kazali ale to latwiej wyglada
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { saveAs } from 'file-saver';

const createTask = (
  title,
  category,
  priority,
  dueDate,
  tags = [],
  subtasks = []
) => ({
  id: Date.now(),
  title,
  category,
  priority,
  dueDate,
  createdAt: new Date().toISOString(),
  completed: false,
  tags,
});
// taski

const useTasks = () => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // naprawic bo gowno nie dziala
  const addTask = (task) => setTasks((prev) => [...prev, task]);
  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  const importTasks = (json) => setTasks(json);
  const exportTasks = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'zadankawpliku.json');
  };

  return { tasks, addTask, toggleTask, importTasks, exportTasks };
};

export default function App() {
  const { tasks, addTask, toggleTask, importTasks, exportTasks } = useTasks();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tags, setTags] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(
      createTask(
        title.trim(),
        category.trim(),
        priority.trim(),
        dueDate.toISOString(),
        tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );
    setTitle('');
    setTags('');
  };

  const handleImport = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importTasks(json);
      } catch {
        alert('Nieprawidłowy plik JSON');
      }
    };
    if (e.target.files[0]) {
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <header style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#4f46e5' }}>
          Moja zaawansowana ToDo lista w Reaktorze
        </h1>
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
          Pyk pyk pyk jako tako i zadanka zrobione
        </p>
      </header>

      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Button onClick={exportTasks}>Pobierz zadania</Button>
        <label
          htmlFor="file-upload"
          style={{
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 12,
            cursor: 'pointer',
            userSelect: 'none',
            display: 'inline-block',
          }}
        >
          Wczytaj JSON
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 40,
          alignItems: 'start',
        }}
      >
        <Card className="form-card">
          <CardContent>
            <Input
              placeholder="Tytuł zadania"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-lg"
            />
            <Input
              placeholder="Kategoria (Do zrobienia, Praca)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              placeholder="Priorytet (Niski, Śerdni, Wysoki)"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
            <Input
              placeholder="Tagi (oddzielone przecinkami)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Calendar selected={dueDate} onSelect={setDueDate} />
            <Button onClick={handleAdd} style={{ marginTop: 12 }}>
              Dodaj zadanie
            </Button>
          </CardContent>
        </Card>

        <Card
          className="tasks-list-card"
          style={{ maxHeight: 450, overflowY: 'auto' }}
        >
          <CardContent
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {tasks.length === 0 && (
              <p style={{ color: '#9ca3af' }}>Brak zadan didaj sobie jakieś</p>
            )}
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: task.completed ? '#d1fae5' : '#f3f4f6',
                  padding: 12,
                  borderRadius: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#059669' : '#111827',
                    }}
                  >
                    {task.title}
                  </h3>
                  <small style={{ color: '#6b7280' }}>
                    {task.category} | {task.priority} | Termin :{' '}
                    {task.dueDate.split('T')[0]}
                    <br />
                    Tagi: {task.tags.join(', ')}
                  </small>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toggleTask(task.id)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {task.completed ? 'Odukończ' : 'Ukończ'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card style={{ padding: 20 }}>
        <CardContent>
          <h2 style={{ marginBottom: 20, color: '#4f46e5' }}>Statytsyki</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData(tasks)}>
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="completed" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}

function getChartData(tasks) {
  const grouped = {};
  tasks.forEach((task) => {
    if (!task.completed) return;
    const date = new Date(task.createdAt).toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });
  return Object.entries(grouped).map(([date, completed]) => ({
    date,
    completed,
  }));
}
