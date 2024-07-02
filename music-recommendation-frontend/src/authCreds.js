const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomString = () => {
    let text = "";
    for (var i = 0; i <= 16; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

const isLocalhost = window.location.hostname === 'localhost';

const redirectUri = isLocalhost
  ? 'http://localhost:8881/callback/'
  : 'https://shrad059.github.io/Spotify_recommendation_system/callback/';

const authCreds = {
    client_id: '2e3991f3876640a993a7599c64474248',
    redirect_uri: redirectUri,
    auth_endpoint: 'https://accounts.spotify.com/authorize',
    response_type: 'token',
    state: generateRandomString(),
    scope: 'user-library-read',
};

export default authCreds;
