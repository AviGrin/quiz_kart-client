import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import {HOST} from "../Constants.js";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Card from "../components/Card";

function UserDashboard(){
    const navigate = useNavigate();
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            navigate("/")
        } else {
            console.log("hi");
        }
    }, [navigate]);

    return(
        <>hii</>
    )
}

export default UserDashboard;
