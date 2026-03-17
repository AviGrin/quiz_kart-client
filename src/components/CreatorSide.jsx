import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import Button from "./Button";

function CreatorSide({ gameData }) {
    const [localGameData, setLocalGameData] = useState(gameData);
    const navigate = useNavigate();
    const { id } = useParams();
    const [playersList, setPlayersList] = useState([]);
    const [status, setStatus] = useState(0);

    useEffect(() => {
        const token = Cookies.get("token");

        if (!token || !id) {
            navigate("/");
            return;
        }

        if (!localGameData) {
            axios.get(`${HOST}/get-game`, {
                params: { token: token, id: id }
            }).then(response => {
                if (response.data.success) {
                    setLocalGameData(response.data.gameModel);
                } else {
                    alert("שגיאה במשיכת נתוני המשחק");
                    navigate("/dashboard");
                }
            }).catch(err => {
                console.error("שגיאת תקשורת:", err);
            });
        }
    }, [id, localGameData, navigate]);
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) {
            return;
        }
        const sseUrl = `${HOST}/game-subscribe?token=${token}&gameId=${id}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("gameUpdate", (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "PLAYER_JOINED") {
                setPlayersList(prevPlayers => [...prevPlayers, data.playerName]);
            }
        });
        eventSource.onerror = (error) => {
            console.error("שגיאה בחיבור ה-SSE. מנסה להתחבר מחדש...", error);
        };
        return () => {
            eventSource.close();
        };
    }, [id]);
    if (!localGameData) {
        return <div>טוען נתוני חדר ניהול...</div>;
    }

    const gameCode = localGameData.gameCode;

    const handleStartGame = () => {
        const token = Cookies.get("token");

        axios.get(`${HOST}/start-game`, {
            params: { token: token, gameId: id }
        }).then(response => {
            if (response.data.success) {
                setStatus(1);

            } else {
                alert("נוצרה שגיאה בהתחלת המשחק: " + response.data.message);
            }
        }).catch(err => {
            console.error(err);
        });
    };

    return (
        <div>
            {status===1 ? (
                <div>
                    <h2>המשחק התחיל!</h2>
                    {/* אמור להציג את התחרות במסך... */}
                </div>
            ) : (
                <div>
                    <p>game code : {gameCode}</p>
                    <ul>
                        {playersList.length === 0 ?
                            (<li>ממתין לשחקנים...</li>)
                            :
                            <>
                                <li>שחקנים בהמתנה...</li>
                                {playersList.map((player, index) => (
                                    <li key={index}>{player}</li>
                                ))}
                            </>
                        }
                    </ul>
                </div>
            )}

            <Button
                text={status ===1 ? "המשחק רץ" : "התחל משחק"}
                onClick={handleStartGame}
                disabled={status===1 ||status===2 || playersList.length < 1}
            />
        </div>
    );
}

export default CreatorSide;