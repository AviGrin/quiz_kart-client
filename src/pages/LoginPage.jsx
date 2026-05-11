import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { HOST, getErrorMessage } from "../Constants";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Input from "../components/Input";
import '../styles/LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        setError("");
        axios.post(HOST + "login", {
            username: username,
            password: password
        }).then(response => {
            if (response.data.success) {
                Cookies.set("token", response.data.token);
                navigate("/dashboard");
            } else {
                setError(getErrorMessage(response.data.errorCode));
            }
        }).catch(() => {
            setError("שגיאת תקשורת, נסה שוב מאוחר יותר");
        });
    };

    return (
        <div className="login-page">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <span className="login-logo">🏎️</span>
                <h1 className="login-title">מרוץ הלמידה</h1>
                <p className="login-subtitle">התחבר כדי להתחיל לשחק!</p>

                <div className="login-form">
                    <Input
                        label="שם משתמש"
                        placeholder="הכנס שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        label="סיסמה"
                        placeholder="הכנס סיסמה"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="login-error">{error}</p>}

                <div className="login-actions">
                    <Button
                        text="התחבר"
                        onClick={handleLogin}
                        disabled={!username.trim() || password.length !== 6}
                    />
                    <p className="login-link">
                        אין לך חשבון? <Link to="/signup">הירשם עכשיו</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;