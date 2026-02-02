import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { HOST } from '../Constants.js';
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

const LOGIN_STATUSES = {
    PENDING: 0,
    SUCCESS: 1,
    FAILURE: 2
}

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(LOGIN_STATUSES.PENDING);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token != null) {
            navigate("/dashboard")
        }
    }, [navigate])

    const handleLogin = () => {
        axios.get(HOST + "login", {
            params: { username, password}
        }).then(response => {
            if (response.data.success) {
                Cookies.set('token', response.data.token)
                navigate("/dashboard");
            } else {
                setLoginStatus(LOGIN_STATUSES.FAILURE)
            }
        }).catch(err => {
            console.error(err);
            setLoginStatus(LOGIN_STATUSES.FAILURE);
        });
    };

    return (
        <div>

            <div >
                <Card title="Welcome Back">
                    <p >
                        Please enter your details to sign in.
                    </p>

                    {loginStatus === LOGIN_STATUSES.FAILURE && (
                        <div >
                            Wrong credentials or connection error!
                        </div>
                    )}

                    <Input
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter 6-digit password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div >
                        <Button
                            text="Sign In"
                            onClick={handleLogin}
                            disabled={password.length !== 6 || username.length === 0}
                        />

                        <div >
                            <span >Don't have an account? </span>
                            <button
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default LoginPage;
