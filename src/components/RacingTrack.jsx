import React, { useEffect, useState, useRef } from 'react';
import carImage from '../assets/images/img.png';
import '../styles/RacingTrack.css';

const PLAYER_COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

function RacingTrack({ players, trackLength }) {
    const [turboCars, setTurboCars] = useState({});
    const prevScores = useRef({});

    useEffect(() => {
        if (!players) return;

        let newTurbos = { ...turboCars };
        let changed = false;

        players.forEach(p => {
            const oldScore = prevScores.current[p.id] || 0;
            if (p.score - oldScore >= 40) {
                newTurbos[p.id] = true;
                changed = true;

                setTimeout(() => {
                    setTurboCars(current => ({ ...current, [p.id]: false }));
                }, 2000);
            }
            prevScores.current[p.id] = p.score;
        });

        if (changed) {
            setTimeout(() => {
                setTurboCars(newTurbos);
            }, 0);
        }
    }, [players]);

    if (!trackLength || !players || players.length === 0) return null;

    const sortedPlayers = [...players].sort((a, b) => a.id - b.id);
    const numPlayers = sortedPlayers.length;

    let laneHeight, carSize, bubbleClass;
    if (numPlayers <= 3) {
        laneHeight = 120;
        carSize = 90;
        bubbleClass = '';
    } else if (numPlayers <= 5) {
        laneHeight = 90;
        carSize = 75;
        bubbleClass = 'bubble-medium';
    } else {
        laneHeight = 70;
        carSize = 60;
        bubbleClass = 'bubble-small';
    }

    const CURB_HEIGHT = 8;
    const roadHeight = numPlayers * laneHeight;
    const totalHeight = roadHeight + (CURB_HEIGHT * 2);

    return (
        <div className="racing-track-wrapper">
            <div className="racing-track-container" style={{ height: `${totalHeight}px` }}>

                <div className="curb top" />
                <div className="curb bottom" />

                <div className="finish-line-global" />

                <div className="asphalt-road">
                    {Array.from({ length: numPlayers - 1 }).map((_, i) => (
                        <div
                            key={`line-${i}`}
                            className="road-dashed-line"
                            style={{ top: `${CURB_HEIGHT + (i + 1) * laneHeight}px` }}
                        />
                    ))}

                    {sortedPlayers.map((player, index) => {
                        const percent = Math.min(100, Math.max(0, (player.score / trackLength) * 100));
                        const startOffset = 60;
                        const finishLineBuffer = 110;
                        const color = PLAYER_COLORS[index % PLAYER_COLORS.length];

                        const rightPosition = `calc(${percent}% - (${percent}% * ${finishLineBuffer / 1000}) + ${startOffset}px)`;
                        const topPosition = CURB_HEIGHT + (index + 0.5) * laneHeight;
                        const isTurbo = turboCars[player.id];

                        return (
                            <div
                                key={player.id}
                                className="dynamic-car-container"
                                style={{
                                    right: rightPosition,
                                    top: `${topPosition}px`,
                                    transform: 'translate(0, -50%)'
                                }}
                            >
                                <div
                                    className={`car-info-bubble ${bubbleClass}`}
                                    style={{
                                        backgroundColor: '#fff',
                                        borderBottom: `4px solid ${color}`,
                                        borderTop: `2px solid ${color}`,
                                        borderLeft: `2px solid ${color}`,
                                        borderRight: `2px solid ${color}`
                                    }}
                                >
                                    <div className="car-bubble-rank" style={{ backgroundColor: color }}>
                                        {index + 1}
                                    </div>
                                    <div className="car-bubble-details">
                                        <span className="car-player-name" style={{ color: '#1e293b' }}>{player.fullName}</span>
                                        <span className="car-player-score" style={{ color }}>{player.score}</span>
                                    </div>
                                </div>

                                <div className="car-body-wrapper">
                                    {isTurbo && <div className="jet-flame"></div>}
                                    <img
                                        src={carImage}
                                        alt={player.fullName}
                                        className={`race-car-image ${isTurbo ? 'car-turbo-shake' : ''}`}
                                        style={{ width: `${carSize}px` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RacingTrack;