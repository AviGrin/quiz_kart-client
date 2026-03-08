import React from 'react';


const Button = ({ text, onClick, disabled, type = 'button', className }) => {






    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}

        >
            {text}
        </button>
    );
};

export default Button;
