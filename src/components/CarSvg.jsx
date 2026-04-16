import React from 'react';

function CarSvg({ color = '#e53e3e', width = 60 }) {
    const height = width * 0.45;

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 120 54"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10,38 L10,30 Q10,26 14,24 L30,18 L42,8 Q46,4 52,4 L78,4 Q84,4 88,8 L96,18 L110,22 Q116,24 116,30 L116,38"
                fill={color}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="1"
            />

            <path
                d="M42,8 Q46,4 52,4 L78,4 Q84,4 88,8 L96,18 L30,18 Z"
                fill={color}
                opacity="0.85"
            />

            <rect x="36" y="8" width="22" height="12" rx="2" fill="rgba(180,220,255,0.85)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <rect x="62" y="8" width="26" height="12" rx="2" fill="rgba(180,220,255,0.85)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <line x1="60" y1="8" x2="60" y2="20" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

            <rect x="4" y="28" width="8" height="6" rx="2" fill="#ffcc00" opacity="0.9" />
            <rect x="112" y="26" width="6" height="6" rx="1" fill="#ff4444" opacity="0.9" />

            <line x1="14" y1="24" x2="110" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

            <circle cx="30" cy="42" r="10" fill="#1a1a2e" />
            <circle cx="30" cy="42" r="7" fill="#2d2d44" />
            <circle cx="30" cy="42" r="3" fill="#555" />
            <circle cx="30" cy="42" r="1.5" fill="#888" />

            <circle cx="92" cy="42" r="10" fill="#1a1a2e" />
            <circle cx="92" cy="42" r="7" fill="#2d2d44" />
            <circle cx="92" cy="42" r="3" fill="#555" />
            <circle cx="92" cy="42" r="1.5" fill="#888" />
        </svg>
    );
}

export default CarSvg;
