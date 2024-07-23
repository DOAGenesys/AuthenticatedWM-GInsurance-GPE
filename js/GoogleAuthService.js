import { signInWithPopup, signOut, OAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { setAuthToken, clearAuthToken } from './GCsnippet.js';

let auth;

async function initializeAuth() {
    if (typeof window.GoogleCloudApiKey === 'undefined' || typeof window.GoogleCloudAuthDomain === 'undefined') {
        throw new Error('Firebase configuration is not set');
    }
    
    const { initializeApp, getAuth } = await import("https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js");
    
    const firebaseConfig = {
        apiKey: window.GoogleCloudApiKey,
        authDomain: window.GoogleCloudAuthDomain
    };

    console.log("Initializing Firebase with config:", firebaseConfig);
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

const provider = new OAuthProvider(window.GoogleOIDCId);

export async function signIn() {
    if (!auth) await initializeAuth();
    return signInWithPopup(auth, provider)
        .then((result) => {
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            setAuthToken(accessToken);
            return "Signed in successfully!";
        })
        .catch((error) => {
            console.error(error);
            throw new Error("Error signing in: " + error.message);
        });
}

export async function signOutUser() {
    if (!auth) await initializeAuth();
    return signOut(auth)
        .then(() => {
            clearAuthToken();
            return "Signed out successfully!";
        })
        .catch((error) => {
            console.error(error);
            throw new Error("Error signing out: " + error.message);
        });
}

export async function initAuthStateListener(callback) {
    if (!auth) await initializeAuth();
    onAuthStateChanged(auth, callback);
}
