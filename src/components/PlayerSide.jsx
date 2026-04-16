import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants';
import axios from "axios";
import QuestionCard from "./QuestionCard";
import GameTimer from "./GameTimer";
import ProgressBar from "./ProgressBar";
import ResultsScreen from "./ResultsScreen";
import '../styles/PlayerSide.css';

function PlayerSide({ gameData }) {
    const { id } = useParams();
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

    const myPlayer = myId ? playersList.find(p => p.id === myId) : null;
    const myScore = myPlayer ? myPlayer.score : 0;

    const fetchQuestion = useCallback(() => {
        const token = Cookies.get("token");
        setLoading(true);
        axios.post(`${HOST}get-question`, { token, gameId: parseInt(id) })
            .then(res => {
                if (res.data.success) {
                    setQuestion({ text: res.data.questionText, options: res.data.options });
                    setFeedback(null);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;

        axios.get(`${HOST}get-default-params`, { params: { token } })
            .then(res => {
                if (res.data.success) {
                    setMyName(res.data.fullName);
                    setMyId(res.data.id);
                }
            });

        if (gameData?.status === 1) {
            setTimeout(() => fetchQuestion(), 0);
        }

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
                    fetchQuestion();
                    break;
                case "PLAYER_MOVED":
                    setPlayersList(prev => prev.map(p => p.id === data.player.id ? data.player : p));
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
    }, [id, gameData, fetchQuestion]);

    const handleAnswerClick = (answer) => {
        if (loading) return;
        setLoading(true);
        const token = Cookies.get("token");

        axios.post(`${HOST}submit-answer`, { token, gameId: parseInt(id), answer })
            .then(res => {
                if (res.data.success) {
                    setFeedback('correct');
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
                <ResultsScreen rankings={rankings} winnerName={winnerName} onBack={() => navigate('/dashboard')} />
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
                    <GameTimer startedAt={startedAt} />
                    <div className="player-progress-section">
                        <ProgressBar score={myScore} trackLength={trackLength} />
                    </div>
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