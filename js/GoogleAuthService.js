const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export async function signIn() {
    await window.initializationPromise;  
    const params = new URLSearchParams({
        client_id: window.GoogleCloudClientId,
        redirect_uri: window.location.origin + '/index.html',
        response_type: 'code',
        scope: 'openid email profile',
        state: generateRandomState()
    });

    window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function handleAuthCallback() {
    await window.initializationPromise;  
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log('GoogleAuthService_snippet.js - URL Parameters:', { code, state });

    if (!code || !state) {
        throw new Error('No code or state found in the URL');
    }

    if (state !== localStorage.getItem('oauth_state')) {
        throw new Error('Invalid state parameter');
    }

    console.log('GoogleAuthService_snippet.js - Valid code and state received:', { code, state });

    // Store the authorization code for Genesys Cloud
    localStorage.setItem('authCode', code);
    console.log('GoogleAuthService_snippet.js - Storing authCode:', code);

    return "Signed in successfully!";
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}
