import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import {HOST} from "../Constants.js";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";

function UserDashboard(){
    const navigate = useNavigate();
    const [newGameName, setNewGameName] = useState("");
    const GAME_TYPE = {
        easy: 0,
        medium:1,
        hard:2
    }
    const [newGameType,setNewGameType] = useState(GAME_TYPE.medium);
    const [gameCode,setGameCode] = useState("");

    const [isModal1Open, setIsModal1Open] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);



    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/")
        } else {
            console.log("hi");
        }
    }, [navigate]);
    const handleNewGame = () => {
        const token = Cookies.get("token");
        axios.get(HOST+"new-game", {
            params: {
                token: token,
                newGameName: newGameName,
                gameType: newGameType
            }
        }).then(response => {
            if (response.data.success) {
                setIsModal1Open(false)
                navigate("/game/" + response.data.id);
            } else {
                alert("יצירת המשחק נכשלה: " + response.data.message);
            }
        }).catch(err => {
            console.error("Error creating game:", err);
            alert("שגיאה בתקשורת עם השרת");
        });
    };
    const handleJoinGame = () => {
        const token = Cookies.get("token");



        axios.get(HOST+"join-game", {
            params: {
                token: token,
                gameCode: gameCode
            }
        }).then(response => {
            if (response.data.success) {
                setIsModal2Open(false)

                navigate("/game/" + response.data.id);
            } else {
                alert("ההתחברות לחדר נכשלה בגלל : " + response.data.message);
            }
        }).catch(err => {
            console.error("Error joining game:", err);
            alert("שגיאה בתקשורת עם השרת");
        });
    };



    return(
        <>
            <Button text={"התחל משחק חדש"} onClick={() => setIsModal1Open(true)}/>


            <Modal
                isOpen={isModal1Open}
                onClose={() => setIsModal1Open(false)}
            >
                <h2>הגדרות פרופיל</h2>
                <p>כאן תוכל לעדכן את הפרטים שלך:</p>


                <Input
                    label="שם משחק"
                    placeholder="הכנס שם למשחק"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                />
                <select placeholder={"בחר סוג וקושי של שאלות"} onChange=
                    {(e) => setNewGameType(e.target.value)} value={GAME_TYPE.medium}>
                    <option value={GAME_TYPE.easy}>חשבון קל</option>
                    <option value={GAME_TYPE.medium}>חשבון בינוני</option>
                    <option value={GAME_TYPE.hard}>חשבון קשה</option>

                </select>


                <Button
                    text={"צור משחק חדש"}
                    disabled={!newGameName.trim()}
                    onClick={handleNewGame}
                />

            </Modal>

            <Button text={"היכנס למשחק"} onClick={() => setIsModal2Open(true)}/>

            <Modal
                isOpen={isModal2Open}
                onClose={() => setIsModal2Open(false)}
            >
                <h2>קוד משחק</h2>
                <p>הכנס את קוד המשחק שקיבלת מהמנהל שלו</p>


                <Input
                    label="קוד משחק"
                    placeholder="הכנס קוד משחק"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                />

                <Button
                    text={"היכנס למשחק"}
                    disabled={!gameCode.trim() ||gameCode.length !==6}
                    onClick={handleJoinGame}
                >
                </Button>
            </Modal>


        </>
    );
}

export default UserDashboard;
