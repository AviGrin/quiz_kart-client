import React from 'react';
import Button from './Button';
import '../styles/WaitingLobby.css';

function WaitingLobby({ gameName, gameCode, players, onStartGame, maxPlayers }) {
    const isFull = maxPlayers && players.length >= maxPlayers;

    return (
        <div className="waiting-lobby">
            <h2>לובי המתנה: {gameName}</h2>
            <div className="lobby-game-code">
                קוד כניסה: <span>{gameCode}</span>
            </div>

            <div className="lobby-players-box">
                {players.length === 0 ? (
                    <p className="lobby-waiting-text">ממתין לשחקנים...</p>
                ) : (
                    <>
                        <h3>
                            שחקנים מחוברים ({players.length}{maxPlayers ? `/${maxPlayers}` : ''}):
                        </h3>
                        <ul className="lobby-players-list">
                            {players.map((p) => (
                                <li key={p.id}>{p.fullName}</li>
                            ))}
                        </ul>
                    </>
                )}

                {isFull && (
                    <div className="lobby-full-badge">
                        המשחק מלא — אפשר להתחיל!
                    </div>
                )}
            </div>

            <Button
                text={isFull ? "כולם כאן — התחל משחק!" : "התחל משחק"}
                onClick={onStartGame}
                disabled={players.length < 1}
                className={isFull ? "btn-start-pulse" : ""}
            />
        </div>
    );
}

export default WaitingLobby;