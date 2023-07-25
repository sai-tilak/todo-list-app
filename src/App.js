// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTaskId, setEditTaskId] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTaskTitle) {
      try {
        const response = await axios.post('http://localhost:5000/api/tasks', {
          title: newTaskTitle,
        });
        setTasks([...tasks, response.data]);
        setNewTaskTitle('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const editTask = async (taskId, title) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { title });
      fetchTasks();
      setEditTaskId(0);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const copyTask = async (taskId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/tasks/copy/${taskId}`
      );
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error copying task:', error);
    }
  };

  return (
    <div className="App">
      <h1>Tilak TO-DO List</h1>
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) =>
                    setTasks((prevTasks) =>
                      prevTasks.map((prevTask) =>
                        prevTask.id === task.id
                          ? { ...prevTask, title: e.target.value }
                          : prevTask
                      )
                    )
                  }
                />
                <button onClick={() => editTask(task.id, task.title)}>
                  Save
                </button>
                <button onClick={() => setEditTaskId(0)}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{task.title}</span>
                <button onClick={() => setEditTaskId(task.id)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
                <button onClick={() => copyTask(task.id)}>Copy</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
