import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, title, onToggle, onDelete, onEdit }) => {
    return (
        <div className="task-list-section">
            <h2 className="section-title">{title} ({tasks.length})</h2>

            {tasks.length === 0 ? (
                <p className="empty-state">No hay tareas en esta sección.</p>
            ) : (
                <div className="task-list">
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskList;
