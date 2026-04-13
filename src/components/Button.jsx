import React from 'react';
import '../styles/Button.css';

const Button = ({ text, onClick, disabled, type = 'button', className = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;