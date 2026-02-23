import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import api from '../../tasks/services/api';

const GithubCallback = () => {
    const [status, setStatus] = useState('Autenticando con GitHub...');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (code) {
            exchangeCodeForToken(code);
        } else {
            setStatus('Error: No se recibió ningún código de autorización de GitHub.');
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [location]);

    const exchangeCodeForToken = async (code) => {
        try {
            const response = await api.post('/auth/github', { code });

            // Iniciar sesión en el contexto global
            login(response.data.token, response.data.user);

            setStatus('¡Autenticación exitosa! Redirigiendo...');

            // Pequeña pausa para mejorar la UX y redirigir al listado de tareas
            setTimeout(() => navigate('/tasks'), 1000);
        } catch (error) {
            console.error('Error durante el callback de GitHub:', error);
            const errorMsg = error.response?.data?.message || 'Error al autenticar con el servidor usando GitHub.';
            setStatus(`Error: ${errorMsg}`);

            // Volver al login en caso de error
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h2>Procesando GitHub...</h2>
                <p>{status}</p>
                {status.includes('Error') ? null : <div className="loading-spinner"></div>}
            </div>
        </div>
    );
};

export default GithubCallback;
