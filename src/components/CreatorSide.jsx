import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import Button from "./Button";

function CreatorSide({ gameData }) {
    const { id } = useParams();

    // משיכת נתונים ישירות ממה שהגיע מ-GamePage
    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [status, setStatus] = useState(gameData?.status || 0);

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
                    setPlayersList(prevList => prevList.map(p =>
                        p.id === data.userId ? { ...p, score: data.newScore, streak: data.streak } : p
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
                // לא חייבים לעשות פה setStatus כי ה-SSE ממילא ישדר "GAME_STARTED" לכולם
                console.log("פקודת התחלת משחק נשלחה בהצלחה");
            } else {
                alert("נוצרה שגיאה בהתחלת המשחק: " + response.data.message);
            }
        }).catch(err => {
            console.error(err);
        });
    };

    return (
        <div>
            {status === 1 ? (
                <div>
                    <h2>המשחק רץ! - דשבורד מורה</h2>
                    {/* כאן בעתיד נצייר את מסלול המכוניות */}
                    <ul>
                        {playersList
                            .sort((a, b) => b.score - a.score) // מיון לפי ניקוד מוביל
                            .map((p, index) => (
                                <li key={index}>
                                    {index + 1}. {p.fullName} - ניקוד: {p.score} (רצף תשובות: {p.streak})
                                </li>
                            ))}
                    </ul>
                </div>
            ) : status === 2 ? (
                <div>
                    <h2>המשחק הסתיים!</h2>
                    {/* טבלת מנצחים סופית */}
                </div>
            ) : (
                <div>
                    <p><strong>קוד כניסה לחדר: {gameData?.gameCode}</strong></p>
                    <ul>
                        {playersList.length === 0 ? (
                            <li>ממתין לשחקנים...</li>
                        ) : (
                            <>
                                <li>שחקנים שחוברו:</li>
                                {playersList.map((p, index) => (
                                    <li key={index}>{p.fullName} (מוכן)</li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>
            )}

            <Button
                text={status === 1 ? "המשחק רץ" : status === 2 ? "משחק נגמר" : "התחל משחק"}
                onClick={handleStartGame}
                disabled={status === 1 || status === 2 || playersList.length < 1}
            />
        </div>
    );
}

export default CreatorSide;