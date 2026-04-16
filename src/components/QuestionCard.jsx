import React from 'react';
import '../styles/QuestionCard.css';

function QuestionCard({ question, feedback, loading, onAnswerClick }) {
    if (!question) {
        return <p className="question-loading">טוען שאלה...</p>;
    }

    // פונקציה חכמה שבודקת אם הטקסט מכיל אותיות בעברית
    const containsHebrew = (text) => /[\u0590-\u05FF]/.test(text);

    // אם אין עברית, זה תרגיל מתמטי טהור שחייב להיות משמאל לימין
    const isMathOnly = !containsHebrew(question.text);

    return (
        <div className="question-card">

            {/* כאן עשינו את הבידוד המוחלט */}
            <h2 className="question-text">
                {isMathOnly ? (
                    <bdi
                        dir="ltr"
                        style={{ display: 'inline-block', unicodeBidi: 'isolate' }}
                    >
                        {question.text}
                    </bdi>
                ) : (
                    <span>{question.text}</span>
                )}
            </h2>

            <div className="question-feedback">
                {feedback === 'correct' && <span className="feedback-correct">נכון מאוד!</span>}
                {feedback === 'wrong' && <span className="feedback-wrong">לא נכון, נסה שוב!</span>}
            </div>

            <div className="question-options">
                {question.options.map((opt, idx) => (
                    <button
                        key={idx}
                        className="option-btn"
                        onClick={() => onAnswerClick(opt)}
                        disabled={loading || feedback === 'correct'}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuestionCard;