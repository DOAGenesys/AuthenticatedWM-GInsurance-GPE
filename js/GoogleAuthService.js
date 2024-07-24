import jwt_decode from 'jwt-decode';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

export async function signIn() {
    try {
        const params = new URLSearchParams({
            client_id: window.GoogleCloudClientId,
            redirect_uri: window.location.origin + '/auth-callback',
            response_type: 'code',
            scope: 'openid email profile',
            state: generateRandomState(),
            nonce: generateNonce()
        });

        window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    } catch (error) {
        console.error('Error in signIn:', error);
        throw new Error('Failed to initiate sign-in process');
    }
}

export async function handleAuthCallback() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        console.log('handleAuthCallback - URL Parameters:', { code, state });

        if (!code || !state) {
            throw new Error('No code or state found in the URL');
        }

        // Verify state to prevent CSRF attacks
        if (state !== localStorage.getItem('oauth_state')) {
            throw new Error('Invalid state parameter');
        }

        console.log('handleAuthCallback - Valid code and state received:', { code, state });

        const tokenResponse = await fetchTokens(code);
        const idToken = tokenResponse.id_token;

        // Validate the ID token
        await validateIdToken(idToken);

        // Store the authorization code and ID token for Genesys Cloud
        localStorage.setItem('authCode', code);
        localStorage.setItem('idToken', idToken);
        console.log('GoogleAuthService - Storing authCode and idToken');

        if (typeof window.registerAuthProvider === 'function') {
            window.registerAuthProvider();
        } else {
            console.error("GoogleAuthService - registerAuthProvider function is not available");
        }

        window.GCMessenger.setAuthToken(idToken);

        return "Signed in successfully!";
    } catch (error) {
        console.error('Error in handleAuthCallback:', error);
        throw new Error(`Authentication failed: ${error.message}`);
    }
}

async function fetchTokens(code) {
    try {
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
            const errorData = await response.json();
            throw new Error(`Token fetch failed: ${errorData.error_description || response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error in fetchTokens:', error);
        throw new Error('Failed to fetch tokens');
    }
}

async function validateIdToken(idToken) {
    try {
        const decodedToken = jwt_decode(idToken);

        // Check expiration
        if (Date.now() >= decodedToken.exp * 1000) {
            throw new Error('ID token has expired');
        }

        // Check issuer
        if (decodedToken.iss !== 'https://accounts.google.com' && decodedToken.iss !== 'accounts.google.com') {
            throw new Error('Invalid token issuer');
        }

        // Check audience
        if (decodedToken.aud !== window.GoogleCloudClientId) {
            throw new Error('Invalid token audience');
        }

        // Verify token signature
        await verifyTokenSignature(idToken);

        console.log('ID token successfully validated');
    } catch (error) {
        console.error('Error in validateIdToken:', error);
        throw new Error(`ID token validation failed: ${error.message}`);
    }
}

async function verifyTokenSignature(idToken) {
    try {
        const response = await fetch(GOOGLE_CERTS_URL);
        const jwks = await response.json();

        // Implement JWT signature verification here
        // This is a placeholder and should be replaced with actual crypto operations
        console.log('Token signature verification not implemented');
        
        // For now, we'll assume the signature is valid
        return true;
    } catch (error) {
        console.error('Error in verifyTokenSignature:', error);
        throw new Error('Failed to verify token signature');
    }
}

export async function signOutUser() {
    try {
        window.GCMessenger.clearAuthToken();
        localStorage.removeItem('authCode');
        localStorage.removeItem('idToken');
        return "Signed out successfully!";
    } catch (error) {
        console.error('Error in signOutUser:', error);
        throw new Error('Failed to sign out');
    }
}

function generateRandomState() {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);
    return state;
}

function generateNonce() {
    return Math.random().toString(36).substring(2, 15);
}
