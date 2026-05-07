import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Button.css';

function Button({ text, onClick, disabled, className }) {
    return (
        <motion.button
            className={`game-btn ${className || ''}`}
            onClick={onClick}
            disabled={disabled}
            whileTap={!disabled ? { scale: 0.95 } : {}}
        >
            {text}
        </motion.button>
    );
}

export default Button;