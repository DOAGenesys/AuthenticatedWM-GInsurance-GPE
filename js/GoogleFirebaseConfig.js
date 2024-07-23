import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: window.GoogleCloudApiKey,
    authDomain: window.GoogleCloudAuthDomain
};

// Log the values
console.log("Firebase Config - apiKey:", firebaseConfig.apiKey);
console.log("Firebase Config - authDomain:", firebaseConfig.authDomain);

// Check if the values are undefined or empty
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.trim() === "") {
    console.error("Firebase apiKey is undefined or empty");
}

if (!firebaseConfig.authDomain || firebaseConfig.authDomain.trim() === "") {
    console.error("Firebase authDomain is undefined or empty");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
