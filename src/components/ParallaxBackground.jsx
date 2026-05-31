import React from 'react';
import '../styles/ParallaxBackground.css';

function ParallaxBackground() {
    return (
        <div className="parallax-bg-container">
            <div className="parallax-layer layer-sky">
                <div className="sun"></div>
            </div>

            <div className="parallax-layer layer-mountains"></div>

            <div className="parallax-layer layer-hills"></div>

            <div className="parallax-layer layer-foreground"></div>
        </div>
    );
}

export default ParallaxBackground;