const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

window.GoogleAuthService = {};

export async function signIn() {
    await window.initializationPromise;  
    const state = generateRandomState();
    const nonce = generateRandomNonce(); // Nonce generation function

    const params = new URLSearchParams({
        client_id: window.GoogleCloudClientId,
        redirect_uri: window.location.origin + '/index.html',
        response_type: 'code',
        scope: 'openid email profile',
        state,
        nonce // Add nonce to the request
    });

    window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);

    // Validate nonce
    const storedNonce = localStorage.getItem('oauth_nonce');
    if (payload.nonce !== storedNonce) {
        throw new Error('Invalid nonce in ID token');
    }

    return payload;
}

export async function handleAuthCallback() {
    await window.initializationPromise;  

    const fullUrl = window.location.href;
    console.log('GoogleAuthService_snippet.js - Full callback URL:', fullUrl);

    const url = new URL(fullUrl);
    const urlParams = new URLSearchParams(url.search);

    console.log('GoogleAuthService_snippet.js - URL Parameters from Google:');
    for (const [key, value] of urlParams) {
        console.log(`${key}: ${value}`);
    }

    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log('GoogleAuthService_snippet.js - Extracted Parameters:', { code, state });

    if (!code || !state) {
        throw new Error('No code or state found in the URL');
    }

    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
        throw new Error('Invalid state parameter');
    }

    console.log('GoogleAuthService_snippet.js - Valid code and state received:', { code, state });

    // Store the authorization code for Genesys Cloud
    localStorage.setItem('authCode', code);
    console.log('GoogleAuthService_snippet.js - Storing authCode:', code);

    return "Auth code stored successfully!";
}

async function fetchToken(code) {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: window.GoogleCloudClientId,
            client_secret: window.GoogleCloudClientSecret,
            redirect_uri: window.location.origin + '/index.html',
            grant_type: 'authorization_code',
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch tokens: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    return response.json();
}

async function fetchAndProcessToken() {
    const code = localStorage.getItem('authCode');
    if (!code) {
        throw new Error('No auth code found in localStorage');
    }

    try {
        const tokenData = await fetchToken(code);
        console.log('GoogleAuthService_snippet.js - Token data received:', tokenData);

        if (!tokenData.id_token) {
            throw new Error('No ID token found in the response');
        }

        // Decode and validate ID token
        const decodedToken = decodeJWT(tokenData.id_token);
        console.log('GoogleAuthService_snippet.js - Decoded ID token:', decodedToken);

        // Store the tokens and user information securely
        localStorage.setItem('id_token', tokenData.id_token);
        if (decodedToken.email) localStorage.setItem('userEmail', decodedToken.email);
        if (decodedToken.name) localStorage.setItem('userName', decodedToken.name);
        if (decodedToken.picture) localStorage.setItem('userPicture', decodedToken.picture);

        return decodedToken;
    } catch (error) {
        console.error('GoogleAuthService_snippet.js - Error fetching or processing token:', error);
        throw error;
    }
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}

function generateRandomNonce() {
    const nonce = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_nonce', nonce);
    return nonce;
}

window.GoogleAuthService.signIn = signIn;
window.GoogleAuthService.handleAuthCallback = handleAuthCallback;
window.GoogleAuthService.fetchAndProcessToken = fetchAndProcessToken;

console.log('GoogleAuthService_snippet.js - GoogleAuthService loaded, functions available:', {
    signIn: !!window.GoogleAuthService.signIn,
    handleAuthCallback: !!window.GoogleAuthService.handleAuthCallback,
    fetchAndProcessToken: !!window.GoogleAuthService.fetchAndProcessToken
});
