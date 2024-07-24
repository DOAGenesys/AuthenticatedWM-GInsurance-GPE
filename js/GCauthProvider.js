// Wait for initialization before running the script
if (window.initializationPromise) {
    window.initializationPromise.then(() => {
        initializeAuthProvider();
    }).catch(error => {
        console.error("Failed to initialize AuthProvider:", error);
    });
} else {
    console.error("Initialization promise not found. Make sure init.js is loaded first.");
}

function initializeAuthProvider() {
    Genesys('registerPlugin', 'AuthProvider', (AuthProvider) => {
        AuthProvider.registerCommand('getAuthCode', (e) => {
            const authCode = localStorage.getItem('authCode');
            console.log('AuthProvider.getAuthCode - Retrieved authCode:', authCode);
            
            e.resolve({
                authCode: authCode,
                redirectUri: window.location.origin + '/index.html',
            });
        });

        AuthProvider.registerCommand('reAuthenticate', (e) => {
            console.log('AuthProvider.reAuthenticate - Re-authenticating user.');
            // Implement re-authentication logic here
            e.resolve();
        });

        AuthProvider.subscribe('Auth.loggedOut', () => {
            console.log('AuthProvider - Logged out event received.');
        });

        AuthProvider.subscribe('Auth.authError', (error) => {
            console.error('AuthProvider - Auth error event received:', error);
        });

        AuthProvider.ready();
        console.log("AuthProvider plugin ready.");
    });
}
