const pool = require('../config/db');

const getTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query(
            'SELECT * FROM Tasks WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas.' });
    }
};

const createTask = async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'El título es obligatorio.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Tasks (user_id, title, description) VALUES (?, ?, ?)',
            [req.user.id, title, description || null]
        );

        const newTask = {
            id: result.insertId,
            user_id: req.user.id,
            title,
            description: description || null,
            is_completed: 0,
            created_at: new Date().toISOString()
        };

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la tarea.' });
    }
};

const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description, is_completed } = req.body;

    try {
        const [tasks] = await pool.query('SELECT * FROM Tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada.' });
        }

        const task = tasks[0];

        const updatedTitle = title !== undefined ? title : task.title;
        const updatedDescription = description !== undefined ? description : task.description;
        const updatedIsCompleted = is_completed !== undefined ? is_completed : task.is_completed;

        await pool.query(
            'UPDATE Tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?',
            [updatedTitle, updatedDescription, updatedIsCompleted, taskId]
        );

        res.json({
            ...task,
            title: updatedTitle,
            description: updatedDescription,
            is_completed: updatedIsCompleted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la tarea.' });
    }
};

const deleteTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        const [result] = await pool.query('DELETE FROM Tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada.' });
        }

        res.json({ message: 'Tarea eliminada exitosamente.', id: taskId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la tarea.' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
