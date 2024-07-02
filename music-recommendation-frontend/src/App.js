import React, { useState, useEffect } from 'react';
import './content/css/App.css';
// import Recommendations from './components/Recommendations';
import authHelpers from './authHelpers';
import Footer from './components/footer';
import Result from './components/result';
import Login from './components/login';


function App() {
  const [token, setToken] = useState('');
  const [data, setData] = useState('');
  const [playlistName, setPlaylistName] = useState('favs');

  useEffect(() => {
    authHelpers.checkCookie();
    let hashCode = authHelpers.getHashCode();
    let token = authHelpers.getCookie();
    if (!token && hashCode) {
      token = authHelpers.getHashCode();
    } else if (token && hashCode) {
      token = authHelpers.getHashCode();
    }
    window.location.hash = "";
    if (token) {
      setToken(token);
    }
    let data = JSON.parse(localStorage.getItem("spotiData"));
    if (data) {
      setData(data);
    }
  }, []);


  return (
    <div className="page-container">
      <div className='top'>
      <Login token={token}></Login>
      <div className="bottom"><Footer logged={token ? true : false}></Footer></div>
      </div>
      <div className="main">
        <div className='results-container'>
        {/* <Recommendations playlistName={playlistName} /> */}
          {token ? <Result token={token} data={data}></Result> : ""}
        </div>
      </div>
    </div>
  );
}

export default App;
