import React from 'react';
import '../styles/JunctionChoice.css';

function JunctionChoice({ onChoose, loading }) {
    return (
        <div className="junction-choice">
            <h2 className="junction-title">צומת במסלול!</h2>
            <p className="junction-subtitle">בחר את הדרך שלך:</p>

            <div className="junction-options">
                <button
                    className="junction-option autostrada"
                    onClick={() => onChoose(1)}
                    disabled={loading}
                >
                    <span className="junction-icon">🏎️</span>
                    <span className="junction-option-title">אוטוסטרדה</span>
                    <span className="junction-option-desc">שאלה אחת קשה</span>
                    <div className="junction-details">
                        <span className="junction-reward">הצלחה: +1000 נק׳</span>
                        <span className="junction-risk">כישלון: -200 נק׳</span>
                    </div>
                    <span className="junction-tag tag-risk">סיכון גבוה</span>
                </button>

                <button
                    className="junction-option dirtroad"
                    onClick={() => onChoose(2)}
                    disabled={loading}
                >
                    <span className="junction-icon">🚜</span>
                    <span className="junction-option-title">דרך עפר</span>
                    <span className="junction-option-desc">5 שאלות קלות</span>
                    <div className="junction-details">
                        <span className="junction-reward">כל תשובה: +50 נק׳</span>
                        <span className="junction-safe">סה״כ עד 250 נק׳</span>
                    </div>
                    <span className="junction-tag tag-safe">מסלול בטוח</span>
                </button>
            </div>
        </div>
    );
}

export default JunctionChoice;