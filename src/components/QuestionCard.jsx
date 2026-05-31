import React from 'react';
import '../styles/QuestionCard.css';

function QuestionCard({ question, feedback, loading, onAnswerClick, timeLeft, timeLimit,
                          questionMode, dirtRoadRemaining }) {
    if (!question) {
        return <p className="question-loading">טוען שאלה...</p>;
    }


    const containsHebrew = (text) => /[\u0590-\u05FF]/.test(text);
    const isMathOnly = !containsHebrew(question.text);

    const isDisabled = loading
        || feedback === 'correct'
        || feedback === 'wrong'
        || feedback === 'timeout'
        || feedback === 'autostrada-success'
        || feedback === 'autostrada-fail';

    const getTimerClass = () => {
        if (timeLeft === null || timeLeft === undefined) return '';
        if (timeLeft <= 3) return 'timer-critical';
        if (timeLeft <= 5) return 'timer-warning';
        return '';
    };

    const getTimerBarWidth = () => {
        if (!timeLimit || timeLimit === 0 || timeLeft === null) return '100%';
        return `${(timeLeft / timeLimit) * 100}%`;
    };

    const getModeClass = () => {
        if (questionMode === 'autostrada') return 'mode-autostrada';
        if (questionMode === 'dirtroad') return 'mode-dirtroad';
        return '';
    };

    const getFeedbackOverlayContent = () => {
        if (!feedback) return null;
        if (feedback === 'correct') return { text: '✅ נכון מאוד!', class: 'feedback-correct' };
        if (feedback === 'wrong') return { text: '❌ לא נכון!', class: 'feedback-wrong' };
        if (feedback === 'timeout') return { text: '⏱️ נגמר הזמן!', class: 'feedback-wrong' };
        if (feedback === 'autostrada-success') return { text: '🏎️ מדהים! +200 נקודות!', class: 'feedback-correct' };
        if (feedback === 'autostrada-fail') return { text: '💥 לא הצלחת... -50 נקודות', class: 'feedback-wrong' };
        return null;
    };

    const overlayInfo = getFeedbackOverlayContent();

    return (
        <div className={`question-card-container card-enter ${getModeClass()}`}>

            {questionMode === 'autostrada' && (
                <div className="mode-badge badge-autostrada" style={{ marginBottom: '15px', color: '#ef4444', fontWeight: 'bold' }}>
                    <span>🏎️ אוטוסטרדה — שאלה קשה!</span>
                </div>
            )}

            {questionMode === 'dirtroad' && (
                <div className="mode-badge badge-dirtroad" style={{ marginBottom: '15px', color: '#a855f7', fontWeight: 'bold' }}>
                    <span>🚜 דרך עפר — נותרו {dirtRoadRemaining} שאלות</span>
                </div>
            )}

            {timeLeft !== null && timeLeft !== undefined && (
                <div className="question-timer-section" style={{ marginBottom: '20px' }}>
                    <div className="question-timer-bar-bg" style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px' }}>
                        <div
                            className={`question-timer-bar-fill ${getTimerClass()}`}
                            style={{
                                width: getTimerBarWidth(),
                                height: '100%',
                                background: timeLeft <= 5 ? '#ef4444' : '#3b82f6',
                                borderRadius: '10px',
                                transition: 'width 0.5s linear'
                            }}
                        />
                    </div>
                    <span style={{ fontWeight: 'bold', color: timeLeft <= 5 ? '#ef4444' : '#64748b' }}>
                        זמן נותר: {timeLeft}
                    </span>
                </div>
            )}

            <h2 className="question-text">
                {isMathOnly ? (
                    <bdi dir="ltr" className="math-only-text">
                        {question.text}
                    </bdi>
                ) : (
                    <span>{question.text}</span>
                )}
            </h2>

            <div className="options-grid">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className="option-btn"
                        onClick={() => onAnswerClick(opt)}
                        disabled={isDisabled}
                    >
                        {!containsHebrew(opt) ? <bdi dir="ltr">{opt}</bdi> : opt}
                    </button>
                ))}
            </div>

            {overlayInfo && (
                <div className={`feedback-overlay ${overlayInfo.class}`}>
                    {overlayInfo.text}
                </div>
            )}
        </div>
    );
}

export default QuestionCard;