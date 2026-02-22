import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        await onTaskAdded({ title: title.trim(), description: description.trim() });
        setTitle('');
        setDescription('');
        setLoading(false);
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="¿Qué necesitas hacer hoy?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="task-input-title"
                disabled={loading}
            />
            <textarea
                placeholder="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="task-input-desc"
                rows="2"
                disabled={loading}
            ></textarea>
            <button type="submit" className="btn-primary" disabled={loading || !title.trim()}>
                {loading ? 'Agregando...' : 'Agregar Tarea'}
            </button>
        </form>
    );
};

export default TaskForm;
