import React from 'react';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import '../styles/global.css';
import Button from "./Button";
import Input from "./Input";

const Layout = ({children, title, searchValue, setSearchValue}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("token");
        navigate("/");
    };

    return (
        <div >
            <header >
                {title && <h1 >{title}</h1>}
                <div >
                    <Input
                        placeholder="Search..."
                        value={searchValue || ""}
                        onChange={(e) => setSearchValue && setSearchValue(e.target.value)}
                    />
                    <Button
                        text="Logout"
                        variant="secondary"
                        onClick={handleLogout}
                    />
                </div>
            </header>

            <main className="main-content" >
                {children}
            </main>

            <footer>
                <p >
                    This site was built by third-year Computer Science students from Ashkelon College, Gan Yavne
                    campus, class of 2026, as part of a course on Innovative Integrated Development Environments. </p>
                <p>
                    All rights reserved © 2026 </p>
            </footer>
        </div>
    );
};

export default Layout;
