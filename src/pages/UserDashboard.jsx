import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { HOST, getErrorMessage } from "../Constants";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import '../styles/UserDashboard.css';

function UserDashboard() {
    const navigate = useNavigate();
    const [newGameName, setNewGameName] = useState("");
    const [newGameType, setNewGameType] = useState(0);
    const [gameCode, setGameCode] = useState("");

    const [isModal1Open, setIsModal1Open] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const handleNewGame = () => {
        const token = Cookies.get("token");
        axios.post(HOST + "new-game", {
            token: token,
            newGameName: newGameName,
            gameType: parseInt(newGameType)
        }).then(response => {
            if (response.data.success) {
                setIsModal1Open(false);
                navigate("/game/" + response.data.gameId);
            } else {
                alert(getErrorMessage(response.data.errorCode));
            }
        }).catch(() => {
            alert("שגיאת תקשורת, נסה שוב מאוחר יותר");
        });
    };

    const handleJoinGame = () => {
        const token = Cookies.get("token");
        axios.post(HOST + "join-game", {
            token: token,
            gameCode: gameCode
        }).then(response => {
            if (response.data.success) {
                setIsModal2Open(false);
                navigate("/game/" + response.data.gameId);
            } else {
                alert(getErrorMessage(response.data.errorCode));
            }
        }).catch(() => {
            alert("שגיאת תקשורת, נסה שוב מאוחר יותר");
        });
    };

    const handleLogout = () => {
        Cookies.remove("token");
        navigate("/");
    };

    return (
        <div className="dashboard-page">
            <h1>ברוך הבא למרוץ הלמידה!</h1>

            <div className="dashboard-buttons">
                <Button text="צור משחק חדש (מורה)" onClick={() => setIsModal1Open(true)} />
                <Button text="היכנס למשחק (תלמיד)" onClick={() => setIsModal2Open(true)} />
                <Button text="התנתק" onClick={handleLogout} className="btn-logout" />
            </div>

            <Modal isOpen={isModal1Open} onClose={() => setIsModal1Open(false)} title="יצירת חדר חדש">
                <Input
                    label="שם החדר"
                    placeholder="למשל: כיתה ד'2"
                    value={newGameName}
                    onChange={(e) => setNewGameName(e.target.value)}
                />

                <div className="dashboard-select-group">
                    <label>רמת קושי:</label>
                    <select
                        value={newGameType}
                        onChange={(e) => setNewGameType(e.target.value)}
                    >
                        <option value={0}>רמה קלה (חיבור וחיסור)</option>
                        <option value={1}>רמה בינונית (כפל וחילוק)</option>
                        <option value={2}>רמה קשה (אחוזים)</option>
                    </select>
                </div>

                <Button
                    text="צור משחק חדש"
                    disabled={!newGameName.trim()}
                    onClick={handleNewGame}
                />
            </Modal>

            <Modal isOpen={isModal2Open} onClose={() => setIsModal2Open(false)} title="הצטרפות למשחק">
                <p className="modal-description">הכנס את קוד המשחק שקיבלת מהמורה:</p>
                <Input
                    label="קוד משחק"
                    placeholder="הכנס קוד משחק"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                />
                <Button
                    text="היכנס למשחק"
                    disabled={!gameCode.trim() || gameCode.length !== 6}
                    onClick={handleJoinGame}
                />
            </Modal>
        </div>
    );
}

export default UserDashboard;