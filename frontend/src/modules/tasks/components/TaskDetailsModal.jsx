import React from 'react';

const TaskDetailsModal = ({ task, onClose }) => {
    if (!task) return null;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        return `${apiUrl}/public${path}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Detalles de la Tarea</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
                        &times;
                    </button>
                </div>
                <div className={`modal-body ${task.image_url ? 'has-image' : ''}`}>
                    <div className="modal-details-col">
                        <div className="detail-group">
                            <label>Título:</label>
                            <p className="detail-title">{task.title}</p>
                        </div>

                        <div className="detail-group">
                            <label>Descripción:</label>
                            <p className="detail-description">
                                {task.description ? task.description : <span className="text-muted">Sin descripción</span>}
                            </p>
                        </div>

                        <div className="detail-row">
                            <div className="detail-group">
                                <label>Prioridad:</label>
                                <span className={`task-badge badge-${task.priority || 'media'}`}>
                                    {task.priority || 'media'}
                                </span>
                            </div>
                            <div className="detail-group">
                                <label>Estado:</label>
                                <span className={`status-badge ${task.is_completed ? 'completed' : 'pending'}`}>
                                    {task.is_completed ? 'Completada' : 'Pendiente'}
                                </span>
                            </div>
                        </div>

                        <div className="detail-group">
                            <label>Fecha de creación:</label>
                            <p className="detail-date">{formatDate(task.created_at)}</p>
                        </div>
                    </div>

                    {task.image_url && (
                        <div className="modal-image-col">
                            <img
                                src={getImageUrl(task.image_url)}
                                alt={`Imagen de tarea: ${task.title}`}
                                className="modal-full-image"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
