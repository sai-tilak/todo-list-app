// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000; // You can change this port if needed

app.use(bodyParser.json());
app.use(cors());

let tasks = [];

// API to list all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// API to add a new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title };
  tasks.push(newTask);
  res.json(newTask);
});

// API to edit/update an existing task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title } = req.body;

  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  taskToUpdate.title = title;
  res.json(taskToUpdate);
});

// API to delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  res.json({ message: 'Task deleted successfully.' });
});

// API to copy a task
app.post('/api/tasks/copy/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskToCopy = tasks.find((task) => task.id === taskId);

  if (!taskToCopy) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const newTask = { ...taskToCopy, id: tasks.length + 1 };
  tasks.push(newTask);
  res.json(newTask);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
