import React from 'react';
import Button from './Button';
import '../styles/WaitingLobby.css';

function WaitingLobby({ gameName, gameCode, players, onStartGame }) {
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
                        <h3>שחקנים מחוברים ({players.length}):</h3>
                        <ul className="lobby-players-list">
                            {players.map((p) => (
                                <li key={p.id}>{p.fullName}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <Button
                text="התחל משחק"
                onClick={onStartGame}
                disabled={players.length < 1}
            />
        </div>
    );
}

export default WaitingLobby;
