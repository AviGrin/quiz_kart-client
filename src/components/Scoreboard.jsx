import React from 'react';
import ProgressBar from './ProgressBar';
import '../styles/Scoreboard.css';

function Scoreboard({ players, trackLength }) {
    const sorted = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="scoreboard">
            {sorted.map((p, index) => (
                <div key={p.id} className="scoreboard-row">
                    <div className="scoreboard-row-top">
                        <span className="scoreboard-player-name">
                            {index + 1}. {p.fullName}
                        </span>
                        <div className="scoreboard-player-stats">
                            <span>ניקוד: {p.score}</span>
                            <span>סטרייק: {p.streak}</span>
                            <span>טעויות: {p.wrongAnswers}</span>
                        </div>
                    </div>
                    {trackLength && <ProgressBar score={p.score} trackLength={trackLength} />}
                </div>
            ))}
        </div>
    );
}

export default Scoreboard;
