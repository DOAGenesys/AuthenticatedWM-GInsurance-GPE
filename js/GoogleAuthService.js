const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

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

    try {
        const tokenResponse = await fetchTokens(code);
        const idToken = tokenResponse.id_token;

        // Validate the ID token
        const validatedToken = await validateIdToken(idToken);

        // Store the authorization code and ID token for Genesys Cloud
        localStorage.setItem('authCode', code);
        localStorage.setItem('idToken', idToken);
        console.log('GoogleAuthService_snippet.js - Storing authCode:', code);
        console.log('GoogleAuthService_snippet.js - Storing idToken:', idToken);

        return "Signed in successfully!";
    } catch (error) {
        console.error('GoogleAuthService_snippet.js - Error during token exchange or validation:', error);
        throw new Error('Authentication failed. Please try again.');
    }
}

async function fetchTokens(code) {
    await window.initializationPromise;  
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

async function validateIdToken(idToken) {
    await window.initializationPromise;  
    // Check if jwt_decode is available
    if (typeof jwt_decode !== 'function') {
        console.error('GoogleAuthService_snippet.js - jwt_decode is not available. Make sure to include the library.');
        throw new Error('JWT decode function is not available');
    }

    const decodedToken = jwt_decode(idToken);

    // Check issuer
    if (decodedToken.iss !== 'https://accounts.google.com' && decodedToken.iss !== 'accounts.google.com') {
        throw new Error('Invalid token issuer');
    }

    // Check audience
    if (decodedToken.aud !== window.GoogleCloudClientId) {
        throw new Error('Invalid token audience');
    }

    // Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
        throw new Error('Token has expired');
    }

    // Might want to add more checks here, such as verifying the token's signature
    // However, that typically requires a backend service to fetch Google's public keys

    return decodedToken;
}

export async function signOutUser() {
    await window.initializationPromise;  
    localStorage.removeItem('authCode');
    localStorage.removeItem('idToken');
    window.GCMessenger.logout();
    return "Signed out successfully!";
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}
