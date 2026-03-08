import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import {HOST} from "../Constants.js";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Card from "../components/Card";

function UserDashboard(){
    const navigate = useNavigate();
    const [newGameName, setNewGameName] = useState("");

    const [newGameType,setnewGameType] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        if (!newGameName || newGameType === -1) {
            alert("נא למלא שם משחק ולבחור סוג");
            return;
        }else {setIsModalOpen(false)}


        axios.get(HOST+"newGame", {
            params: {
                token: token,
                newGameName: newGameName,
                gameType: newGameType
            }
        }).then(response => {
            if (response.data.success) {
                navigate("/game/" + response.data.id);
            } else {
                alert("יצירת המשחק נכשלה: " + response.data.message);
            }
        }).catch(err => {
            console.error("Error creating game:", err);
            alert("שגיאה בתקשורת עם השרת");
        });
    };



    return(
        <>
            <Button text={"התחל משחק חדש"} onClick={() => setIsModalOpen(true)}/>


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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
                    {(e) => setnewGameType(e.target.value)}>
                    <option value="0">חשבון קל</option>
                    <option value="1">חשבון בינוני</option>
                    <option value="2">חשבון מתקדם</option>
                    <option value="2">חשבון קשה</option>

                </select>


                <Button
                    text={"צור משחק חדש"}
                    disabled={!newGameName.trim() || newGameType === -1}
                    onClick={handleNewGame}
                >
                </Button>
            </Modal>



        </>
    );
}

export default UserDashboard;
