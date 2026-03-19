import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import axios from "axios";

function PlayerSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [localGameData, setLocalGameData] = useState(gameData);
    const [myName, setMyName] = useState("");
    const [status, setStatus] = useState(gameData ? gameData.status : 0);

    const [liveStatus, setLiveStatus] = useState("ממתין לתחילת המשחק...");
    const [playersList, setPlayersList] = useState(gameData && gameData.players ? gameData.players : []);
    useEffect(() => {
        const token = Cookies.get("token");

        if (!token || !id) {
            navigate("/");
            return;
        }

        if(!localGameData){
            axios.get(`${HOST}/get-game`, {
                params: { token: token, id: id }
            }).then(response => {
                if (response.data.success) {
                    setLocalGameData(response.data.gameModel);


                    if (response.data.gameModel && response.data.gameModel.players) {
                        setPlayersList(response.data.gameModel.players);
                    }

                    axios.get(`${HOST}/get-default-params`, { params: { token } })
                        .then(userRes => setMyName(userRes.data.fullName));

                } else {
                    alert("שגיאה במשיכת נתוני המשחק");
                    navigate("/dashboard");
                }
            }).catch(err => console.error(err));
        }
    }, [id, localGameData, navigate]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) return;

        //sse connection
        const sseUrl = `${HOST}/game-subscribe?token=${token}&gameId=${id}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener("playersUpdate", (event) => { // (וב-Creator: "gameUpdate")
            const data = JSON.parse(event.data);
            console.log("התקבל עדכון חי:", data);

            if (data.type === "PLAYERS_LIST_UPDATE") {
                setPlayersList(data.players);
            }
        });

        eventSource.addEventListener("statusChange", (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "GAME_STARTED") {
                setLiveStatus("המשחק התחיל... בהצלחה!");
                setStatus(1)

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

    return (
        <div>
            <h2>מסך השחקן</h2>
            <h3>משחק מספר: {id}</h3>

            <div>
                <p>{liveStatus}</p>
            </div>

            <div>
                {status === 0 ?
                    (<ul>
                        {playersList.length === 0 ?
                            (<li>ממתין לשחקנים...</li>)
                            :
                            <>
                                <li>שחקנים בהמתנה...</li>
                                {playersList
                                    .filter(p => p.fullName !== myName)
                                    .map((p, index) => (
                                        <li key={index}>{p.fullName} - ניקוד: {p.score}</li>
                                    ))}
                            </>
                        }
                    </ul>):
                    <div>
                        {
                            <p>
                                questions & answers
                            </p>
                            //פה יהיה השאלות והתשובות שאלות ותשובות וכו'

                        }
                    </div>
                }
            </div>
            {}
        </div>
    );
}

export default PlayerSide;