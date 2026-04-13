import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST, getErrorMessage } from '../Constants';
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import '../styles/LoginPage.css';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token != null) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = () => {
        setErrorMessage("");
        axios.post(HOST + "login", { username, password })
            .then(response => {
                if (response.data.success) {
                    Cookies.set('token', response.data.token);
                    navigate("/dashboard");
                } else {
                    setErrorMessage(getErrorMessage(response.data.errorCode));
                }
            }).catch(() => {
            setErrorMessage("שגיאת תקשורת, נסה שוב מאוחר יותר");
        });
    };

    return (
        <div className="login-page">
            <Card title="התחברות למערכת">
                {errorMessage && (
                    <div className="login-error">{errorMessage}</div>
                )}

                <Input
                    label="שם משתמש"
                    placeholder="הכנס את שם המשתמש שלך"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                    label="סיסמה"
                    type="password"
                    placeholder="הכנס סיסמה (6 תווים)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="login-actions">
                    <Button
                        text="היכנס"
                        onClick={handleLogin}
                        disabled={password.length !== 6 || username.length === 0}
                    />

                    <div className="login-link-area">
                        <span>אין לך חשבון? </span>
                        <button onClick={() => navigate("/signup")}>הירשם כאן</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;