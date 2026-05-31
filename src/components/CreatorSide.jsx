import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST} from '../Constants';
import { IoPeople } from 'react-icons/io5';
import WaitingLobby from "./WaitingLobby";
import GameTimer from "./GameTimer";
import ResultsScreen from "./ResultsScreen";
import Button from "./Button";
import RacingTrack from "./RacingTrack";
import Leaderboard from "./Leaderboard";
import EventToast from "./EventToast";
import '../styles/CreatorSide.css';
import ParallaxBackground from "./ParallaxBackground";

function CreatorSide({ gameData }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playersList, setPlayersList] = useState(gameData?.players || []);
    const [status, setStatus] = useState(gameData?.status || 0);
    const [startedAt, setStartedAt] = useState(gameData?.startedAt || null);
    const [rankings, setRankings] = useState(null);
    const [winnerName, setWinnerName] = useState(null);

    const [activeToasts, setActiveToasts] = useState([]);
    const eventSourceRef = useRef(null);

    const buildToastText = (data) => {
        switch(data.type) {
            case "OVERTAKE": return `${data.overtakerName} עקף את ${data.overtakenName}!`;
            case "STREAK": return `${data.playerName} להט עם רצף של ${data.streak}!`;
            case "LUCK_EVENT":
            {const luckMsg = {
                    TURBO: 'קיבל טורבו!', DOUBLE_POINTS: 'קיבל נקודות כפולות!',
                    FLAT_TIRE: 'חטף תקר בגלגל!', OIL_SLICK: 'החליק על כתם שמן!'
                };
                return `${data.playerName} ${luckMsg[data.event] || 'נתקל בהפתעה!'}`;}
            case "JUNCTION_CHOSEN":
                return `${data.playerName} ירד ל${data.junctionChoice === 'autostrada' ? 'אוטוסטרדה' : 'דרך עפר'}`;
            default: return "אירוע מרגש במסלול!";
        }
    };

    const addToast = (data) => {
        const text = buildToastText(data);
        const newToast = { id: Date.now() + Math.random(), type: data.type, text };

        setActiveToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setActiveToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 4000);
    };

    const handleLeaveGame = () => {
        const token = Cookies.get("token");
        axios.post(`${HOST}leave-game`, { token, gameId: parseInt(id) })
            .then(() => navigate('/dashboard'))
            .catch(() => navigate('/dashboard'));
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (status === 0) {
                const token = Cookies.get("token");
                const payload = JSON.stringify({ token, gameId: parseInt(id) });
                const blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon(`${HOST}leave-game`, blob);
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [id, status]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) return;

        const connectSSE = () => {
            const sseUrl = `${HOST}game-subscribe?token=${token}&gameId=${id}`;
            const es = new EventSource(sseUrl);

            es.onopen = () => {
                axios.get(`${HOST}get-game`, { params: { token, id } })
                    .then(res => {
                        if (res.data.success) {
                            const syncedGame = res.data.gameModel;
                            setPlayersList(syncedGame.players);
                            setStatus(syncedGame.status);
                            if (syncedGame.startedAt) setStartedAt(syncedGame.startedAt);
                        }
                    });
            };

            es.addEventListener("gameEvent", (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "PLAYERS_LIST_UPDATE": setPlayersList(data.players); break;
                    case "GAME_STARTED": setStatus(1); break;
                    case "PLAYER_MOVED":
                        setPlayersList(prev => prev.map(p => p.id === data.player.id ? data.player : p));
                        break;
                    case "GAME_OVER":
                        setStatus(2);
                        if (data.rankings) setRankings(data.rankings);
                        if (data.winnerName) setWinnerName(data.winnerName);
                        break;
                    case "GAME_CANCELLED":
                        alert("המשחק בוטל על ידי היוצר.");
                        navigate("/dashboard");
                        break;
                    case "OVERTAKE":
                    case "STREAK":
                    case "LUCK_EVENT":
                    case "JUNCTION_CHOSEN":
                        addToast(data);
                        break;
                }
            });

            es.onerror = () => { es.close(); setTimeout(connectSSE, 3000); };
            return es;
        };

        eventSourceRef.current = connectSSE();
        return () => eventSourceRef.current?.close();
    }, [id, navigate]);

    const handleStartGame = () => {
        const token = Cookies.get("token");
        axios.post(`${HOST}start-game`, { token, gameId: parseInt(id) })
            .catch(err => console.error(err));
    };

    const handleEndGame = () => {
        const token = Cookies.get("token");
        axios.post(`${HOST}end-game`, { token, gameId: parseInt(id) })
            .catch(err => console.error(err));
    };

    if (status === 2) return <ResultsScreen rankings={rankings} winnerName={winnerName} onBack={() => navigate('/dashboard')} />;

    return (
        <div className="creator-side running-game">

            <ParallaxBackground />
            <div className="toast-container">
                {activeToasts.map(toast => (
                    <EventToast key={toast.id} event={toast} />
                ))}
            </div>

            {status === 1 ? (
                <>
                    <div className="creator-header card-enter">
                        <div className="creator-header-right">
                            <h2 className="creator-title">{gameData?.gameName || 'המירוץ הגדול'}</h2>
                            <div className="creator-header-badges">
                                <span className="header-badge">
                                    <IoPeople /> {playersList.length} שחקנים
                                </span>
                            </div>
                        </div>
                        <div className="creator-header-center">
                            <GameTimer startedAt={startedAt} />
                        </div>
                        <div className="creator-header-left">
                            <Button text="סיים משחק" onClick={handleEndGame} className="btn-end-game" />
                        </div>
                    </div>

                    <div className="creator-track-section">
                        <RacingTrack players={playersList} trackLength={gameData?.trackLength} />
                    </div>

                    <div style={{ width: '100%' }}>
                        <Leaderboard players={playersList} trackLength={gameData?.trackLength || 1000} />
                    </div>
                </>
            ) : (
                <WaitingLobby
                    gameName={gameData?.gameName} gameCode={gameData?.gameCode}
                    players={playersList} onStartGame={handleStartGame}
                    maxPlayers={gameData?.maxPlayers} onLeave={handleLeaveGame}
                />
            )}
        </div>
    );
}

export default CreatorSide;