const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const initializeDatabase = async () => {
    try {
        await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        await pool.query(`USE \`${process.env.DB_NAME}\``);
        return pool;
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        throw error;
    }
};

module.exports = { pool, initializeDatabase };
