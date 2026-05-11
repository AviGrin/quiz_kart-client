import React from 'react';
import carImage from '../assets/images/img.png';
import '../styles/RacingTrack.css';

const PLAYER_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

function RacingTrack({ players, trackLength }) {
    if (!trackLength || !players || players.length === 0) return null;

    const sortedPlayers = [...players].sort((a, b) => a.id - b.id);

    const LANE_HEIGHT = 120;
    const CURB_HEIGHT = 8;
    const numPlayers = sortedPlayers.length;

    const roadHeight = numPlayers * LANE_HEIGHT;
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
                            style={{ top: `${CURB_HEIGHT + (i + 1) * LANE_HEIGHT}px` }}
                        />
                    ))}

                    {sortedPlayers.map((player, index) => {
                        const percent = Math.min(100, Math.max(0, (player.score / trackLength) * 100));
                        const startOffset = 60;
                        const finishLineBuffer = 110;
                        const color = PLAYER_COLORS[index % PLAYER_COLORS.length];

                        const rightPosition = `calc(${percent}% - (${percent}% * ${finishLineBuffer / 1000}) + ${startOffset}px)`;
                        const topPosition = CURB_HEIGHT + (index + 0.5) * LANE_HEIGHT;

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
                                    className="car-info-bubble"
                                    style={{ borderColor: color, boxShadow: `0 0 12px ${color}40` }}
                                >
                                    <div className="car-bubble-rank" style={{ backgroundColor: color }}>
                                        {index + 1}
                                    </div>
                                    <div className="car-bubble-details">
                                        <span className="car-player-name">{player.fullName}</span>
                                        <span className="car-player-score" style={{ color }}>{player.score} נק׳</span>
                                    </div>
                                </div>
                                <img src={carImage} alt={player.fullName} className="race-car-image" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RacingTrack;