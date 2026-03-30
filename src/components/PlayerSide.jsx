import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import axios from "axios";

function PlayerSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // סטייטים של ניהול החדר
    const [status, setStatus] = useState(gameData?.status || 0);
    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [liveStatus, setLiveStatus] = useState("ממתין לתחילת המשחק...");
    const [myName, setMyName] = useState("");

    // --- סטייטים חדשים לניהול השאלות והתשובות ---
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
    const [loading, setLoading] = useState(false);

    // משיכת שם המשתמש פעם אחת בלבד בעליית הקומפוננטה
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axios.get(`${HOST}/get-default-params`, { params: { token } })
                .then(userRes => {
                    if (userRes.data.success) {
                        setMyName(userRes.data.fullName);
                    }
                })
                .catch(err => console.error("שגיאה במשיכת נתוני משתמש:", err));
        }
    }, []);

    // חיבור ה-SSE - צינור מרכזי אחד!
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) return;

        const sseUrl = `${HOST}/game-subscribe?token=${token}&gameId=${id}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("gameEvent", (event) => {
            const data = JSON.parse(event.data);
            console.log("📥 התקבל אירוע חי (Player):", data.type, data);

            switch (data.type) {
                case "PLAYERS_LIST_UPDATE":
                    setPlayersList(data.players);
                    break;

                case "GAME_STARTED":
                    setStatus(1);
                    setLiveStatus("המשחק התחיל... בהצלחה!");
                    break;

                case "PLAYER_SCORED":
                case "PLAYER_MOVED":
                    setPlayersList(prevList => prevList.map(p =>
                        p.id === data.player?.id ? { ...p, score: data.player.score } : p
                    ));
                    break;

                case "GAME_OVER":
                    setStatus(2);
                    setLiveStatus(`המשחק נגמר!`);
                    break;

                default:
                    console.warn("⚠️ אירוע לא מוכר:", data.type);
            }
        });

        eventSource.onerror = (error) => {
            console.error("שגיאה בחיבור ה-SSE. מנסה להתחבר מחדש...", error);
        };

        return () => {
            console.log("סוגר את חיבור ה-SSE...");
            eventSource.close();
        };
    }, [id]);

    // --- לוגיקת המשחק: משיכת שאלה ---
    const fetchQuestion = async () => {
        const token = Cookies.get("token");
        setLoading(true);
        setFeedback(null);
        try {
            const response = await axios.get(`${HOST}/get-question`, {
                params: { token, gameId: id }
            });
            if (response.data.success) {
                setQuestion(response.data.questionText);
                setOptions(response.data.options);
            } else {
                console.error("שגיאה בקבלת שאלה:", response.data.errorCode);
            }
        } catch (error) {
            console.error("שגיאת רשת במשיכת שאלה", error);
        } finally {
            setLoading(false);
        }
    };

    // ברגע שהסטטוס משתנה ל-1 (המשחק התחיל), אנחנו מושכים את השאלה הראשונה!
    useEffect(() => {
        if (status === 1) {
            fetchQuestion();
        }
    }, [status]);

    // --- לוגיקת המשחק: שליחת תשובה ---
    const handleAnswerClick = async (answer) => {
        if (loading) return;
        const token = Cookies.get("token");
        setLoading(true);

        try {
            // שים לב שזה POST, אבל אנחנו מעבירים את הנתונים כ-Params כי ככה הגדרת בשרת
            const response = await axios.post(`${HOST}/submit-answer?token=${token}&gameId=${id}&answer=${answer}`);

            if (response.data.success) {
                setFeedback('correct');
                // ממתין חצי שנייה ואז מביא שאלה חדשה
                setTimeout(() => {
                    fetchQuestion();
                }, 500);
            } else {
                setFeedback('wrong');
                // ממתין חצי שנייה ונותן לו לנסות שוב באותה שאלה
                setTimeout(() => {
                    setFeedback(null);
                    setLoading(false);
                }, 500);
            }
        } catch (error) {
            console.error("שגיאה בשליחת תשובה", error);
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
            <h2>מסך השחקן</h2>
            <h3>משחק מספר: {id} | שלום {myName}</h3>

            <div style={{ marginBottom: "20px" }}>
                <p><strong>{liveStatus}</strong></p>
            </div>

            <div>
                {status === 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {playersList.length === 0 ? (
                            <li>ממתין לשחקנים נוספים...</li>
                        ) : (
                            <>
                                <li><strong>מתחרים בחדר:</strong></li>
                                {playersList
                                    .filter(p => p.fullName !== myName)
                                    .map((p, index) => (
                                        <li key={index} style={{ margin: "5px 0" }}>
                                            {p.fullName} - ניקוד: {p.score || 0}
                                        </li>
                                    ))}
                            </>
                        )}
                    </ul>
                ) : status === 1 ? (

                    /* --- אזור המשחק הפעיל --- */
                    <div style={{ padding: "30px", border: "3px solid #333", borderRadius: "15px", maxWidth: "500px", margin: "0 auto", backgroundColor: "#f9f9f9" }}>

                        <h2 style={{
                            fontSize: "40px",
                            color: feedback === 'correct' ? 'green' : feedback === 'wrong' ? 'red' : 'black',
                            transition: "color 0.3s"
                        }}>
                            {question ? `${question} = ?` : "מכין תרגיל..."}
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "30px" }}>
                            {options.map((opt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(opt)}
                                    disabled={loading}
                                    style={{
                                        padding: "15px",
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        backgroundColor: "#007BFF",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        <div style={{ height: "30px", marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
                            {feedback === 'correct' && <span style={{ color: 'green' }}>✓ אלופה! / אלוף!</span>}
                            {feedback === 'wrong' && <span style={{ color: 'red' }}>✗ אופס... נסה שוב!</span>}
                        </div>

                    </div>

                ) : status === 2 ? (

                    /* --- אזור סיום המשחק (שחקן) --- */
                    <div style={{ padding: "40px", border: "3px solid #4CAF50", borderRadius: "15px", backgroundColor: "#e8f5e9", marginTop: "30px" }}>
                        <h1 style={{ fontSize: "50px", margin: "0" }}>🎉</h1>
                        <h2 style={{ color: "#2E7D32" }}>המשחק הסתיים!</h2>
                        <p style={{ fontSize: "20px" }}>כל הכבוד על ההשתתפות במרוץ.</p>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                fontSize: "18px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            חזור למסך הראשי
                        </button>
                    </div>

                ) : null}
            </div>
        </div>
    );
}

export default PlayerSide;