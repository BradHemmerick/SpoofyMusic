import React from 'react';
import styles from './AudioControlBar.module.css'; 

function AudioControlBar({ audio, onTogglePlayPause, onChangeVolume, isPlaying }) {
    if (!audio) return null;
    return (
        <div className={styles.audioControlBar}>
            <button onClick={onTogglePlayPause} className={styles.playPauseButton}>
                {isPlaying ? (
                    <span className={styles.icon}>⏸️</span>
                ) : (
                    <span className={styles.icon}>▶️</span>
                )}
            </button>
            <div className={styles.volumeControl}>
                <span className={styles.volumeIcon}>🔊</span> 
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={onChangeVolume}
                    defaultValue="0.3"
                    className={styles.volumeSlider}
                />
            </div>
        </div>
    );
}

export default AudioControlBar;
