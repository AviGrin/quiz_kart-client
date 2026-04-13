import React from 'react';
import '../styles/Card.css';

const Card = ({ children, title, className = '' }) => {
    return (
        <div className={`card-component ${className}`}>
            {title && <h3>{title}</h3>}
            {children}
        </div>
    );
};

export default Card;