import React from 'react';
import '../styles/QuestionCard.css';

function QuestionCard({ question, feedback, loading, onAnswerClick }) {
    if (!question) {
        return <p className="question-loading">טוען שאלה...</p>;
    }

    return (
        <div className="question-card">
            <h2 className="question-text">{question.text}</h2>

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
