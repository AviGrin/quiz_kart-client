import React from 'react';
import '../styles/EventToast.css';

const EVENT_CONFIG = {
    OVERTAKE: { icon: '🏁', colorClass: 'toast-blue' },
    STREAK: { icon: '🔥', colorClass: 'toast-orange' },
    LUCK_EVENT: { icon: '🎲', colorClass: 'toast-purple' },
    JUNCTION_CHOSEN: { icon: '🛤️', colorClass: 'toast-green' }
};

function EventToast({ event }) {
    const config = EVENT_CONFIG[event.type] || { icon: '✨', colorClass: 'toast-pink' };

    return (
        <div className={`event-toast ${config.colorClass}`}>
            <div className="toast-icon-wrapper">{config.icon}</div>
            <div className="toast-content">
                <span className="toast-text">{event.text}</span>
            </div>
        </div>
    );
}

export default EventToast;