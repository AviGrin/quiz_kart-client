import React from 'react';
import '../styles/Input.css';

function Input({ label, placeholder, value, onChange, type }) {
    return (
        <div className="game-input-group">
            {label && <label className="game-input-label">{label}</label>}
            <input
                className="game-input"
                type={type || 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Input;