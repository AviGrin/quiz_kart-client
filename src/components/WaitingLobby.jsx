import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import '../styles/WaitingLobby.css';

function WaitingLobby({ gameName, gameCode, players, onStartGame, maxPlayers }) {
    const isFull = maxPlayers && players.length >= maxPlayers;

    return (
        <motion.div
            className="waiting-lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <span className="lobby-icon">🏁</span>
            <h2 className="lobby-title">{gameName}</h2>

            <motion.div
                className="lobby-code-box"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
                <p className="lobby-code-label">קוד כניסה למשחק</p>
                <div className="lobby-code-value">{gameCode}</div>
            </motion.div>

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
                        <AnimatePresence>
                            {players.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    className="lobby-player-chip"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="lobby-player-avatar">
                                        {p.fullName?.charAt(0) || '?'}
                                    </div>
                                    <span className="lobby-player-name">{p.fullName}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {isFull && (
                    <motion.div
                        className="lobby-full-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        המשחק מלא — אפשר להתחיל!
                    </motion.div>
                )}
            </div>

            <div className="lobby-start-area">
                <Button
                    text={isFull ? "כולם כאן — התחל!" : "התחל משחק"}
                    onClick={onStartGame}
                    disabled={players.length < 1}
                    className={isFull ? "btn-start-pulse" : ""}
                />
            </div>
        </motion.div>
    );
}

export default WaitingLobby;