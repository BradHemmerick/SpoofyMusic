import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import AudioControlBar from './AudioControlBar';
import PreviewUnavailableModal from './Modal';

function Dashboard({ accessToken, tracks }) {
    const [recommendations, setRecommendations] = useState([]);
    const [playingTrack, setPlayingTrack] = useState(null);
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);

    useEffect(() => {
        if (!accessToken) return;

        function fetchRecommendations() {
            const seedGenres = 'disney,anime,funk';
            fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setRecommendations(data.tracks);
                })
                .catch((error) => console.error('Error fetching recommendations:', error));
        }

        // Only fetch recommendations if no tracks are passed as props
        if (!tracks) {
            fetchRecommendations();
        }
    }, [accessToken, tracks]); // Added tracks to the dependency array

    useEffect(() => {
        if (audio) {
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            return () => {
                audio.removeEventListener('play', () => setIsPlaying(true));
                audio.removeEventListener('pause', () => setIsPlaying(false));
            };
        }
    }, [audio]);

    const playPreview = (track) => {
        if (track.preview_url) {
            if (audio) {
                audio.pause();
            }
            const newAudio = new Audio(track.preview_url);
            newAudio.volume = 0.3;
            newAudio.play();
            setAudio(newAudio);
            setPlayingTrack(track.preview_url);
            setIsPlaying(true);
        } else {
            setSelectedTrack(track);
            setIsModalOpen(true);
        }
    };

    const handleModalConfirm = () => {
        setIsModalOpen(false);
        if (selectedTrack) {
            openSpotifyUrl(selectedTrack.external_urls.spotify);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const togglePlayPause = () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    const changeVolume = (e) => {
        if (audio) {
            audio.volume = e.target.value;
        }
    };

    const openSpotifyUrl = (url) => {
        window.open(url, "_blank");
    };

    const displayTracks = tracks || recommendations;

    return (
        <div className={styles.dashboardContainer}>
            <h1>{tracks ? 'Playlist' : 'Recommended for You'}</h1>
            <div className={styles.tracksGrid}>
                {displayTracks.map((item, index) => {
                    const track = item.track ? item.track : item;
                    return (
                        <div key={index} className={styles.trackItem}>
                            {/* Your track display code */}
                            <div className={styles.playIcon} onClick={() => playPreview(track)}>
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <img src={track.album.images[0].url} alt={track.name} className={styles.trackImage} onClick={() => openSpotifyUrl(track.album.external_urls.spotify)} />
                            <div>
                                <h4 className={styles.trackName}>{track.name}</h4>
                                <p className={styles.artistName} onClick={() => openSpotifyUrl(track.artists[0].external_urls.spotify)}>
                                    {track.artists.map(artist => artist.name).join(', ')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <AudioControlBar
                audio={audio}
                onTogglePlayPause={togglePlayPause}
                onChangeVolume={changeVolume}
                isPlaying={isPlaying}
            />
            <PreviewUnavailableModal
                isOpen={isModalOpen}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </div>
    );

}

export default Dashboard;
