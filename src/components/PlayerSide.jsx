import React, {useEffect, useState, useCallback, useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import {HOST} from '../Constants';
import axios from "axios";
import QuestionCard from "./QuestionCard";
import GameTimer from "./GameTimer";
import ProgressBar from "./ProgressBar";
import ResultsScreen from "./ResultsScreen";
import '../styles/PlayerSide.css';

function PlayerSide({gameData}) {
    const {id} = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState(gameData?.status || 0);
    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [myName, setMyName] = useState("");
    const [myId, setMyId] = useState(null);
    const [startedAt, setStartedAt] = useState(gameData?.startedAt || null);
    const [rankings, setRankings] = useState(null);
    const [winnerName, setWinnerName] = useState(null);

    const [question, setQuestion] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const trackLength = gameData?.trackLength || 1000;

    // --- הפתרון לניקוד סמכותי ---
    // 1. קודם כל מזהים את השחקן שלי מתוך הרשימה (מתעדכן כל פעם שיש SSE)
    const myPlayer = useMemo(() =>
            myId ? playersList.find(p => p.id === myId) : null
        , [playersList, myId]);

    // 2. שולפים את הנתונים הפשוטים מתוך השחקן (חייב להיות לפני השימוש בהם)
    const myScore = myPlayer ? myPlayer.score : 0;
    const myStreak = myPlayer ? myPlayer.streak : 0;
    // 3. עכשיו אפשר לחשב אחוזים בבטחה (מוודא שלא עובר את ה-100%)
    const progressPercent = useMemo(() => {
        return Math.min(100, Math.max(0, (myScore / trackLength) * 100));
    }, [myScore, trackLength]);
    const distanceToAbove = useMemo(() => {
        if (!myId || playersList.length < 2) return null;

        const sorted = [...playersList].sort((a, b) => b.score - a.score);
        const myIndex = sorted.findIndex(p => p.id === myId);

        if (myIndex > 0) {
            const me = sorted[myIndex];
            const playerAbove = sorted[myIndex - 1];
            return {
                points: playerAbove.score - me.score,
                name: playerAbove.fullName
            };
        }
        return null;
    }, [playersList, myId]);

    const fetchQuestion = useCallback(() => {
        const token = Cookies.get("token");
        setLoading(true);
        axios.post(`${HOST}get-question`, {token, gameId: parseInt(id)})
            .then(res => {
                if (res.data.success) {
                    setQuestion({text: res.data.questionText, options: res.data.options});
                    setFeedback(null);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    // אפקט ראשון: טעינת פרטי משתמש (קורה פעם אחת)
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;

        axios.get(`${HOST}get-default-params`, {params: {token}})
            .then(res => {
                if (res.data.success) {
                    setMyName(res.data.fullName);
                    setMyId(res.data.id);
                }
            });
    }, []);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) return;

        const sseUrl = `${HOST}game-subscribe?token=${token}&gameId=${id}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("gameEvent", (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case "PLAYERS_LIST_UPDATE":
                    setPlayersList(data.players);
                    break;
                case "GAME_STARTED":
                    setStatus(1);
                    setStartedAt(data.startedAt);
                    // כאן זה בסדר לקרוא לזה, כי זה בתוך Callback של אירוע חיצוני
                    fetchQuestion();
                    break;
                case "PLAYER_MOVED":
                    setPlayersList(prev => prev.map(p => p.id === data.player.id ? data.player : p));
                    break;
                case "GAME_OVER":
                    setStatus(2);
                    setRankings(data.rankings);
                    setWinnerName(data.winnerName);
                    break;
            }
        });

        return () => eventSource.close();
    }, [id, fetchQuestion]); // יציב בזכות ה-useCallback
    useEffect(() => {
        // אנחנו מוודאים שהמשחק רץ, שאין שאלה ושלא נמצאים כבר בטעינה
        if (status === 1 && !question && !loading) {

            // עטיפה ב-setTimeout של 0 "שוברת" את השרשרת הסינכרונית
            // ומספקת ל-ESLint את השקט שהוא צריך
            const timer = setTimeout(() => {
                fetchQuestion();
            }, 0);

            // ניקוי הטיימר אם הקומפוננטה יוצאת מהמסך
            return () => clearTimeout(timer);
        }
    }, [status, question, loading, fetchQuestion]);

    const handleAnswerClick = (answer) => {
        if (loading || feedback === 'correct') return;
        setLoading(true);
        const token = Cookies.get("token");

        axios.post(`${HOST}submit-answer`, {token, gameId: parseInt(id), answer})
            .then(res => {
                if (res.data.success) {
                    setFeedback('correct');
                    // לא מעדכנים כאן ניקוד! מחכים ל-SSE שישלח PLAYER_MOVED
                    setTimeout(() => fetchQuestion(), 800);
                } else {
                    setFeedback('wrong');
                    setTimeout(() => {
                        setFeedback(null);
                        setLoading(false);
                    }, 1000);
                }
            })
            .catch(() => setLoading(false));
    };

    if (status === 2) {
        return (
            <div className="player-side">
                <ResultsScreen rankings={rankings} winnerName={winnerName} onBack={() => navigate('/dashboard')}/>
            </div>
        );
    }

    return (
        <div className="player-side">
            <h2>מרוץ הלמידה</h2>
            <h3>משחק: {gameData?.gameName} | מתחרה: {myName}</h3>

            {status === 0 ? (
                <div className="player-waiting">
                    <h4>ממתין לתחילת המשחק...</h4>
                    <p>שחקנים מחוברים: {playersList.length}</p>
                </div>
            ) : (
                <div>
                    <GameTimer startedAt={startedAt}/>
                    {/* פרוגרס בר עם אחוזים אמיתיים שמחושבים מהשרת */}
                    <div className="custom-progress-container">
                        <div
                            className="custom-progress-bar"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <span className="progress-text">{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                    {/* תצוגת מרחק מהמקום שמעליי */}
                    {distanceToAbove ? (
                        <div className="distance-alert">
                            עוד <strong>{distanceToAbove.points}</strong> נקודות לעקוף את {distanceToAbove.name}
                        </div>
                    ) : myScore > 0 ? (
                        <div className="distance-alert winner">🏆 אתה מוביל את המירוץ!</div>
                    ) : null}

                    {/* אנימציית אש כשיש סטרייק */}
                    {myStreak > 1 && (
                        <div className="fire-streak-wrap">
                            <div className="fire-icon">
                                <div className="flame"></div>
                                <div className="flame"></div>
                                <div className="flame"></div>
                            </div>
                            <span className="streak-count">רצף של {myStreak}!</span>
                        </div>
                    )}
                    <QuestionCard
                        question={question}
                        feedback={feedback}
                        loading={loading}
                        onAnswerClick={handleAnswerClick}
                    />
                </div>
            )}
        </div>
    );
}

export default PlayerSide;