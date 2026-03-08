import React, { useEffect, useState } from "react";
import axios from "axios";
import {data, useNavigate, useParams} from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import PlayerSide from "../components/PlayerSide.jsx"
import CreatorSide from "../components/CreatorSide.jsx"


function GamePage(){
    const {id} = useParams();
    const [game,setGame] = useState(null);
    const navigate = useNavigate();
    const USERS_ROLL = {
        NONE: 0,
        CREATOR: 1,
        PLAYER: 2
    }
    const [roll, setRoll] = useState(USERS_ROLL.NONE);



    useEffect(()=>{
        const token = Cookies.get("token");
        if (!token || !id){
            navigate("/");
        }else {
            axios.get(HOST + "get-game", {
                params: { token: token,id: id}
            }).then(response => {
                if (response.data.success) {
                    setGame(response.data.gameModel);
                } else {
                    alert("התחברות נכשלה: " + response.data.message);
                }
            })
        }
    },[id, navigate]);

    useEffect(()=>{
        const token = Cookies.get("token");
        axios.get(HOST + "get-default-params", {
            params: { token: token }
        }).then(response => {
            if (game.creator.id === response.data.id){
                setRoll(USERS_ROLL.CREATOR);
            }else if (game.players.find(p => p.id === response.data.id) !== null){
                setRoll(USERS_ROLL.PLAYER)
            }else {
                setRoll(USERS_ROLL.NONE);
            }
        })
    },[USERS_ROLL.CREATOR, USERS_ROLL.NONE, USERS_ROLL.PLAYER, game])

    if (roll === USERS_ROLL.PLAYER){
        return(
            <PlayerSide />
        )
    }else if (roll === USERS_ROLL.CREATOR){
        return (
            <CreatorSide/>
        )
    }else {
        return (
            <>loading...</>
        )
    }
}

export default GamePage;