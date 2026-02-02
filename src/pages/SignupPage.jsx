import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { HOST } from "../Constants.js";
import Cookies from "js-cookie";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";


const SIGNUP_STATUSES = {
    PENDING: 0,
    SUCCESS: 1,
    FAILURE: 2
};

function SignupPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const [signupStatus, setSignupStatus] = useState(SIGNUP_STATUSES.PENDING);

    const handleSignup = () => {
        axios.get(HOST + "signup", {
            params: {
                username,
                password,
                fullName,
            }
        }).then((response) => {
            if (response.data.success) {
                Cookies.set("token", response.data.token);
                navigate("/dashboard");
            } else {
                setSignupStatus(SIGNUP_STATUSES.FAILURE);
            }
        });
    };



    return (
        <div >
            <Card title="Create Account" >
                {signupStatus === SIGNUP_STATUSES.FAILURE && (
                    <div >
                        Something went wrong. Please try again.
                    </div>
                )}



                <div >
                    <Input
                        label="Username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="6-digit password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="Full Name"
                        placeholder="First and Last Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ gridColumn: 'span 2' }}
                    />
                </div>


                <div >
                    <Button
                        text="Sign Up"
                        onClick={handleSignup}
                        disabled={password.length !== 6 || username.length === 0 || !fullName.includes(" ")}

                    />
                    <div >
                        <span >Already have an account? </span>
                        <button
                            onClick={() => navigate("/")}

                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </Card>

        </div>
    );
}

export default SignupPage;
