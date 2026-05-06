import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import PlayerSide from "../components/PlayerSide";
import CreatorSide from "../components/CreatorSide";
import '../styles/GamePage.css';

const USERS_ROLE = {
    NONE: 0,
    CREATOR: 1,
    PLAYER: 2
};

function GamePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [role, setRole] = useState(USERS_ROLE.NONE);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) {
            navigate("/");
            return;
        }

        axios.get(`${HOST}get-game`, { params: { token, id } })
            .then(gameRes => {
                if (gameRes.data.success) {
                    const fetchedGame = gameRes.data.gameModel;
                    setGame(fetchedGame);

                    return axios.get(`${HOST}get-default-params`, { params: { token } })
                        .then(userRes => {
                            if (!userRes.data.success) {
                                navigate("/");
                                return;
                            }

                            const currentUserId = userRes.data.id;

                            if (fetchedGame.creator.id === currentUserId) {
                                setRole(USERS_ROLE.CREATOR);
                            } else if (fetchedGame.players.some(p => p.id === currentUserId)) {
                                setRole(USERS_ROLE.PLAYER);
                            } else {
                                navigate("/dashboard");
                            }
                        });
                } else {
                    navigate("/dashboard");
                }
            })
            .catch(() => navigate("/dashboard"));
    }, [id, navigate]);

    if (role === USERS_ROLE.PLAYER) {
        return <PlayerSide gameData={game} />;
    }

    if (role === USERS_ROLE.CREATOR) {
        return <CreatorSide gameData={game} />;
    }

    return <div className="game-page-loading">טוען נתוני משחק...</div>;
}

export default GamePage;