import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('media');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        await onTaskAdded({ title: title.trim(), description: description.trim(), priority });
        setTitle('');
        setDescription('');
        setPriority('media');
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

            <div className="task-form-footer">
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="priority-select"
                    disabled={loading}
                >
                    <option value="baja">Prioridad: Baja</option>
                    <option value="media">Prioridad: Media</option>
                    <option value="alta">Prioridad: Alta</option>
                </select>

                <button type="submit" className="btn-primary" disabled={loading || !title.trim()}>
                    {loading ? 'Agregando...' : 'Agregar Tarea'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
