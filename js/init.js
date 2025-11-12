import { signIn, handleAuthCallback } from './GoogleAuthService.js';

// Track auto sign-in state for Genesys messenger handoff
if (typeof window.__genesysAutoSignInRequested === 'undefined') {
    window.__genesysAutoSignInRequested = false;
}

// Create a global promise for initialization
window.initializationPromise = new Promise(async (resolve, reject) => {
    try {
        console.log("init_snippet.js - Initialization started.");
        const config = await getConfig();
        setWindowConfig(config);
        
        console.log("init_snippet.js - Configuration set. Verifying...");
        
        if (!window.GoogleCloudClientId || !window.GoogleCloudClientSecret) {
            throw new Error("Google Cloud configuration is incomplete");
        }
        
        console.log("init_snippet.js - Google Cloud configuration verified.");

        if (!config.GCDomain || !config.GCEnvironment || !config.GCMessagingDeplId) {
            throw new Error("GC configuration is incomplete");
        }
        console.log("init_snippet.js - GC configuration verified.");

        console.log("init_snippet.js - Initialization completed successfully.");
        resolve();
    } catch (error) {
        console.error("init_snippet.js - Initialization failed:", error);
        reject(error);
    }
});

async function getConfig() {
    console.log("init_snippet.js - Attempting to fetch configuration...");
    try {
        const response = await fetch('/api/getConfig');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        return config;
    } catch (error) {
        console.error("init_snippet.js - Error fetching config:", error);
        throw error;
    }
}

function setWindowConfig(config) {
    Object.keys(config).forEach(key => {
        window[key] = config[key];
    });
}

async function start() {
    try {
        console.log("init_snippet.js - Start function initiated.");
        
        console.log("init_snippet.js - Initializing auth...");
        initializeAuth();
        console.log("init_snippet.js - Auth initialized");

        // Check if this is an auth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        console.log('Auth callback URL Parameters:', { code, state });

        if (code && state) {
            console.log("init_snippet.js - Auth callback detected. Processing...");
            try {
                const message = await handleAuthCallback();
                console.log("init_snippet.js - Auth callback processed:", message);
                // Update UI to reflect signed-in state
                updateAuthUI(true);
                // Trigger Genesys auto sign-in so that the widget is updated immediately.
                requestGenesysAutoSignIn('Google auth callback processed');
                // Remove the query parameters from the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error("init_snippet.js - Auth callback error:", error);
                console.error("init_snippet.js - Authentication failed:", error.message);
            }
        }
        console.log("init_snippet.js - Start function completed successfully.");
    } catch (error) {
        console.error("init_snippet.js - Error in start function:", error);
        console.error("init_snippet.js - An error occurred during initialization:", error.message);
    } finally {
        hideSpinner();
    }
}

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('show');
    }
}

function requestGenesysAutoSignIn(reason) {
    const details = reason || `Auto sign-in requested at ${new Date().toISOString()}`;
    window.__genesysAutoSignInRequested = true;
    window.__genesysAutoSignInReason = details;

    if (typeof window.triggerGenesysAutoSignIn === 'function') {
        console.log("init_snippet.js - Triggering Genesys auto sign-in:", details);
        window.triggerGenesysAutoSignIn(details);
    } else {
        console.log("init_snippet.js - Genesys auto sign-in queued until SDK is ready:", details);
    }
}

function clearGenesysAutoSignInRequest() {
    window.__genesysAutoSignInRequested = false;
    delete window.__genesysAutoSignInReason;
}

function initializeAuth() {
    console.log("init_snippet.js - Initializing auth...");
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (loginButton) {
        console.log("init_snippet.js - Login button found. Adding event listener.");
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                console.log("init_snippet.js - Login button clicked. Initiating sign in...");
                await signIn();
            } catch (error) {
                console.error("init_snippet.js - Login failed:", error.message);
            }
        });
    } else {
        console.warn("Login button not found in the DOM.");
    }

    if (logoutButton) {
        console.log("init_snippet.js - Logout button found. Adding event listener.");
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                console.log("init_snippet.js - Logout button clicked. Initiating sign out...");
                if (window.GCMessenger && typeof window.GCMessenger.logout === 'function') {
                    await window.GCMessenger.logout();
                } else {
                    console.error("init_snippet.js - GCMessenger logout function not available");
                }
                // Clear local storage
                localStorage.removeItem('authCode');
                clearGenesysAutoSignInRequest();
                updateAuthUI(false);
            } catch (error) {
                console.error("init_snippet.js - Logout failed:", error.message);
            }
        });
    } else {
        console.warn("Logout button not found in the DOM.");
    }

    console.log("init_snippet.js - Checking initial auth state...");
    checkAuthState();
}

function checkAuthState() {
    console.log("init_snippet.js - Checking auth state...");
    const authCode = localStorage.getItem('authCode');
    console.log("init_snippet.js - Auth code found:", !!authCode);
    updateAuthUI(!!authCode);
}

function updateAuthUI(isAuthenticated) {
    console.log("init_snippet.js - Updating auth UI. Authenticated:", isAuthenticated);
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const userInfo = document.getElementById('userInfo');

    if (isAuthenticated) {
        if (loginButton) loginButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
        if (userInfo) userInfo.style.display = 'block';
    } else {
        if (loginButton) loginButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }
    console.log("init_snippet.js - Auth UI updated.");
}

// Wait for initialization to complete before starting the application
window.initializationPromise.then(() => {
    console.log("init_snippet.js - Initialization promise resolved. Starting application...");
    start();
}).catch(error => {
    console.error("init_snippet.js - Failed to initialize:", error);
});
