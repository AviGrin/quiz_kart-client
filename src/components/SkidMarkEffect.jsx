import React, { useState } from 'react';
import '../styles/SkidMarks.css';

function SkidMarkEffect() {
    const [angle] = useState(() => Math.floor(Math.random() * 80) - 40);
    const [direction] = useState(() => Math.random() > 0.5 ? 1 : -1);
    const [topOffset] = useState(() => Math.floor(Math.random() * 30) - 15);

    const [smokes] = useState(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            id: `smoke-${i}`,
            left: `${10 + Math.random() * 80}%`,
            delay: `${0.1 + Math.random() * 0.3}s`,
            size: `${50 + Math.random() * 70}px`
        }));
    });

    const [fires] = useState(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            id: `fire-${i}`,
            left: `${15 + Math.random() * 70}%`,
            delay: `${0.05 + Math.random() * 0.15}s`,
            size: `${20 + Math.random() * 40}px`
        }));
    });

    return (
        <div className="skid-marks-container">
            <div
                className="tire-track-wrapper"
                style={{ transform: `rotate(${angle}deg) scaleX(${direction}) translateY(${topOffset}vh)` }}
            >
                <div className="fast-blur-object"></div>

                <div className="tire-track">
                    <div className="tire-track-line"></div>
                    <div className="tire-track-line"></div>
                </div>

                <div className="fire-layer">
                    {fires.map(fire => (
                        <div
                            key={fire.id}
                            className="fire-particle"
                            style={{
                                left: fire.left,
                                width: fire.size,
                                height: fire.size,
                                animationDelay: fire.delay
                            }}
                        ></div>
                    ))}
                </div>

                <div className="smoke-layer">
                    {smokes.map(smoke => (
                        <div
                            key={smoke.id}
                            className="smoke-particle"
                            style={{
                                left: smoke.left,
                                width: smoke.size,
                                height: smoke.size,
                                animationDelay: smoke.delay
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SkidMarkEffect;