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

    try {
        const tokenInfo = await fetchIdToken(code);
        console.log('GoogleAuthService_snippet.js - Token info:', tokenInfo);
        
        // Store relevant user information, see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
        if (tokenInfo.email) localStorage.setItem('userEmail', tokenInfo.email);
        if (tokenInfo.name) localStorage.setItem('userName', tokenInfo.name);
        if (tokenInfo.picture) localStorage.setItem('userPicture', tokenInfo.picture);
        
    } catch (error) {
        console.error('GoogleAuthService_snippet.js - Error fetching ID token:', error);
    }

    return "Signed in successfully!";
}

async function fetchIdToken(code) {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code: code,
            client_id: window.GoogleCloudClientId,
            client_secret: window.GoogleCloudClientSecret,
            redirect_uri: window.location.origin + '/index.html',
            grant_type: 'authorization_code',
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error(`HTTP error! status: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('GoogleAuthService_snippet.js - Token data received:', tokenData);

    if (!tokenData.id_token) {
        throw new Error('No ID token found in the response');
    }

    const decodedToken = decodeJWT(tokenData.id_token);
    console.log('GoogleAuthService_snippet.js - Decoded ID token:', decodedToken);

    return decodedToken;
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}
