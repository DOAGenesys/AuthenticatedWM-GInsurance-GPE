import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "<googleCloudApiKey>",
    authDomain: "gcopenidauth.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
