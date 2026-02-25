import React, { useState } from 'react';
import api from '../services/api';

const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('media');
    const [dueDate, setDueDate] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        let imageUrl = null;

        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            try {
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.imageUrl;
            } catch (err) {
                console.error("Error subiendo imagen", err);
                alert("Hubo un error al subir la imagen.");
                setLoading(false);
                return;
            }
        }

        await onTaskAdded({
            title: title.trim(),
            description: description.trim(),
            priority,
            due_date: dueDate ? dueDate : null,
            image_url: imageUrl
        });

        setTitle('');
        setDescription('');
        setPriority('media');
        setDueDate('');
        setImage(null);
        // Reset file input
        const fileInput = document.getElementById('task-image-upload');
        if (fileInput) fileInput.value = '';
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

            <div className="task-form-options" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={loading}
                    className="task-input-date"
                    title="Fecha de vencimiento"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
                />
                <input
                    type="file"
                    id="task-image-upload"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    disabled={loading}
                    className="task-input-file"
                />
            </div>

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
