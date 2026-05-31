import React from 'react';
import '../styles/Button.css';

function Button({ text, onClick, disabled, className }) {
    return (
        <button
            className={`game-btn ${className || ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;