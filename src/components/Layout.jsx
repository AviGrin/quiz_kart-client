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
        <div style={{
            padding: '2rem 1rem',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border)',
                flexWrap: 'wrap',
                gap: '1rem'

            }}>
                {title && <h1 style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>{title}</h1>}
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0}}>
                    <Input
                        placeholder="Search..."
                        value={searchValue || ""}
                        onChange={(e) => setSearchValue && setSearchValue(e.target.value)}
                        style={{marginBottom: 0}}
                        className={"min-w-[300px]"}
                    />
                    <Button
                        text="Logout"
                        variant="secondary"
                        onClick={handleLogout}
                        style={{width: 'auto'}}
                    />
                </div>
            </header>

            <main className="main-content" style={{flex: 1}}>
                {children}
            </main>

            <footer style={{
                marginTop: 'auto',
                padding: '2rem 0',
                borderTop: '1px solid var(--border)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
            }}>
                <p style={{marginBottom: '0.5rem'}}>
                    This site was built by third-year Computer Science students from Ashkelon College, Gan Yavne
                    campus, class of 2026, as part of a course on Innovative Integrated Development Environments. </p>
                <p>
                    All rights reserved © 2026 </p>
            </footer>
        </div>
    );
};

export default Layout;
