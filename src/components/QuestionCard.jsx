import React from 'react';
import '../styles/QuestionCard.css';

function QuestionCard({ question, feedback, loading, onAnswerClick, timeLeft, timeLimit,
                          questionMode, dirtRoadRemaining, canSwap, onSwap }) {
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

    return (
        <div className={`question-card ${getModeClass()}`}>
            {questionMode === 'autostrada' && (
                <div className="mode-badge badge-autostrada">
                    <span>🏎️ אוטוסטרדה — שאלה קשה!</span>
                </div>
            )}

            {questionMode === 'dirtroad' && (
                <div className="mode-badge badge-dirtroad">
                    <span>🚜 דרך עפר — נותרו {dirtRoadRemaining} שאלות</span>
                </div>
            )}

            {timeLeft !== null && timeLeft !== undefined && (
                <div className="question-timer-section">
                    <div className="question-timer-bar-bg">
                        <div
                            className={`question-timer-bar-fill ${getTimerClass()}`}
                            style={{ width: getTimerBarWidth() }}
                        />
                    </div>
                    <span className={`question-timer-text ${getTimerClass()}`}>
                        {timeLeft}
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

            <div className="question-feedback">
                {feedback === 'correct' && <span className="feedback-correct">נכון מאוד!</span>}
                {feedback === 'wrong' && <span className="feedback-wrong">לא נכון, נסה שוב!</span>}
                {feedback === 'timeout' && <span className="feedback-timeout">נגמר הזמן!</span>}
                {feedback === 'autostrada-success' && <span className="feedback-autostrada-success">מדהים! +1000 נקודות! 🏎️</span>}
                {feedback === 'autostrada-fail' && <span className="feedback-autostrada-fail">לא הצלחת... -200 נקודות</span>}
            </div>

            <div className="question-options">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className="option-btn"
                        onClick={() => onAnswerClick(opt)}
                        disabled={isDisabled}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {canSwap && !feedback && (
                <button
                    className="swap-btn"
                    onClick={onSwap}
                    disabled={loading}
                >
                    🔄 החלף שאלה
                </button>
            )}
        </div>
    );
}

export default QuestionCard;