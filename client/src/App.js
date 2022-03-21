import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState('');

    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route
                        path='/login'
                        element={
                            <Login
                                isLoggedIn={isLoggedIn}
                                setIsLoggedIn={setIsLoggedIn}
                                accessToken={accessToken}
                                setAccessToken={setAccessToken}
                            />
                        }
                    />
                    <Route
                        path='/'
                        element={
                            <Home
                                isLoggedIn={isLoggedIn}
                                setIsLoggedIn={setIsLoggedIn}
                                accessToken={accessToken}
                                setAccessToken={setAccessToken}
                            />
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
