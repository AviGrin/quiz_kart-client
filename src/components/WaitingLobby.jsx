import React from 'react';
import Button from './Button';
import '../styles/WaitingLobby.css';

function WaitingLobby({ gameName, gameCode, players, onStartGame, maxPlayers, onLeave }) {
    const isFull = maxPlayers && players.length >= maxPlayers;

    return (
        <div className="waiting-lobby card-enter">
            <span className="lobby-icon">🏁</span>
            <h2 className="lobby-title">{gameName}</h2>

            <div className="lobby-code-box lobby-code-pop">
                <p className="lobby-code-label">קוד כניסה למשחק</p>
                <div className="lobby-code-value">{gameCode}</div>
            </div>

            <div className="lobby-players-box">
                <p className="lobby-players-header">
                    שחקנים מחוברים ({players.length}{maxPlayers ? `/${maxPlayers}` : ''})
                </p>

                {players.length === 0 ? (
                    <p className="lobby-waiting-text">
                        ממתין לשחקנים<span className="lobby-waiting-dots"></span>
                    </p>
                ) : (
                    <div className="lobby-players-grid">
                        {players.map((p, i) => (
                            <div
                                key={p.id}
                                className="lobby-player-chip lobby-chip-enter"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="lobby-player-avatar">
                                    {p.fullName?.charAt(0) || '?'}
                                </div>
                                <span className="lobby-player-name">{p.fullName}</span>
                            </div>
                        ))}
                    </div>
                )}

                {isFull && (
                    <div className="lobby-full-badge">
                        המשחק מלא — אפשר להתחיל!
                    </div>
                )}
            </div>

            <div className="lobby-start-area">
                <Button
                    text={isFull ? "כולם כאן — התחל!" : "התחל משחק"}
                    onClick={onStartGame}
                    disabled={players.length < 1}
                    className={isFull ? "btn-start-pulse" : ""}
                />
                <Button
                    text="עזוב חדר"
                    onClick={onLeave}
                    className="btn-logout"
                />
            </div>
        </div>
    );
}

export default WaitingLobby;