import React from 'react';
import './Card.css';

const Card = ({ children, title, className = '', style = {} }) => {
    return (
        <div
            className={`card-component ${className}`}
            style={style}
        >
            {title && (
                <h3 >
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
