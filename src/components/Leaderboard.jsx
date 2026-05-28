import React from 'react';
import '../styles/Leaderboard.css';

const PLAYER_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];
const MEDALS = ['🥇', '🥈', '🥉'];

function Leaderboard({ players, trackLength }) {
    const sorted = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="leaderboard">
            <h3 className="leaderboard-title">דירוג חי</h3>
            <div className="leaderboard-list">
                {sorted.map((player, index) => {
                    const percent = trackLength > 0 ? Math.min(100, (player.score / trackLength) * 100) : 0;
                    const color = PLAYER_COLORS[index % PLAYER_COLORS.length];

                    return (
                        <div key={player.id} className="leaderboard-row">
                            <span className="leaderboard-rank">
                                {index < 3 ? MEDALS[index] : (index + 1)}
                            </span>

                            <div
                                className="leaderboard-avatar"
                                style={{ backgroundColor: color }}
                            >
                                {player.fullName?.charAt(0) || '?'}
                            </div>

                            <div className="leaderboard-info">
                                <span className="leaderboard-name">{player.fullName}</span>
                                <div className="leaderboard-bar-bg">
                                    <div
                                        className="leaderboard-bar-fill"
                                        style={{ backgroundColor: color, width: `${percent}%` }}
                                    />
                                </div>
                            </div>

                            <span className="leaderboard-score" style={{ color }}>
                                {player.score}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Leaderboard;