import Button from "./Button.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import {HOST} from "../Constants.js";

function CreatorSide({id}){

    const startGame = () => {
        const token = Cookies.get("token");



        axios.get(HOST+"start-game", {
            params: {
                token: token,
                gameId: id
            }
        }).then(response => {
            if (response.data.success) {
                alert("Success");
            } else {
                alert("ההתחברות לחדר נכשלה בגלל : " + response.data.message);
            }
        }).catch(err => {
            console.error("Error joining game:", err);
            alert("שגיאה בתקשורת עם השרת");
        });
    };

    return (
        <><Button text={"START"} onClick={startGame}/></>
    );
}
export default CreatorSide;