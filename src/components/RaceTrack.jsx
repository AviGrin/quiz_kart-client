import React from 'react';
import CarSvg from './CarSvg';
import '../styles/RaceTrack.css';

const CAR_COLORS = [
    '#e53e3e',
    '#3182ce',
    '#38a169',
    '#d69e2e',
    '#805ad5',
    '#d53f8c',
    '#dd6b20',
    '#319795',
];

function RaceTrack({ players, trackLength }) {
    return (
        <div className="race-track-wrapper">
            <div className="track-labels">
                <span>סיום</span>
                <span>התחלה</span>
            </div>
            <div className="race-track">
                <div className="finish-line" />
                <div className="start-line" />
                <div className="race-lanes">
                    {players.map((player, index) => {
                        const percent = Math.min(100, Math.round((player.score / trackLength) * 100));
                        const position = 88 - (percent * 0.86);
                        const color = CAR_COLORS[index % CAR_COLORS.length];

                        return (
                            <div key={player.id} className="race-lane">
                                <div className="lane-road" />
                                <div className="race-car" style={{ left: position + '%' }}>
                                    <CarSvg color={color} width={56} />
                                </div>
                                <div className="lane-info">
                                    <span className="lane-player-name">{player.fullName}</span>
                                    <span className="lane-score">{player.score} נק׳</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RaceTrack;