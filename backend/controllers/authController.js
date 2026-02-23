const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, proporciona email y contraseña.' });
    }

    try {
        const [existingUsers] = await pool.query('SELECT id FROM Users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO Users (email, password_hash) VALUES (?, ?)',
            [email, password_hash]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, proporciona email y contraseña.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const payload = {
            id: user.id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: payload });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión.' });
    }
};

const axios = require('axios');

// Implementación de GitHub OAuth
const githubLogin = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'No se proporcionó un código de autorización.' });
    }

    try {
        // 1. Intercambiar el authorization code por un access_token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            return res.status(400).json({ message: 'No se pudo obtener el token de acceso de GitHub.' });
        }

        // 2. Obtener la información del usuario en GitHub
        const githubUserResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // 3. Obtener el email del usuario de GitHub (a veces viene como null en el perfil base)
        let email = githubUserResponse.data.email;
        if (!email) {
            const emailsResponse = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const primaryEmailObj = emailsResponse.data.find(e => e.primary === true && e.verified === true);
            if (primaryEmailObj) {
                email = primaryEmailObj.email;
            } else {
                return res.status(400).json({ message: 'Tu cuenta de GitHub no tiene un email primario verificado.' });
            }
        }

        const githubId = githubUserResponse.data.id.toString();

        // 4. Buscar usuario en la BD por github_id
        let [users] = await pool.query('SELECT * FROM Users WHERE github_id = ?', [githubId]);
        let user;

        if (users.length > 0) {
            user = users[0];
        } else {
            // Si no existe por github_id, buscar si ya hay un correo igual
            [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

            if (users.length > 0) {
                user = users[0];
                // Ligar esta cuenta existente con el github_id
                await pool.query('UPDATE Users SET github_id = ? WHERE id = ?', [githubId, user.id]);
            } else {
                // Si no existe, crear un nuevo usuario
                const [result] = await pool.query(
                    'INSERT INTO Users (email, github_id) VALUES (?, ?)',
                    [email, githubId]
                );

                // Obtener el usuario recién creado
                const [newUsers] = await pool.query('SELECT * FROM Users WHERE id = ?', [result.insertId]);
                user = newUsers[0];
            }
        }

        // 5. Generar JWT y deolver al cliente
        const payload = {
            id: user.id,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: payload });

    } catch (error) {
        console.error('Error in githubLogin:', Object.keys(error).includes('response') ? error.response?.data : error.message);
        res.status(500).json({ message: 'Error interno conectando con GitHub.' });
    }
};

module.exports = { register, login, githubLogin };
