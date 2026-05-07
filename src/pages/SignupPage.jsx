import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { HOST, getErrorMessage } from "../Constants";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Input from "../components/Input";
import '../styles/SignupPage.css';

function SignupPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = () => {
        setError("");
        axios.post(HOST + "signup", {
            fullName: fullName,
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
        <div className="signup-page">
            <motion.div
                className="signup-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <span className="signup-logo">🏁</span>
                <h1 className="signup-title">הרשמה למרוץ</h1>
                <p className="signup-subtitle">צור חשבון חדש והצטרף למשחק!</p>

                <div className="signup-form">
                    <Input
                        label="שם מלא"
                        placeholder="הכנס שם מלא"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                        label="שם משתמש"
                        placeholder="הכנס שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        label="סיסמה (6 תווים)"
                        placeholder="הכנס סיסמה"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="signup-error">{error}</p>}

                <div className="signup-actions">
                    <Button
                        text="הירשם"
                        onClick={handleSignup}
                        disabled={!fullName.trim() || !username.trim() || password.length !== 6}
                    />
                    <p className="signup-link">
                        כבר יש לך חשבון? <Link to="/">התחבר</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default SignupPage;