import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST, getErrorMessage } from '../Constants';
import WaitingLobby from "./WaitingLobby";
import GameTimer from "./GameTimer";
import ResultsScreen from "./ResultsScreen";
import Button from "./Button";
import RacingTrack from "./RacingTrack";
import EventFeed from "./EventFeed";
import '../styles/CreatorSide.css';

const FEED_EVENT_TYPES = ["OVERTAKE", "STREAK", "LUCK_EVENT", "JUNCTION_CHOSEN"];
const MAX_EVENTS = 50;

function CreatorSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [status, setStatus] = useState(gameData?.status || 0);
    const [startedAt, setStartedAt] = useState(gameData?.startedAt || null);
    const [rankings, setRankings] = useState(null);
    const [winnerName, setWinnerName] = useState(null);
    const [feedEvents, setFeedEvents] = useState([]);

    const eventIdCounter = useRef(0);
    const eventSourceRef = useRef(null);

    const addFeedEvent = (data) => {
        eventIdCounter.current += 1;
        const newEvent = { ...data, id: eventIdCounter.current };
        setFeedEvents(prev => [newEvent, ...prev].slice(0, MAX_EVENTS));
    };

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) return;

        const connectSSE = () => {
            const sseUrl = `${HOST}game-subscribe?token=${token}&gameId=${id}`;
            const es = new EventSource(sseUrl);

            es.addEventListener("gameEvent", (event) => {
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

                if (FEED_EVENT_TYPES.includes(data.type)) {
                    addFeedEvent(data);
                }
            });

            es.onerror = () => {
                es.close();
                setTimeout(() => {
                    if (eventSourceRef.current === es) {
                        eventSourceRef.current = connectSSE();
                    }
                }, 3000);
            };

            return es;
        };

        eventSourceRef.current = connectSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
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
                </div>

                <div className="creator-game-layout">
                    <div className="creator-track-area">
                        <RacingTrack
                            players={playersList}
                            trackLength={gameData?.trackLength}
                        />

                        <div className="creator-end-game">
                            <Button text="סיים משחק" onClick={handleEndGame} className="btn-end-game" />
                        </div>
                    </div>

                    <EventFeed events={feedEvents} />
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
                maxPlayers={gameData?.maxPlayers}
            />
        </div>
    );
}

export default CreatorSide;