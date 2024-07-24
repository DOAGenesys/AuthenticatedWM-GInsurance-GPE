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
            console.log('AuthProvider_snippet.js - Retrieved authCode:', authCode);
            
            if (authCode) {
                e.resolve({
                    authCode: authCode,
                    redirectUri: window.location.origin + '/index.html',
                });
            } else {
                e.reject(new Error('Auth code not found in localStorage'));
            }
        });
    });
}
