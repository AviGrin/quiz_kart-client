import React, { useEffect, useState, useRef } from 'react';
import '../styles/LuckPopup.css';

const LUCK_CONFIG = {
    TURBO: {
        icon: '🚀',
        title: 'טורבו!',
        description: '+150 נקודות בונוס!',
        className: 'luck-good'
    },
    DOUBLE_POINTS: {
        icon: '⚡',
        title: 'נקודות כפולות!',
        description: 'התשובה הנכונה הבאה שווה כפול!',
        className: 'luck-good'
    },
    FLAT_TIRE: {
        icon: '💨',
        title: 'תקר בגלגל!',
        description: 'התשובה הנכונה הבאה לא תזכה בנקודות',
        className: 'luck-bad'
    },
    OIL_SLICK: {
        icon: '🛢️',
        title: 'כתם שמן!',
        description: '-80 נקודות...',
        className: 'luck-bad'
    }
};

function LuckPopup({ event, onClose }) {
    const [visible, setVisible] = useState(false);
    const onCloseRef = useRef(onClose);
    const timerRef = useRef(null);
    const fadeTimerRef = useRef(null);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (event) {
            setVisible(true);

            if (timerRef.current) clearTimeout(timerRef.current);
            if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

            timerRef.current = setTimeout(() => {
                setVisible(false);
                fadeTimerRef.current = setTimeout(() => {
                    if (onCloseRef.current) onCloseRef.current();
                }, 300);
            }, 2500);

            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
                if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
            };
        }
    }, [event]);

    if (!event) return null;

    const config = LUCK_CONFIG[event] || {
        icon: '❓',
        title: 'אירוע מפתיע!',
        description: '',
        className: 'luck-good'
    };

    return (
        <div className={`luck-popup-overlay ${visible ? 'luck-visible' : 'luck-hidden'}`}>
            <div className={`luck-popup ${config.className}`}>
                <span className="luck-popup-icon">{config.icon}</span>
                <h3 className="luck-popup-title">{config.title}</h3>
                <p className="luck-popup-desc">{config.description}</p>
            </div>
        </div>
    );
}

export default LuckPopup;