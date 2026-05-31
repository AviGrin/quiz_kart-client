import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IoTrophy, IoCheckmarkCircle, IoCloseCircle, IoTimer, IoFlame, IoStatsChart } from 'react-icons/io5';
import '../styles/PlayerStats.css';

const BAR_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function StatsTooltip({ active, payload }) {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;
    return (
        <div className="stats-tooltip">
            <p className="stats-tooltip-title">{data.name}</p>
            <p>{data.correct} / {data.total} נכונות</p>
            <p>זמן ממוצע: {data.avgTime} שנ׳</p>
        </div>
    );
}

function PlayerStats({ stats }) {
    if (!stats) return null;

    const hasAnswers = stats.totalAnswers > 0;
    const hasGames = stats.totalGames > 0;

    if (!hasGames && !hasAnswers) {
        return (
            <div className="player-stats-empty stats-fade-in">
                <span className="stats-empty-icon">📊</span>
                <p>עדיין אין נתונים — שחק משחק ראשון!</p>
            </div>
        );
    }

    const overviewCards = [
        { icon: <IoStatsChart />, label: 'משחקים', value: stats.totalGames, color: '#8b5cf6' },
        { icon: <IoTrophy />, label: 'ניצחונות', value: stats.gamesWon, color: '#f59e0b' },
        { icon: <IoCheckmarkCircle />, label: 'תשובות נכונות', value: stats.correctAnswers, color: '#10b981' },
        { icon: <IoCloseCircle />, label: 'טעויות', value: stats.wrongAnswers, color: '#ef4444' },
        { icon: <IoFlame />, label: 'אחוז הצלחה', value: `${stats.successRate}%`, color: '#3b82f6' },
        { icon: <IoTimer />, label: 'זמן ממוצע', value: `${stats.avgTimeSec} שנ׳`, color: '#06b6d4' },
    ];

    const opData = (stats.operationStats || []).map((op, i) => ({
        name: op.name,
        successRate: op.successRate,
        total: op.total,
        correct: op.correct,
        avgTime: op.avgTimeSec,
        color: BAR_COLORS[i % BAR_COLORS.length]
    }));

    return (
        <div className="player-stats stats-fade-in">
            <h3 className="stats-section-title">הסטטיסטיקות שלי</h3>

            <div className="stats-overview-grid">
                {overviewCards.map((card, i) => (
                    <div
                        key={card.label}
                        className="stats-card stats-card-enter"
                        style={{ animationDelay: `${i * 0.05}s` }}
                    >
                        <span className="stats-card-icon" style={{ color: card.color }}>{card.icon}</span>
                        <span className="stats-card-value">{card.value}</span>
                        <span className="stats-card-label">{card.label}</span>
                    </div>
                ))}
            </div>

            {opData.length > 0 && (
                <div className="stats-chart-section">
                    <h4 className="stats-chart-title">הצלחה לפי נושא</h4>
                    <div className="stats-chart-wrapper">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={opData} layout="vertical" margin={{ top: 0, right: 10, left: 50, bottom: 0 }}>
                                <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} stroke="#64748b" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={14} width={50} />
                                <Tooltip content={<StatsTooltip />} cursor={false} />
                                <Bar dataKey="successRate" radius={[0, 6, 6, 0]} barSize={24}>
                                    {opData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {stats.recentGames && stats.recentGames.length > 0 && (
                <div className="stats-recent-section">
                    <h4 className="stats-chart-title">משחקים אחרונים</h4>
                    <div className="stats-recent-list">
                        {stats.recentGames.map((game, i) => (
                            <div key={i} className="stats-recent-row">
                                <span className="stats-recent-name">{game.gameName}</span>
                                <span className="stats-recent-score">{game.score} נק׳</span>
                                <span className="stats-recent-answers">
                                    <span className="recent-correct">{game.correctAnswers}</span>
                                    {' / '}
                                    <span className="recent-wrong">{game.wrongAnswers}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlayerStats;