import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Button from './Button';
import '../styles/ResultsScreen.css';

const MEDALS = ['🥇', '🥈', '🥉'];

function ResultsScreen({ rankings, winnerName, onBack }) {
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (winnerName) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.7 }
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.7 }
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, [winnerName]);

    if (!rankings || rankings.length === 0) {
        return (
            <div className="results-screen">
                <h2 className="results-title">המשחק הסתיים!</h2>
                <Button text="חזור לדשבורד" onClick={onBack} className="results-back-btn" />
            </div>
        );
    }

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <div className="results-screen">
            {winnerName ? (
                <div className="winner-banner">
                    <span className="winner-trophy">🏆</span>
                    <h2 className="winner-text">{winnerName} ניצח במרוץ!</h2>
                </div>
            ) : (
                <h2 className="results-title">תוצאות המשחק</h2>
            )}

            <ul className="results-list">
                {rankings.map((player, index) => (
                    <li
                        key={player.id}
                        className={`results-item ${expandedId === player.id ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(player.id)}
                    >
                        <div className="results-item-main">
                            <span className="results-rank">
                                {index < 3 ? MEDALS[index] : (index + 1)}
                            </span>
                            <div className="results-player-info">
                                <div className="results-player-name">{player.fullName}</div>
                                <div className="results-player-summary">
                                    {player.correctAnswers} נכונות · {player.wrongAnswers} טעויות · {player.successRate != null ? player.successRate + '%' : ''} הצלחה
                                </div>
                            </div>
                            <span className="results-score">{player.score}</span>
                        </div>

                        {expandedId === player.id && (
                            <div className="results-expanded">
                                <div className="results-stats-grid">
                                    <div className="stat-box">
                                        <span className="stat-value">{player.bestStreak || 0}</span>
                                        <span className="stat-label">רצף שיא 🔥</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{player.avgTimeSec || 0} שנ׳</span>
                                        <span className="stat-label">זמן ממוצע ⏱️</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{player.totalAnswers || 0}</span>
                                        <span className="stat-label">סה״כ תשובות 📝</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{player.luckEvents || 0}</span>
                                        <span className="stat-label">אירועי מזל 🎲</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <p className="results-tap-hint">לחץ על שחקן לפרטים נוספים</p>

            <Button text="חזור לדשבורד" onClick={onBack} className="results-back-btn" />
        </div>
    );
}

export default ResultsScreen;