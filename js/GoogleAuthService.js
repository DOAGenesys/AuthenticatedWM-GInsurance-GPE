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
    const email = urlParams.get('email') || urlParams.get('mail');

    console.log('GoogleAuthService_snippet.js - Extracted Parameters:', { code, state, email });

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

    // Store the email if it's available
    if (email) {
        localStorage.setItem('userEmail', email);
        console.log('GoogleAuthService_snippet.js - Storing userEmail:', email);
    } else {
        console.log('GoogleAuthService_snippet.js - No email found in URL parameters');
    }

    return "Signed in successfully!";
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}
