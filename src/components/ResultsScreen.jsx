import React from 'react';
import Button from './Button';
import '../styles/ResultsScreen.css';

const MEDALS = ['🥇', '🥈', '🥉'];

function ResultsScreen({ rankings, winnerName, onBack }) {
    if (!rankings || rankings.length === 0) {
        return (
            <div className="results-screen">
                <h2 className="results-title">המשחק הסתיים!</h2>
                <Button text="חזור לדשבורד" onClick={onBack} className="results-back-btn" />
            </div>
        );
    }

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
                    <li key={player.id} className="results-item">
                        <span className="results-rank">
                            {index < 3 ? MEDALS[index] : (index + 1)}
                        </span>
                        <div className="results-player-info">
                            <div className="results-player-name">{player.fullName}</div>
                            <div className="results-player-details">
                                תשובות נכונות: {player.correctAnswers} | טעויות: {player.wrongAnswers}
                            </div>
                        </div>
                        <span className="results-score">{player.score}</span>
                    </li>
                ))}
            </ul>

            <Button text="חזור לדשבורד" onClick={onBack} className="results-back-btn" />
        </div>
    );
}

export default ResultsScreen;