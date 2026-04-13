import React, { useEffect, useState } from 'react';
import '../styles/GameTimer.css';

function GameTimer({ startedAt }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startedAt) return;

        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startedAt) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const display = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    return (
        <div className="game-timer">
            <span className="timer-icon">⏱</span>
            <span>{display}</span>
        </div>
    );
}

export default GameTimer;
