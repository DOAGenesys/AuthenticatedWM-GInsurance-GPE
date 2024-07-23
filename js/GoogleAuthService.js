const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export async function signIn() {
    const params = new URLSearchParams({
        client_id: window.GoogleCloudClientId,
        redirect_uri: window.location.origin + '/auth-callback',
        response_type: 'code',
        scope: 'openid email profile',
        state: generateRandomState()
    });

    window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
        // Verify state to prevent CSRF attacks
        if (state !== localStorage.getItem('oauth_state')) {
            throw new Error('Invalid state parameter');
        }

        const tokenResponse = await fetchTokens(code);
        const idToken = tokenResponse.id_token;

        // Store the authorization code and ID token for Genesys Cloud
        console.log('GoogleAuthService - Storing authCode:', code);
        localStorage.setItem('authCode', code);
        window.GCMessenger.setAuthToken(idToken);

        return "Signed in successfully!";
    } else {
        throw new Error('No code or state found in the URL');
    }
}

async function fetchTokens(code) {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: window.GoogleCloudClientId,
            client_secret: window.GoogleCloudClientSecret,
            redirect_uri: window.location.origin + '/auth-callback',
            grant_type: 'authorization_code',
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tokens');
    }

    return response.json();
}

export async function signOutUser() {
    // Clear the auth token from Genesys Cloud
    window.GCMessenger.clearAuthToken();
    // Optionally, redirect to Google's logout URL
    // window.location.href = 'https://accounts.google.com/logout';
    return "Signed out successfully!";
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}
