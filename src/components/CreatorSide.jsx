import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST, getErrorMessage } from '../Constants';
import WaitingLobby from "./WaitingLobby";
import GameTimer from "./GameTimer";
import ResultsScreen from "./ResultsScreen";
import Button from "./Button";
import '../styles/CreatorSide.css';
import RacingTrack from "../components/RaceingTrack.jsx"; // <--- ניצור את הקומפוננטה הזו
import '../styles/CreatorSide.css';

function CreatorSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [status, setStatus] = useState(gameData?.status || 0);
    const [startedAt, setStartedAt] = useState(gameData?.startedAt || null);
    const [rankings, setRankings] = useState(null);
    const [winnerName, setWinnerName] = useState(null);

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
                    if (data.startedAt) setStartedAt(data.startedAt);
                    break;
                case "PLAYER_MOVED":
                    setPlayersList(prevList => {
                        const newList = [...prevList];
                        const index = newList.findIndex(p => p.id === data.player.id);
                        if (index !== -1) {
                            newList[index] = data.player;
                        }
                        return newList;
                    });
                    break;
                case "GAME_OVER":
                    setStatus(2);
                    if (data.rankings) setRankings(data.rankings);
                    if (data.winnerName) setWinnerName(data.winnerName);
                    break;
                default:
                    break;
            }
        });

        return () => eventSource.close();
    }, [id]);

    const handleStartGame = () => {
        const token = Cookies.get("token");
        axios.post(`${HOST}start-game`, {
            token: token,
            gameId: parseInt(id)
        }).then(response => {
            if (!response.data.success) {
                alert(getErrorMessage(response.data.errorCode));
            }
        }).catch(err => console.error(err));
    };

    const handleEndGame = () => {
        const token = Cookies.get("token");
        axios.post(`${HOST}end-game`, {
            token: token,
            gameId: parseInt(id)
        }).then(response => {
            if (!response.data.success) {
                alert(getErrorMessage(response.data.errorCode));
            }
        }).catch(err => console.error(err));
    };

    if (status === 2) {
        return (
            <div className="creator-side">
                <ResultsScreen rankings={rankings} winnerName={winnerName} onBack={() => navigate('/dashboard')} />
            </div>
        );
    }

    if (status === 1) {
        return (
            <div className="creator-side running-game">
                <h2 className="creator-title">דשבורד מורה - המירוץ הגדול!</h2>
                <div className="game-header-info">
                    <GameTimer startedAt={startedAt} />
                    {/* אפשר להוסיף כאן מקרא או מידע כללי אם רוצים */}
                </div>

                {/* 1. מחליפים את ה-Scoreboard במסלול המירוצים הרחב והחדש */}
                <RacingTrack
                    players={playersList}
                    trackLength={gameData?.trackLength}
                />

                <div className="creator-end-game">
                    <Button text="סיים משחק" onClick={handleEndGame} className="btn-end-game" />
                </div>
            </div>
        );
    }

    return (
        <div className="creator-side">
            <WaitingLobby
                gameName={gameData?.gameName}
                gameCode={gameData?.gameCode}
                players={playersList}
                onStartGame={handleStartGame}
            />
        </div>
    );
}

export default CreatorSide;