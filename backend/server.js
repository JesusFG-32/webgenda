require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');
const authenticateToken = require('./middleware/authMiddleware');

app.use('/api/public', express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);

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

        console.log('⏳ Verificando y creando base de datos si no existe...');
        await initializeDatabase();

        console.log('✅ Base de datos seleccionada y conexión exitosa.');
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
                priority ENUM('baja', 'media', 'alta') DEFAULT 'media',
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);
        try {
            await pool.query('ALTER TABLE Tasks ADD COLUMN priority ENUM("baja", "media", "alta") DEFAULT "media"');
        } catch (alterError) {
            if (alterError.code !== 'ER_DUP_FIELDNAME') throw alterError;
        }

        try {
            await pool.query('ALTER TABLE Tasks ADD COLUMN image_url VARCHAR(255)');
        } catch (alterError) {
            if (alterError.code !== 'ER_DUP_FIELDNAME') throw alterError;
        }
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
