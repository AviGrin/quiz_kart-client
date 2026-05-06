import React, { useEffect, useRef } from 'react';
import '../styles/EventFeed.css';

const EVENT_CONFIG = {
    OVERTAKE: (data) => ({
        icon: '🏁',
        text: `${data.overtakerName} עקף את ${data.overtakenName}!`,
        className: 'event-overtake'
    }),
    STREAK: (data) => ({
        icon: '🔥',
        text: `${data.playerName} ברצף של ${data.streak} תשובות נכונות!`,
        className: 'event-streak'
    }),
    LUCK_EVENT: (data) => {
        const luckMap = {
            TURBO: { icon: '🚀', text: `${data.playerName} קיבל טורבו!` },
            DOUBLE_POINTS: { icon: '⚡', text: `${data.playerName} קיבל נקודות כפולות!` },
            FLAT_TIRE: { icon: '💨', text: `ל${data.playerName} יש תקר!` },
            OIL_SLICK: { icon: '🛢️', text: `${data.playerName} החליק על שמן!` }
        };
        const info = luckMap[data.event] || { icon: '❓', text: `אירוע מזל ל${data.playerName}` };
        return { icon: info.icon, text: info.text, className: 'event-luck' };
    },
    JUNCTION_CHOSEN: (data) => {
        const isAuto = data.junctionChoice === 'autostrada';
        return {
            icon: isAuto ? '🏎️' : '🚜',
            text: `${data.playerName} בחר ${isAuto ? 'אוטוסטרדה' : 'דרך עפר'}`,
            className: isAuto ? 'event-autostrada' : 'event-dirtroad'
        };
    }
};

function EventFeed({ events }) {
    const feedRef = useRef(null);

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = 0;
        }
    }, [events.length]);

    if (!events || events.length === 0) {
        return (
            <div className="event-feed">
                <h3 className="event-feed-title">אירועים חיים</h3>
                <p className="event-feed-empty">ממתין לאירועים...</p>
            </div>
        );
    }

    return (
        <div className="event-feed">
            <h3 className="event-feed-title">אירועים חיים</h3>
            <div className="event-feed-list" ref={feedRef}>
                {events.map((event, index) => {
                    const configFn = EVENT_CONFIG[event.type];
                    if (!configFn) return null;

                    const config = configFn(event);
                    const isNew = index === 0;

                    return (
                        <div
                            key={event.id}
                            className={`event-item ${config.className} ${isNew ? 'event-new' : ''}`}
                        >
                            <span className="event-icon">{config.icon}</span>
                            <span className="event-text">{config.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EventFeed;