import React from 'react';
import '../styles/StreakEffect.css';

function StreakEffect({ streak }) {
    if (streak < 3) return null;
    return (
        <div className="streak-fire-container">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="fire-flame">🔥</div>
            ))}
        </div>
    );
}
export default StreakEffect;