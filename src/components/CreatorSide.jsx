import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import Button from "./Button";

function CreatorSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // משיכת נתונים ישירות ממה שהגיע מ-GamePage
    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [status, setStatus] = useState(gameData?.status || 0);

    // יעד הניצחון (בשביל לחשב כמה המכונית מתקדמת באחוזים)
    const trackLength = gameData?.trackLength || 1000;

    // חיבור ה-SSE - צינור מרכזי אחד!
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) return;

        const sseUrl = `${HOST}/game-subscribe?token=${token}&gameId=${id}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("gameEvent", (event) => {
            const data = JSON.parse(event.data);
            console.log("📥 התקבל אירוע חי (Creator):", data.type, data);

            switch (data.type) {
                case "PLAYERS_LIST_UPDATE":
                    setPlayersList(data.players);
                    break;

                case "GAME_STARTED":
                    setStatus(1);
                    break;

                case "PLAYER_MOVED":
                    // תיקון קטן: השרת שולח את האובייקט המלא בתוך data.player
                    setPlayersList(prevList => prevList.map(p =>
                        p.id === data.player?.id ? { ...p, score: data.player.score } : p
                    ));
                    break;

                case "GAME_OVER":
                    setStatus(2);
                    break;

                default:
                    console.warn("⚠️ אירוע לא מוכר:", data.type);
            }
        });

        eventSource.onerror = (error) => {
            console.error("שגיאה בחיבור ה-SSE. מנסה להתחבר מחדש...", error);
        };

        return () => {
            eventSource.close();
        };
    }, [id]);

    const handleStartGame = () => {
        const token = Cookies.get("token");

        axios.get(`${HOST}/start-game`, {
            params: { token: token, gameId: id }
        }).then(response => {
            if (response.data.success) {
                console.log("פקודת התחלת משחק נשלחה בהצלחה");
            } else {
                alert("נוצרה שגיאה בהתחלת המשחק: " + response.data.message);
            }
        }).catch(err => {
            console.error(err);
        });
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>

            {/* --- סטטוס 1: המרוץ פעיל --- */}
            {status === 1 ? (
                <div style={{ width: "100%" }}>
                    <h2>🔥 המרוץ בעיצומו! - דשבורד מורה 🔥</h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px", padding: "0 10px" }}>
                        {playersList.map((player) => {
                            const score = player.score || 0;
                            const progressPercentage = Math.min((score / trackLength) * 100, 100);

                            return (
                                <div key={player.id} style={{ display: "flex", alignItems: "center", gap: "15px" }}>

                                    {/* שם השחקן */}
                                    <div style={{ width: "120px", textAlign: "right", fontWeight: "bold", fontSize: "18px" }}>
                                        {player.fullName}
                                    </div>

                                    {/* מסלול המרוצים */}
                                    <div style={{
                                        flex: 1,
                                        height: "50px",
                                        backgroundColor: "#333", // צבע של כביש
                                        borderRadius: "25px",
                                        position: "relative",
                                        overflow: "hidden",
                                        border: "2px dashed #ffc107" // שוליים של כביש
                                    }}>
                                        {/* המכונית שזזה! */}
                                        <div style={{
                                            position: "absolute",
                                            top: 0,
                                            right: `${progressPercentage}%`, // מתחיל מימין
                                            transform: "translateX(100%)", // מתקן את הרוחב של האימוג'י
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            transition: "right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" // אנימציה קופצנית וכיפית!
                                        }}>
                                            <span style={{ fontSize: "35px", marginLeft: "10px" }}>🏎️</span>
                                        </div>
                                    </div>

                                    {/* תצוגת הניקוד */}
                                    <div style={{ width: "60px", fontWeight: "bold", fontSize: "20px", color: "#007BFF" }}>
                                        {score}/{trackLength}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                /* --- סטטוס 2: המשחק נגמר --- */
            ) : status === 2 ? (
                <div style={{ marginTop: "20px", padding: "30px", backgroundColor: "#f8f9fa", borderRadius: "15px", border: "2px solid #28a745" }}>
                    <h1 style={{ fontSize: "60px", margin: "0" }}>🏆</h1>
                    <h2 style={{ color: "#28a745" }}>המשחק הסתיים!</h2>
                    <h3 style={{ marginBottom: "20px" }}>טבלת מנצחים סופית:</h3>

                    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "right" }}>
                        {/* מיון השחקנים לפי ניקוד מהגבוה לנמוך */}
                        {[...playersList]
                            .sort((a, b) => (b.score || 0) - (a.score || 0))
                            .map((player, index) => (
                                <div key={player.id} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "15px",
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: index === 0 ? "#fff3cd" : index === 1 ? "#e2e3e5" : index === 2 ? "#f8d7da" : "transparent",
                                    fontWeight: index < 3 ? "bold" : "normal",
                                    fontSize: index === 0 ? "24px" : "18px",
                                    borderRadius: "8px",
                                    marginBottom: "5px"
                                }}>
                                    <span>
                                        {index === 0 && "🥇 "}
                                        {index === 1 && "🥈 "}
                                        {index === 2 && "🥉 "}
                                        {index > 2 && `${index + 1}. `}
                                        {player.fullName}
                                    </span>
                                    <span>{player.score || 0} נק'</span>
                                </div>
                            ))}
                    </div>

                    <div style={{ marginTop: "30px" }}>
                        <Button
                            text="חזור ללוח הבקרה"
                            onClick={() => navigate('/dashboard')}
                        />
                    </div>
                </div>

                /* --- סטטוס 0: לובי והמתנה --- */
            ) : (
                <div style={{ marginTop: "30px" }}>
                    <h2>קוד כניסה לחדר: <span style={{ color: "#007BFF", fontSize: "36px" }}>{gameData?.gameCode}</span></h2>

                    <div style={{ margin: "30px 0", padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "10px" }}>
                        {playersList.length === 0 ? (
                            <h3 style={{ color: "#666" }}>ממתין לשחקנים... ⏳</h3>
                        ) : (
                            <>
                                <h3>שחקנים שמחוברים ({playersList.length}):</h3>
                                <ul style={{ listStyle: "none", padding: 0, fontSize: "20px" }}>
                                    {playersList.map((p, index) => (
                                        <li key={index} style={{ margin: "10px 0" }}>✅ {p.fullName} (מוכן)</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* כפתור ה-Start (מוצג רק בלובי) */}
            {status === 0 && (
                <div style={{ marginTop: "20px" }}>
                    <Button
                        text={status === 1 ? "המשחק רץ" : status === 2 ? "משחק נגמר" : "התחל משחק"}
                        onClick={handleStartGame}
                        disabled={status === 1 || status === 2 || playersList.length < 1}
                    />
                </div>
            )}
        </div>
    );
}

export default CreatorSide;