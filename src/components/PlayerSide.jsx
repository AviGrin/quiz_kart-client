import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants';
import axios from "axios";
import QuestionCard from "./QuestionCard";
import GameTimer from "./GameTimer";
import ProgressBar from "./ProgressBar";
import ResultsScreen from "./ResultsScreen";
import JunctionChoice from "./JunctionChoice";
import LuckPopup from "./LuckPopup";
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

    const [timeLeft, setTimeLeft] = useState(null);
    const [timeLimit, setTimeLimit] = useState(null);
    const timerRef = useRef(null);

    const [questionMode, setQuestionMode] = useState("normal");
    const [dirtRoadRemaining, setDirtRoadRemaining] = useState(0);
    const [canSwap, setCanSwap] = useState(false);

    const [luckEvent, setLuckEvent] = useState(null);

    const eventSourceRef = useRef(null);
    const myIdRef = useRef(null);
    const loadingRef = useRef(false);
    const timeLeftRef = useRef(null);
    const submittingRef = useRef(false);

    const trackLength = gameData?.trackLength || 1000;

    const myPlayer = myId ? playersList.find(p => p.id === myId) : null;
    const myScore = myPlayer ? myPlayer.score : 0;

    useEffect(() => {
        myIdRef.current = myId;
    }, [myId]);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    const setLoadingState = (val) => {
        loadingRef.current = val;
        setLoading(val);
    };

    const clearCountdown = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const startCountdown = useCallback((seconds) => {
        clearCountdown();
        setTimeLeft(seconds);
        setTimeLimit(seconds);
        timeLeftRef.current = seconds;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1;
                timeLeftRef.current = next;
                if (next <= 0) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    return 0;
                }
                return next;
            });
        }, 1000);
    }, []);

    const fetchQuestion = useCallback(() => {
        const token = Cookies.get("token");
        setLoadingState(true);
        axios.post(`${HOST}get-question`, { token, gameId: parseInt(id) })
            .then(res => {
                if (res.data.success) {
                    const mode = res.data.questionMode || "normal";
                    setQuestionMode(mode);

                    if (mode === "junction") {
                        setQuestion(null);
                        setFeedback(null);
                        setCanSwap(false);
                        clearCountdown();
                        setTimeLeft(null);
                        timeLeftRef.current = null;
                    } else {
                        setQuestion({ text: res.data.questionText, options: res.data.options });
                        setFeedback(null);
                        setDirtRoadRemaining(res.data.dirtRoadRemaining || 0);
                        setCanSwap(res.data.canSwap || false);
                        startCountdown(res.data.timeLimitSeconds || 15);
                    }
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingState(false));
    }, [id, startCountdown]);

    const handleTimeUp = useCallback(() => {
        if (submittingRef.current || loadingRef.current) return;
        submittingRef.current = true;
        setLoadingState(true);
        setFeedback('timeout');
        clearCountdown();
        const token = Cookies.get("token");

        axios.post(`${HOST}submit-answer`, { token, gameId: parseInt(id), answer: -1 })
            .then(() => {})
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    submittingRef.current = false;
                    setFeedback(null);
                    setLoadingState(false);
                    fetchQuestion();
                }, 1200);
            });
    }, [id, fetchQuestion]);

    useEffect(() => {
        if (timeLeft === 0 && !submittingRef.current && !loadingRef.current) {
            handleTimeUp();
        }
    }, [timeLeft, handleTimeUp]);

    const handleSwap = () => {
        if (loading) return;
        setLoadingState(true);
        clearCountdown();
        const token = Cookies.get("token");

        axios.post(`${HOST}swap-question`, { token, gameId: parseInt(id) })
            .then(res => {
                if (res.data.success) {
                    setQuestion({ text: res.data.questionText, options: res.data.options });
                    setFeedback(null);
                    setCanSwap(false);
                    startCountdown(res.data.timeLimitSeconds || 15);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingState(false));
    };

    const handleJunctionChoice = (choice) => {
        const token = Cookies.get("token");
        setLoadingState(true);
        axios.post(`${HOST}choose-junction`, { token, gameId: parseInt(id), choice })
            .then(res => {
                if (res.data.success) {
                    fetchQuestion();
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingState(false));
    };

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
                        fetchQuestion();
                        break;
                    case "PLAYER_MOVED":
                        setPlayersList(prev => prev.map(p => p.id === data.player.id ? data.player : p));
                        break;
                    case "LUCK_EVENT":
                        if (data.playerId === myIdRef.current) {
                            setLuckEvent(data.event);
                        }
                        break;
                    case "GAME_OVER":
                        setStatus(2);
                        clearCountdown();
                        if (data.rankings) setRankings(data.rankings);
                        if (data.winnerName) setWinnerName(data.winnerName);
                        break;
                    default:
                        break;
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
            clearCountdown();
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [id, gameData, fetchQuestion]);

    const handleAnswerClick = (answer) => {
        if (loading || submittingRef.current) return;
        submittingRef.current = true;
        setLoadingState(true);
        const token = Cookies.get("token");

        axios.post(`${HOST}submit-answer`, { token, gameId: parseInt(id), answer })
            .then(res => {
                if (res.data.success) {
                    clearCountdown();
                    submittingRef.current = false;
                    if (questionMode === "autostrada") {
                        setFeedback('autostrada-success');
                    } else {
                        setFeedback('correct');
                    }
                    setTimeout(() => fetchQuestion(), questionMode === "autostrada" ? 1500 : 800);
                } else {
                    if (questionMode === "autostrada") {
                        clearCountdown();
                        submittingRef.current = false;
                        setFeedback('autostrada-fail');
                        setTimeout(() => {
                            setFeedback(null);
                            setLoadingState(false);
                            fetchQuestion();
                        }, 2000);
                    } else if (questionMode === "dirtroad") {
                        clearCountdown();
                        submittingRef.current = false;
                        setFeedback('wrong');
                        setTimeout(() => {
                            setFeedback(null);
                            setLoadingState(false);
                            fetchQuestion();
                        }, 1000);
                    } else {
                        submittingRef.current = false;
                        setFeedback('wrong');
                        setTimeout(() => {
                            setFeedback(null);
                            setLoadingState(false);
                            if (timeLeftRef.current !== null && timeLeftRef.current <= 0) {
                                handleTimeUp();
                            }
                        }, 1000);
                    }
                }
            })
            .catch(() => {
                submittingRef.current = false;
                setLoadingState(false);
            });
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

                    {questionMode === "junction" ? (
                        <JunctionChoice onChoose={handleJunctionChoice} loading={loading} />
                    ) : (
                        <QuestionCard
                            question={question}
                            feedback={feedback}
                            loading={loading}
                            onAnswerClick={handleAnswerClick}
                            timeLeft={timeLeft}
                            timeLimit={timeLimit}
                            questionMode={questionMode}
                            dirtRoadRemaining={dirtRoadRemaining}
                            canSwap={canSwap}
                            onSwap={handleSwap}
                        />
                    )}
                </div>
            )}

            <LuckPopup event={luckEvent} onClose={() => setLuckEvent(null)} />
        </div>
    );
}

export default PlayerSide;