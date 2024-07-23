import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithPopup, signOut, OAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

let auth;

async function initializeAuth() {
    if (typeof window.GoogleCloudApiKey === 'undefined' || typeof window.GoogleCloudAuthDomain === 'undefined') {
        throw new Error('Firebase configuration is not set');
    }
    
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
            window.GCMessenger.setAuthToken(accessToken);
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
            window.GCMessenger.clearAuthToken();
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
