import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import api from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const TasksDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            setError('Error al cargar las tareas.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (newTask) => {
        try {
            const response = await api.post('/tasks', newTask);
            setTasks([response.data, ...tasks]);
        } catch (err) {
            alert('Error al agregar la tarea.');
        }
    };

    const handleToggleTask = async (id, is_completed) => {
        try {
            const response = await api.put(`/tasks/${id}`, { is_completed });
            setTasks(tasks.map(task => task.id === id ? { ...task, is_completed: response.data.is_completed } : task));
        } catch (err) {
            alert('Error al actualizar la tarea.');
        }
    };

    const handleEditTask = async (id, updatedData) => {
        try {
            const response = await api.put(`/tasks/${id}`, updatedData);
            setTasks(tasks.map(task => task.id === id ? { ...task, ...response.data } : task));
        } catch (err) {
            alert('Error al editar la tarea.');
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            alert('Error al eliminar la tarea.');
        }
    };

    const pendingTasks = tasks.filter(task => !task.is_completed);
    const completedTasks = tasks.filter(task => task.is_completed);

    if (loading) return <div className="loading-screen">Cargando tareas...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Mis Tareas</h1>
                    <p>Hola, {user?.email}</p>
                </div>
                <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
            </header>

            {error && <div className="error-message">{error}</div>}

            <main className="dashboard-main">
                <section className="dashboard-form-section">
                    <TaskForm onTaskAdded={handleAddTask} />
                </section>

                <div className="dashboard-lists">
                    <TaskList
                        title="Pendientes"
                        tasks={pendingTasks}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                    />
                    <TaskList
                        title="Completadas"
                        tasks={completedTasks}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                    />
                </div>
            </main>
        </div>
    );
};

export default TasksDashboard;
