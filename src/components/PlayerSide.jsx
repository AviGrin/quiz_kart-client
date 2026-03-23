import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import axios from "axios";

function PlayerSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();

    // אתחול הסטייט ישירות מהנתונים ש-GamePage כבר הביא לנו (חוסך קריאה מיותרת!)
    const [status, setStatus] = useState(gameData?.status || 0);
    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [liveStatus, setLiveStatus] = useState("ממתין לתחילת המשחק...");
    const [myName, setMyName] = useState("");

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

        // מאזינים רק ל-"gameEvent" - הנתב שלנו יעשה את השאר
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
                    // כאן נוכל גם לאתחל את השאלה הראשונה אם היא מגיעה מהשרת
                    break;

                case "PLAYER_MOVED":
                    // מעדכנים רק את השחקן הספציפי שזז ברשימה
                    setPlayersList(prevList => prevList.map(p =>
                        p.id === data.userId ? { ...p, score: data.newScore, streak: data.streak } : p
                    ));
                    break;

                case "GAME_OVER":
                    setStatus(2);
                    setLiveStatus(`המשחק נגמר!`);
                    break;

                // הכנה לעתיד:
                // case "CROSSROADS_EVENT":
                //     הצגת פופאפ בחירת מסלול
                //     break;

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

    }, [id]); // ESLint עכשיו רגוע - רק id קובע מתי מתחברים מחדש

    return (
        <div>
            <h2>מסך השחקן</h2>
            <h3>משחק מספר: {id} | שלום {myName}</h3>

            <div>
                <p><strong>{liveStatus}</strong></p>
            </div>

            <div>
                {status === 0 ? (
                    <ul>
                        {playersList.length === 0 ? (
                            <li>ממתין לשחקנים נוספים...</li>
                        ) : (
                            <>
                                <li><strong>מתחרים בחדר:</strong></li>
                                {playersList
                                    .filter(p => p.fullName !== myName)
                                    .map((p, index) => (
                                        <li key={index}>{p.fullName} - ניקוד: {p.score}</li>
                                    ))}
                            </>
                        )}
                    </ul>
                ) : status === 1 ? (
                    <div>
                        {/* כאן נבנה את קומפוננטת השאלות והתשובות */}
                        <div style={{ padding: "20px", border: "2px solid #ccc", marginTop: "20px" }}>
                            <h3>תרגיל לדוגמה: 5 + 7 = ?</h3>
                            <button>12</button>
                            <button>13</button>
                            <button>10</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>המשחק הסתיים!</h2>
                        <p>כל הכבוד לכל המשתתפים.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlayerSide;