import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { 
    getAuth, 
    signInWithRedirect, 
    getRedirectResult, 
    signOut, 
    OAuthProvider, 
    onAuthStateChanged,
    browserPopupRedirectResolver
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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
    try {
        await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
    } catch (error) {
        console.error("Error initiating sign-in:", error);
        throw new Error("Error initiating sign-in: " + error.message);
    }
}

export async function handleRedirectResult() {
    if (!auth) await initializeAuth();
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
                    if (result) {
                        const credential = OAuthProvider.credentialFromResult(result);
                        const accessToken = credential.accessToken;
                        window.GCMessenger.setAuthToken(accessToken);
                        resolve("Signed in successfully!");
                    } else {
                        resolve(null); // User is signed in but not as a result of a redirect
                    }
                } catch (error) {
                    console.error("Error handling redirect result:", error);
                    reject(new Error("Error handling redirect result: " + error.message));
                }
            } else {
                resolve(null); // User is not signed in
            }
        });
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

export function initAuthStateListener(callback) {
    if (!auth) initializeAuth();
    return onAuthStateChanged(auth, callback);
}
