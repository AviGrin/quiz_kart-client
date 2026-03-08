import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, style = {} }) => {
    return (
        <div style={{ marginBottom: '1rem', ...style }}>
            {label && (
                <label >
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default Input;
