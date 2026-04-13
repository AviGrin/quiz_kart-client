import React from 'react';
import '../styles/ProgressBar.css';

function ProgressBar({ score, trackLength }) {
    const percent = Math.min(100, Math.round((score / trackLength) * 100));

    return (
        <div>
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: percent + '%' }} />
            </div>
            <span className="progress-label">{percent}%</span>
        </div>
    );
}

export default ProgressBar;
