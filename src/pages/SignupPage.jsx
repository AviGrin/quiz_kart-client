import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { HOST, getErrorMessage } from "../Constants.js";
import Cookies from "js-cookie";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import '../styles/SignupPage.css';

function SignupPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignup = () => {
        setErrorMessage("");
        axios.post(HOST + "signup", { username, password, fullName })
            .then((response) => {
                if (response.data.success) {
                    Cookies.set("token", response.data.token);
                    navigate("/dashboard");
                } else {
                    setErrorMessage(getErrorMessage(response.data.errorCode));
                }
            }).catch(() => {
            setErrorMessage("שגיאת תקשורת, נסה שוב מאוחר יותר");
        });
    };

    return (
        <div className="signup-page">
            <Card title="צור חשבון חדש">
                {errorMessage && (
                    <div className="signup-error">{errorMessage}</div>
                )}

                <div className="signup-fields">
                    <Input
                        label="שם משתמש"
                        placeholder="בחר שם משתמש באנגלית"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        label="סיסמה"
                        type="password"
                        placeholder="סיסמה (6 תווים)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="שם מלא"
                        placeholder="שם פרטי ומשפחה"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="signup-actions">
                    <Button
                        text="הרשמה"
                        onClick={handleSignup}
                        disabled={password.length !== 6 || username.length === 0 || !fullName.includes(" ")}
                    />
                    <div className="signup-link-area">
                        <span>כבר יש לך חשבון? </span>
                        <button onClick={() => navigate("/")}>היכנס</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default SignupPage;