import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SideNav from './components/SideNav';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState(window.localStorage.getItem('spotifyAccessToken'));
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [displayContent, setDisplayContent] = useState('recommendations'); // Controls what content to display

  useEffect(() => {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
      if (item) {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

    let localAccessToken = window.localStorage.getItem('spotifyAccessToken');
    let expirationTime = window.localStorage.getItem('spotifyTokenExpirationTime');
    const now = new Date().getTime();
    if (!accessToken || now > Number(expirationTime)) {
      window.localStorage.removeItem('spotifyAccessToken');
      window.localStorage.removeItem('spotifyTokenExpirationTime');
      setAccessToken(null);
    }
    if (hash.access_token || now > Number(expirationTime)) {
      if (hash.access_token) {
        localAccessToken = hash.access_token;
        expirationTime = now + Number(hash.expires_in) * 1000;
        window.localStorage.setItem('spotifyAccessToken', localAccessToken);
        window.localStorage.setItem('spotifyTokenExpirationTime', expirationTime.toString());
        window.location.hash = '';
        setAccessToken(localAccessToken);
      } else {
        window.localStorage.removeItem('spotifyAccessToken');
        window.localStorage.removeItem('spotifyTokenExpirationTime');
        setAccessToken(null);
      }
    } else {
      setAccessToken(localAccessToken);
    }
  }, []);

  const handleSpoofyImageClick = () => {
    setDisplayContent('recommendations');
    setSelectedPlaylist(null);
    setSearchResults([]);
    setPlaylistTracks([]);
  };

  const updateSearchResults = (results) => {
    setSearchResults(results);
    setDisplayContent('searchResults');
    setSelectedPlaylist(null);
  };

  const handlePlaylistSelection = (playlistId) => {
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setPlaylistTracks(data.items);
        setSelectedPlaylist(playlistId);
        setDisplayContent('playlistTracks');
      })
      .catch(error => console.error('Error fetching playlist tracks:', error));
  };

  let tracksToShow;
  switch (displayContent) {
    case 'searchResults':
      tracksToShow = searchResults;
      break;
    case 'playlistTracks':
      tracksToShow = playlistTracks;
      break;
    default:
      tracksToShow = null;
  }

  return (
    <div className="App">
      {!accessToken ? (
        <Login />
      ) : (
        <>
          <SideNav
            accessToken={accessToken}
            onPlaylistSelect={handlePlaylistSelection}
            onSpoofyImageClick={handleSpoofyImageClick}
            updateSearchResults={updateSearchResults}
          />
          <div className="content">
            <Dashboard
              accessToken={accessToken}
              tracks={tracksToShow}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
