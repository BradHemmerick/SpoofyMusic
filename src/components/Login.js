import React from 'react';
import styles from './Login.module.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
];
const SCOPES_URL_PARAM = SCOPES.join('%20');
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&show_dialog=true`;

function Login() {
    return (
      <div className={styles.loginContainer}>
        <h1 className={styles.header}>Welcome to Spoofy</h1>
        <p className={styles.description}>
          Discover music, podcasts, and much more with your Spotify account. Login to get started!
        </p>
        <a href={AUTH_URL} className={styles.loginButton}>Login With Spotify</a>
      </div>
    );
}

export default Login;
