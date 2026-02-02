import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '', style = {} }) => {
    return (
        <div
            className={`card-component ${className}`}
            style={style}
        >
            {title && (
                <h3 style={{
                    marginBottom: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-main)'
                }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
