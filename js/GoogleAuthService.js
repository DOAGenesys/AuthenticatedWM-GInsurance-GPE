const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

window.GoogleAuthService = {};

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

function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export async function handleAuthCallback() {
    await window.initializationPromise;  
    
    const fullUrl = window.location.href;
    console.log('GoogleAuthService_snippet.js - Full callback URL:', fullUrl);

    const url = new URL(fullUrl);
    const urlParams = new URLSearchParams(url.search);

    console.log('GoogleAuthService_snippet.js - URL Parameters from Google:');
    for (const [key, value] of urlParams) {
        console.log(`  ${key}: ${value}`);
    }

    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log('GoogleAuthService_snippet.js - Extracted Parameters:', { code, state });

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

    return "Auth code stored successfully!";
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}

window.GoogleAuthService.signIn = signIn;
window.GoogleAuthService.handleAuthCallback = handleAuthCallback;

console.log('GoogleAuthService_snippet.js - GoogleAuthService loaded, functions available:', {
    signIn: !!window.GoogleAuthService.signIn,
    handleAuthCallback: !!window.GoogleAuthService.handleAuthCallback
});
