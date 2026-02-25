import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit, onView }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');
    const [editPriority, setEditPriority] = useState(task.priority || 'media');
    const [editDueDate, setEditDueDate] = useState(task.due_date ? task.due_date.split('T')[0] : '');

    // Construir la URL completa para la imagen si existe
    const getImageUrl = (path) => {
        if (!path) return null;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        return `${apiUrl}/public${path}`;
    };

    const handleSave = () => {
        if (!editTitle.trim()) return;
        onEdit(task.id, {
            title: editTitle,
            description: editDescription,
            priority: editPriority,
            due_date: editDueDate || null
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="task-item editing">
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="task-edit-title"
                    autoFocus
                />
                <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="task-edit-desc"
                    rows="2"
                />
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="priority-select"
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                    <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="task-input-date"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
                    />
                </div>
                <div className="task-actions">
                    <button onClick={handleSave} className="btn-success">Guardar</button>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancelar</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`task-item ${task.is_completed ? 'completed' : ''}`}>
            <div
                className="task-content"
                onClick={() => onView && onView(task)}
                title="Haz clic para ver más detalles"
            >
                {task.image_url && (
                    <div className="task-thumb-container">
                        <img
                            src={getImageUrl(task.image_url)}
                            alt={`Imagen para ${task.title}`}
                            className="task-thumb"
                        />
                    </div>
                )}

                <div className="task-info">
                    <div className="task-header" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={!!task.is_completed}
                            onChange={() => onToggle(task.id, !task.is_completed)}
                            className="task-checkbox"
                        />
                        <h3 className="task-title">{task.title}</h3>
                        <span className={`task-badge badge-${task.priority || 'media'}`}>
                            {task.priority || 'media'}
                        </span>
                    </div>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                        <span className="task-date">{new Date(task.created_at).toLocaleDateString()}</span>
                        {task.due_date && (
                            <span className="task-due-date" style={{ color: '#ff6b6b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📅 Vence: {new Date(task.due_date).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setIsEditing(true)} className="btn-edit" aria-label="Editar">✏️</button>
                <button onClick={() => onDelete(task.id)} className="btn-delete" aria-label="Eliminar">🗑️</button>
            </div>
        </div>
    );
};

export default TaskItem;
