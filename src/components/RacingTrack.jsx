import React from 'react';
import carImage from '../assets/images/img.png';
import '../styles/RacingTrack.css';

function RacingTrack({ players, trackLength }) {
    if (!trackLength || !players || players.length === 0) return null;

    const sortedPlayers = [...players].sort((a, b) => a.id - b.id);

    const LANE_HEIGHT = 110;
    const CURB_HEIGHT = 15;
    const numPlayers = sortedPlayers.length;

    const roadHeight = numPlayers * LANE_HEIGHT;
    const totalHeight = roadHeight + (CURB_HEIGHT * 2);

    return (
        <div className="racing-track-container" style={{ height: `${totalHeight}px` }}>
            <div className="curb top" />
            <div className="curb bottom" />

            <div className="finish-line-global"></div>

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
                            <div className="car-info-bubble">
                                <span className="car-player-name">{player.fullName}</span>
                                <span className="car-player-score">{player.score.toLocaleString()} pts</span>
                            </div>
                            <img src={carImage} alt={player.fullName} className="race-car-image" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RacingTrack;