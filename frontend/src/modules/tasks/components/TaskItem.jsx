import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || '');

    const handleSave = () => {
        if (!editTitle.trim()) return;
        onEdit(task.id, { title: editTitle, description: editDescription });
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
                <div className="task-actions">
                    <button onClick={handleSave} className="btn-success">Guardar</button>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancelar</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`task-item ${task.is_completed ? 'completed' : ''}`}>
            <div className="task-content">
                <div className="task-header">
                    <input
                        type="checkbox"
                        checked={!!task.is_completed}
                        onChange={() => onToggle(task.id, !task.is_completed)}
                        className="task-checkbox"
                    />
                    <h3 className="task-title">{task.title}</h3>
                </div>
                {task.description && <p className="task-desc">{task.description}</p>}
                <span className="task-date">{new Date(task.created_at).toLocaleDateString()}</span>
            </div>

            <div className="task-actions">
                <button onClick={() => setIsEditing(true)} className="btn-edit" aria-label="Editar">✏️</button>
                <button onClick={() => onDelete(task.id)} className="btn-delete" aria-label="Eliminar">🗑️</button>
            </div>
        </div>
    );
};

export default TaskItem;
