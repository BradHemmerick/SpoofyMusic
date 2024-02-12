import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import styles from './SideNav.module.css';
import spoofyImage from '../spoofy.png';

function SideNav({ accessToken, onPlaylistSelect, onSpoofyImageClick, updateSearchResults  }) {
    const [playlists, setPlaylists] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchPlaylists = async () => {
            const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setPlaylists(data.items);
        };

        fetchPlaylists();
    }, [accessToken]);

    const searchSpotify = debounce((query) => {
        if (!query.trim()) {
            updateSearchResults([]);
            return;
        }

        fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            updateSearchResults(data.tracks.items);
        })
        .catch(error => console.error('Error searching Spotify:', error));
    }, 500);

    const handleSearchChange = (event) => {
        searchSpotify(event.target.value);
    };

    return (
        <nav className={styles.sideNav}>
            <img src={spoofyImage} alt="Spoofy" style={{ width: '100px', height: '100px', marginBottom: '20px' }} onClick={onSpoofyImageClick} />
            <input
                type="text"
                placeholder="Search Songs..."
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            <ul className={styles.navList}>
                {searchResults.length > 0 ? (
                    searchResults.map((track) => (
                        <li key={track.id} className={styles.navItem}>
                            {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                        </li>
                    ))
                ) : (
                    playlists.map((playlist) => (
                        <li key={playlist.id} className={styles.navItem} onClick={() => onPlaylistSelect(playlist.id)}>
                            <span className={styles.icon}>🎶</span>
                            <span className={styles.title}>{playlist.name}</span>
                        </li>
                    ))
                )}
            </ul>
        </nav>
    );
}

export default SideNav;
