import { auth } from './GoogleFirebaseConfig.js';
import { signInWithPopup, signOut, OAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { setAuthToken, clearAuthToken } from './GCsnippet.js';

const provider = new OAuthProvider(window.GoogleOIDCId);

export function signIn() {
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

export function signOutUser() {
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

export function initAuthStateListener(callback) {
    onAuthStateChanged(auth, callback);
}
