import axios from 'axios';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Login = ({ isLoggedIn, setIsLoggedIn, setAccessToken }) => {
    useEffect(() => {
        const url = window.location.href;
        const hasCode = url.includes('?code=');

        if (hasCode) {
            const newUrl = url.split('?code=');
            window.history.pushState({}, null, newUrl[0]);
            const code = newUrl[1];

            axios({
                method: 'GET',
                url: 'http://localhost:5000/api/v1/auth',
                headers: {
                    code,
                },
            }).then((res) => {
                const access_token = res.data.access_token;
                setAccessToken(access_token);
                setIsLoggedIn(true);
            });
        }
    }, []);

    if (isLoggedIn) {
        return <Navigate to='/' />;
    }

    const handleClick = () => {
        window.location.href = 'http://localhost:5000/api/v1';
    };

    return (
        <div>
            <h1>Login with Dropbox</h1>
            <button onClick={handleClick}>Authorize</button>
        </div>
    );
};

export default Login;
