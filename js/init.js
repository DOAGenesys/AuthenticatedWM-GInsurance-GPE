import { signIn, signOutUser, handleAuthCallback } from './GoogleAuthService.js';

async function getConfig() {
    console.log("Attempting to fetch configuration...");
    try {
        const response = await fetch('/api/getConfig');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        return config;
    } catch (error) {
        console.error("Error fetching config:", error);
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
        console.log("Start function initiated.");
        const config = await getConfig();
        setWindowConfig(config);
        
        console.log("Configuration set. Verifying...");
        
        if (!window.GoogleCloudClientId) {
            throw new Error("Google Cloud Client Id is not set");
        }
        if (!window.GoogleCloudClientSecret) {
            throw new Error("Google Cloud Client Secret is not set");
        }
        
        console.log("Google Cloud configuration verified.");

        console.log("GCDomain:", config.GCDomain);
        console.log("GCEnvironment:", config.GCEnvironment);
        console.log("GCMessagingDeplId:", config.GCMessagingDeplId);

        if (!config.GCDomain || !config.GCEnvironment || !config.GCMessagingDeplId) {
            throw new Error("GC configuration is incomplete");
        }
        console.log("GC configuration verified.");
        
        console.log("Initializing auth...");
        initializeAuth();
        console.log("Auth initialized");

        // Check if this is an auth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        console.log('Auth callback URL Parameters:', { code, state });

        if (code && state) {
            console.log("Auth callback detected. Processing...");
            try {
                const message = await handleAuthCallback();
                console.log("Auth callback processed:", message);
                // Update UI to reflect signed-in state
                updateAuthUI(true);
                // Remove the query parameters from the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error("Auth callback error:", error);
                console.error("Authentication failed:", error.message);
            }
        }
        console.log("Start function completed successfully.");
    } catch (error) {
        console.error("Error in start function:", error);
        console.error("An error occurred during initialization:", error.message);
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

function initializeAuth() {
    console.log("Initializing auth...");
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (loginButton) {
        console.log("Login button found. Adding event listener.");
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                console.log("Login button clicked. Initiating sign in...");
                await signIn();
            } catch (error) {
                console.error("Login failed:", error.message);
            }
        });
    } else {
        console.warn("Login button not found in the DOM.");
    }

    if (logoutButton) {
        console.log("Logout button found. Adding event listener.");
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                console.log("Logout button clicked. Initiating sign out...");
                await signOutUser();
                updateAuthUI(false);
            } catch (error) {
                console.error("Logout failed:", error.message);
            }
        });
    } else {
        console.warn("Logout button not found in the DOM.");
    }

    console.log("Checking initial auth state...");
    checkAuthState();
}

function checkAuthState() {
    console.log("Checking auth state...");
    const token = localStorage.getItem('authToken');
    console.log("Auth token found:", !!token);
    updateAuthUI(!!token);
}

function updateAuthUI(isAuthenticated) {
    console.log("Updating auth UI. Authenticated:", isAuthenticated);
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
    console.log("Auth UI updated.");
}

console.log("Script loaded. Starting initialization...");
start().catch(error => {
    console.error("Failed to complete start function:", error);
});
