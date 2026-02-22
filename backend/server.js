require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Webgenda Tasks API' });
});

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'OK', database: 'connected', message: 'La base de datos está funcionando correctamente.' });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ status: 'ERROR', database: 'disconnected', message: 'No se pudo conectar a la base de datos.', error: error.message });
    }
});

const checkDatabaseAndStart = async () => {
    try {
        console.log('⏳ Verificando conexión a la base de datos...');

        await pool.query('SELECT 1');
        console.log('✅ Conexión a MariaDB exitosa.');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                github_id VARCHAR(255) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla "Users" verificada.');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla "Tasks" verificada.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Error fatal al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

checkDatabaseAndStart();
