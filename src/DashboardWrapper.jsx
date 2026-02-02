import { useEffect, useState } from "react";
import axios from "axios";
import UserDashboard from "./pages/UserDashboard.jsx";

import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { HOST } from "./Constants";

function DashboardWrapper() {
    const navigate = useNavigate();
    const [success,setSuccess] = useState(false);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/")
        } else {
            axios.get(HOST + "get-default-params", {
                params: { token: token }
            }).then(response => {
                setSuccess(response.data.success)
            })
        }
    }, [navigate]);


    if (success) {
        return (
            <UserDashboard />
        )
    } else {
        return (
            <div >
                Loading...
            </div>
        )
    }

}

export default DashboardWrapper;