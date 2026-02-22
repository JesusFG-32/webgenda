import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    const isLight = theme === 'light';

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`}
            title={`Cambiar a modo ${isLight ? 'oscuro' : 'claro'}`}
        >
            {isLight ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
