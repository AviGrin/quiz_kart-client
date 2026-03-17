import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import PlayerSide from "../components/PlayerSide.jsx"
import CreatorSide from "../components/CreatorSide.jsx"


function GamePage(){
    const {id} = useParams();
    const [game,setGame] = useState(null);
    const navigate = useNavigate();
    const USERS_ROLE = {
        NONE: 0,
        CREATOR: 1,
        PLAYER: 2
    }
    const [role, setRole] = useState(USERS_ROLE.NONE);



    useEffect(() => {
        const token = Cookies.get("token");
        if (!token || !id) {
            navigate("/");
            return;
        }

        const USERS_ROLE = { NONE: 0, CREATOR: 1, PLAYER: 2 };

        axios.get(`${HOST}/get-game`, { params: { token, id } })
            .then(gameRes => {
                if (gameRes.data.success) {
                    const fetchedGame = gameRes.data.gameModel;
                    setGame(fetchedGame);

                    return axios.get(`${HOST}/get-default-params`, { params: { token } })
                        .then(userRes => {
                            const currentUserId = userRes.data.id;

                            if (fetchedGame.creator.id === currentUserId) {
                                setRole(USERS_ROLE.CREATOR);
                            } else if (fetchedGame.players.some(p => p.id === currentUserId)) {
                                setRole(USERS_ROLE.PLAYER);
                            } else {
                                setRole(USERS_ROLE.NONE);
                            }
                        });
                } else {
                    alert("התחברות נכשלה: " + gameRes.data.message);
                    navigate("/dashboard");
                }
            })
            .catch(err => console.error(err));

    }, [id, navigate]);




    if (role === USERS_ROLE.PLAYER) {
        return <PlayerSide gameData={game} />;
    } else if (role === USERS_ROLE.CREATOR) {
        return <CreatorSide gameData={game} />;
    } else {
        return <div style={{textAlign: "center", marginTop: "50px"}}>טוען נתוני משחק...</div>;
    }

}

export default GamePage;