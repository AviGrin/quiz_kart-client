import { useEffect, useState } from "react";
import axios from "axios";
import UserDashboard from "./pages/UserDashboard";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { HOST } from "./Constants";

function DashboardWrapper() {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/");
        } else {
            axios.get(HOST + "get-default-params", {
                params: { token }
            }).then(response => {
                if (response.data.success) {
                    setSuccess(true);
                } else {
                    Cookies.remove("token");
                    navigate("/");
                }
            }).catch(() => {
                navigate("/");
            });
        }
    }, [navigate]);

    if (success) {
        return <UserDashboard />;
    }

    return <div className="game-page-loading">טוען...</div>;
}

export default DashboardWrapper;