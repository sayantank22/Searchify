import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import './style.css';

const Home = ({ isLoggedIn, setIsLoggedIn, accessToken, setAccessToken }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            axios({
                method: 'POST',
                url: 'http://localhost:5000/api/v1/files',
                headers: {
                    access_token: accessToken,
                },
            }).then((res) => {
                if (res.data.msg === 'Files indexed successfully')
                    setIsLoading(false);
            });
        }
    }, [accessToken]);

    if (!isLoggedIn) {
        return <Navigate to='/login' />;
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .get(`http://localhost:5000/api/v1/files/${searchTerm}`)
            .then((res) => {
                setData(res.data.res);
            });
    };

    const handleLogout = () => {
        axios({
            method: 'DELETE',
            url: 'http://localhost:5000/api/v1/files',
        }).then((res) => {
            setAccessToken('');
            setIsLoggedIn(false);
        });
    };

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };
    return !isLoading ? (
        <React.Fragment>
            <div className='logout-section'>
                <button className='logout-button' onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className='search-wrapper'>
                <h1>Text Based File Search Engine</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className='search-input'
                        type='text'
                        name='search-input'
                        id='search'
                        placeholder='Search...'
                        onChange={handleChange}
                        autoComplete={'off'}
                    />
                    <input
                        className='input-submit'
                        type='submit'
                        value='Submit'
                    />
                </form>
            </div>
            <div
                className='content-wrapper'
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <div
                    className={
                        data?.length > 0 && searchTerm.length > 0
                            ? 'content'
                            : ''
                    }
                    style={{ display: !(searchTerm.length > 0) && 'none' }}
                >
                    {data &&
                        data.length > 0 &&
                        data.map((data) => (
                            <div className='dataResults'>
                                <ul key={data._source.id}>
                                    <span>
                                        <Link
                                            className='dataItem'
                                            to={'#'}
                                            onClick={() =>
                                                openInNewTab(data._source.url)
                                            }
                                        >
                                            <span>{data._source.fileName}</span>
                                        </Link>
                                    </span>
                                </ul>
                            </div>
                        ))}
                </div>
            </div>
        </React.Fragment>
    ) : (
        <h3>Loading...</h3>
    );
};

export default Home;
