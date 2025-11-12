const AUTO_SIGN_IN_FLAG = '__genesysAutoSignInRequested';
const AUTO_SIGN_IN_REASON = '__genesysAutoSignInReason';
const AUTO_SIGN_IN_RETRY_DELAY_MS = 1500;
const MAX_AUTO_SIGN_IN_RETRIES = 6;

let authModuleReady = false;
let authProviderReady = false;
let deploymentConfigReady = false;
let autoSignInInProgress = false;
let autoSignInReason = window[AUTO_SIGN_IN_REASON] || '';
let autoSignInRequested = Boolean(window[AUTO_SIGN_IN_FLAG]);
let autoSignInRetryCount = 0;
let autoSignInRetryTimer = null;

if (autoSignInRequested && !autoSignInReason) {
    autoSignInReason = 'pre-init';
    window[AUTO_SIGN_IN_REASON] = autoSignInReason;
}

if (!autoSignInRequested && hasStoredAuthCode()) {
    autoSignInRequested = true;
    autoSignInReason = 'auth-code-detected';
    window[AUTO_SIGN_IN_FLAG] = true;
    window[AUTO_SIGN_IN_REASON] = autoSignInReason;
}

// Wait for initialization before running the script
if (window.initializationPromise) {
    window.initializationPromise.then(() => {
        initializeGCSnippet();
    }).catch(error => {
        console.error("Failed to initialize GCsnippet.js:", error);
    });
} else {
    console.error("Initialization promise not found. Make sure init.js is loaded first.");
}

function initializeGCSnippet() {
    (function (g, e, n, es, ys) {
        g['_genesysJs'] = e;
        g[e] = g[e] || function () {
            (g[e].q = g[e].q || []).push(arguments)
        };
        g[e].t = 1 * new Date();
        g[e].c = es;

        console.log("GCsnippet.js - Genesys Domain:", window.GCDomain || "Not set");
        console.log("GCsnippet.js - Genesys Environment:", window.GCEnvironment || "Not set");
        console.log("GCsnippet.js - Genesys Messaging Deployment ID:", window.GCMessagingDeplId || "Not set");

        ys = document.createElement('script');
        ys.async = 1;
        ys.src = n;
        ys.charset = 'utf-8';
        ys.onload = function() {
            console.log("GCsnippet.js - Genesys script loaded successfully.");
            initializeGCAdvancedSnippet();
            initializeAuthProvider();
        };
        ys.onerror = function() {
            console.error("GCsnippet.js - Failed to load Genesys script.");
        };
        document.head.appendChild(ys);
    })(window, 'Genesys', (window.GCDomain || '') + '/genesys-bootstrap/genesys.min.js', {
        environment: window.GCEnvironment || '',
        deploymentId: window.GCMessagingDeplId || ''
    });
}

function initializeGCAdvancedSnippet() {

    // GCMessenger Auth functions
    window.GCMessenger = {
        logout: function() {
            if (typeof Genesys === 'function') {
                Genesys("command", "Auth.logout");
            } else {
                console.error("GCsnippet.js - Auth.logout function is not available");
            }
        }
    };
    
    //cookies functions
    
    function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    function getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
    
    function checkCookie() {
      let user = getCookie("username");
      if (user != "") {
        console.log("Welcome again " + user);
      } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
          setCookie("username", user, 30);
        }
      }
    }
    
    //GPE functions
    
    function FormTrack() {
        console.log("GCsnippet.js - Form track");
        if (typeof Genesys === 'function') {
            Genesys("command", "Journey.formsTrack", {
                selector: "form",
                captureFormDataOnAbandon: true
            });
        } else {
            console.error("GCsnippet.js - Genesys function is not available");
        }
    }
    
    function ButtonClickTrack() {
        console.log("GCsnippet.js - Button click track");
        if (typeof Genesys === 'function') {
            Genesys("command", "Journey.trackClickEvents", {
                clickEvents: [
                    { selector: "button.btn", eventName: "button_click" }
                ]
            });
        } else {
            console.error("GCsnippet.js - Genesys function is not available");
        }
    }
    
    function IdleTrack() {
        console.log("GCsnippet.js - Idle 120 seconds track");
        if (typeof Genesys === 'function') {
            Genesys("command", "Journey.trackIdleEvents", {
                idleEvents: [{ idleAfterSeconds: 120, eventName: "user_idle_120_seconds" }]
            });
        } else {
            console.error("GCsnippet.js - Genesys function is not available");
        }
    }
    
    function CardSelect() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "credit_card_selection" });
    }
    
    function ClaimStage() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "claim_stage" });
    }
    
    function ClaimType() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "claim_type" });
    }
    
    function TravelClaimStage() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "travel_claim_stage" });
    }
    
    function TravelClaimType() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "travel_claim_type" });
    }
    
    function HealthCareClaimStage() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "healthcare_claim_stage" });
    }
    
    function HealthCareClaimType() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "healthcare_claim_type" });
    }
    
    function LifeClaimStage() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "life_claim_stage" });
    }
    
    function LifeClaimType() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "life_claim_type" });
    }
    
    function MotorClaimStage() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "motor_claim_stage" });
    }
    
    function MotorClaimType() {
        console.log("GCsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "motor_claim_type" });
    }
    
    //subscribe to GPE events
    function setupJourneySubscriptions() {
        if (typeof Genesys === 'function') {
            // Subscribe to readiness
            Genesys("subscribe", "Journey.ready", function() {
                console.log("GCsnippet.js - GPE Journey plugin is ready.");
            });
        } else {
            console.error("GCsnippet.js - Journey.ready function is not available.");
        }
    }
    
    //subscribe to Auth events
    function setupAuthSubscriptions() {
        if (typeof Genesys === 'function') {
            // Auth.ready event
            Genesys("subscribe", "Auth.ready", function() {
                console.log("GCsnippet.js - Auth plugin is ready.");
                authModuleReady = true;
                attemptAutoSignIn('Auth.ready');
            });
    
            // Auth.authenticating event
            Genesys("subscribe", "Auth.authenticating", function(event) {
                console.log("GCsnippet.js - Authenticating. Auth Code:", event.data.authCode, "Redirect URI:", event.data.redirectUri);
            });

            // Auth.authenticated event
            Genesys("subscribe", "Auth.authenticated", function(event) {
                console.log("GCsnippet.js - Authenticated. JWT received.", "Data:", event.data);
                clearStoredAuthCode('authenticated');
                setAutoSignInRequest(false);
            });
    
            // Auth.loggedOut event
            Genesys("subscribe", "Auth.loggedOut", function(event) {
                console.log("GCsnippet.js - Logged out.", "Data:", event.data);
                clearStoredAuthCode('loggedOut');
                setAutoSignInRequest(false);
            });
    
            Genesys("subscribe", "Auth.authError", function(event) {
                console.error("GCsnippet.js - Auth Error:", event.data);
                handleAuthFailure('Auth.authError');
            });
    
            Genesys("subscribe", "Auth.tokenError", function(event) {
                console.error("GCsnippet.js - Token Error:", event.data);
                handleAuthFailure('Auth.tokenError');
            });
    
            Genesys("subscribe", "Auth.authProviderError", function() {
                console.error("GCsnippet.js - Auth Provider Error");
                handleAuthFailure('Auth.authProviderError');
            });
    
            Genesys("subscribe", "Auth.error", function(event) {
                console.error("GCsnippet.js - General Auth Error:", event.data);
                handleAuthFailure('Auth.error');
            });
    
            Genesys("subscribe", "Auth.logoutError", function(event) {
                console.error("GCsnippet.js - Logout Error:", event.data);
            });
        } else {
            console.error("GCsnippet.js - Genesys function is not available for Auth subscriptions.");
        }
    }

    function setCustomAttributes() {
        const username = getCookie("username") || "";
    
        console.log('GCsnippet.js - User information:');
        console.log('  Cookie username:', username || "Not set");
        
        if (typeof Genesys === 'function') {
            Genesys("command", "Database.set", {
                messaging: {
                    customAttributes: {
                        ID: username,
                        browser_language: navigator.language || "Unknown",
                        vertical: "insurance",
                        language: "english"
                    }
                }
            });
            console.log('GCsnippet.js - Custom attributes set for Genesys');
        } else {
            console.error("GCsnippet.js - Genesys function is not available.");
        }
    }
    
    setupJourneySubscriptions();
    setupAuthSubscriptions();
    subscribeToDeploymentConfig();
    FormTrack();
    ButtonClickTrack();
    IdleTrack();
    setCustomAttributes();
}

function subscribeToDeploymentConfig() {
    if (typeof Genesys !== 'function') {
        console.warn('GCsnippet.js - Genesys function unavailable for configuration subscription.');
        return;
    }

    Genesys("subscribe", "GenesysJS.configurationReceived", function(event) {
        deploymentConfigReady = true;
        console.log('GCsnippet.js - Deployment configuration received.');
        attemptAutoSignIn('config-ready');
    });

    try {
        const cachedConfig = Genesys("data", "GenesysJS.deploymentConfig");
        if (cachedConfig) {
            deploymentConfigReady = true;
            console.log('GCsnippet.js - Deployment configuration already available.');
            attemptAutoSignIn('config-cached');
        }
    } catch (error) {
        console.warn('GCsnippet.js - Unable to read cached deployment config:', error);
    }
}

function initializeAuthProvider() {
    console.log('GCsnippet.js - Initializing AuthProvider');
    Genesys('registerPlugin', 'AuthProvider', (AuthProvider) => {
        AuthProvider.registerCommand('getAuthCode', (e) => {
            const authCode = localStorage.getItem('authCode');
            console.log('GCsnippet.js - AuthProvider - Retrieved authCode:', authCode);
            
            if (authCode) {
                e.resolve({
                    authCode: authCode,
                    redirectUri: window.location.origin + '/index.html',
                });
            } else {
                e.reject(new Error('Auth code not found in localStorage'));
            }
        });
        
        // Added signIn command for step-up authentication
        AuthProvider.registerCommand('signIn', (e) => {
            console.log('GCsnippet.js - AuthProvider.signIn command called');
            const authCode = localStorage.getItem('authCode');
            if (authCode) {
                const data = {
                    authCode: authCode,
                    redirectUri: window.location.origin + '/index.html'
                };
                AuthProvider.publish('signedIn', data);
                e.resolve(data);
            } else {
                console.warn('GCsnippet.js - AuthProvider.signIn command: No authCode found. Initiating sign in process.');
                // Trigger the Google sign in flow
                window.GoogleAuthService.signIn();
                const error = new Error('User not signed in yet, redirecting to sign in page.');
                AuthProvider.publish('signInFailed', error);
                e.reject(error);
            }
        });
        
        AuthProvider.ready();
        authProviderReady = true;
        attemptAutoSignIn('AuthProvider.ready');
    });
}

function hasStoredAuthCode() {
    try {
        return Boolean(localStorage.getItem('authCode'));
    } catch (error) {
        console.error('GCsnippet.js - Unable to read authCode from localStorage:', error);
        return false;
    }
}

function clearStoredAuthCode(context) {
    try {
        if (localStorage.getItem('authCode')) {
            localStorage.removeItem('authCode');
            console.log(`GCsnippet.js - Cleared authCode (${context}).`);
        }
    } catch (error) {
        console.error('GCsnippet.js - Unable to clear authCode:', error);
    }
}

function setAutoSignInRequest(value, reason) {
    autoSignInRequested = value;
    window[AUTO_SIGN_IN_FLAG] = value;

    if (value) {
        autoSignInReason = reason || autoSignInReason || 'auto-signin';
        window[AUTO_SIGN_IN_REASON] = autoSignInReason;
        resetAutoSignInRetryState();
    } else {
        autoSignInReason = '';
        delete window[AUTO_SIGN_IN_REASON];
        resetAutoSignInRetryState();
    }
}

function attemptAutoSignIn(origin) {
    if (!autoSignInRequested) {
        return;
    }

    if (!authModuleReady || !authProviderReady) {
        return;
    }

    if (!deploymentConfigReady) {
        console.log('GCsnippet.js - Deployment config not ready. Waiting before auto sign-in.');
        scheduleAutoSignInRetry('config-pending');
        return;
    }

    if (!hasStoredAuthCode()) {
        setAutoSignInRequest(false);
        return;
    }

    if (autoSignInInProgress) {
        return;
    }

    if (typeof Genesys !== 'function') {
        console.warn('GCsnippet.js - Genesys SDK not ready for auto sign-in yet.');
        if (autoSignInRetryCount >= MAX_AUTO_SIGN_IN_RETRIES) {
            handleAuthFailure('sdk-not-ready');
            return;
        }
        autoSignInRetryCount += 1;
        scheduleAutoSignInRetry('sdk-not-ready');
        return;
    }

    autoSignInInProgress = true;
    const reason = origin || autoSignInReason || 'auto';
    console.log(`GCsnippet.js - Triggering signIn automatically (${reason}).`);

    try {
        const commandResult = Genesys("command", "signIn");
        if (commandResult && typeof commandResult.then === 'function') {
            commandResult
                .then(() => {
                    console.log('GCsnippet.js - signIn command dispatched.');
                    autoSignInInProgress = false;
                })
                .catch(error => {
                    handleAutoSignInError(error, reason);
                });
        } else {
            console.log('GCsnippet.js - signIn command executed (fire-and-forget). Awaiting Auth events.');
            autoSignInInProgress = false;
        }
    } catch (error) {
        handleAutoSignInError(error, reason);
    }
}

function handleAuthFailure(context) {
    clearStoredAuthCode(context);
    setAutoSignInRequest(false);
}

function handleAutoSignInError(error, context) {
    const errorMessage = getErrorMessage(error);
    autoSignInInProgress = false;
    console.error(`GCsnippet.js - Auto sign-in error (${context || 'auto'}):`, errorMessage);

    if (shouldRetryAutoSignIn(error) && autoSignInRetryCount < MAX_AUTO_SIGN_IN_RETRIES) {
        autoSignInRetryCount += 1;
        scheduleAutoSignInRetry(`retry-${autoSignInRetryCount}`);
        return;
    }

    handleAuthFailure('auto-signin-error');
}

function scheduleAutoSignInRetry(reason) {
    resetAutoSignInRetryTimer();
    const delay = AUTO_SIGN_IN_RETRY_DELAY_MS * Math.max(1, autoSignInRetryCount || 1);
    console.warn(`GCsnippet.js - Auto sign-in retry scheduled in ${delay} ms (${reason}). Attempt ${autoSignInRetryCount}/${MAX_AUTO_SIGN_IN_RETRIES}.`);
    autoSignInRetryTimer = setTimeout(() => {
        autoSignInRetryTimer = null;
        attemptAutoSignIn(reason);
    }, delay);
}

function shouldRetryAutoSignIn(error) {
    if (!error) {
        return true;
    }

    const message = getErrorMessage(error).toLowerCase();
    if (!message) {
        return true;
    }

    const retryableTokens = [
        'upgrade to authenticated session must be enabled',
        'authprovider.signin command must be defined',
        'authprovider.getauthcode',
        'genesys function is not available',
        'deployment not found'
    ];

    return retryableTokens.some(token => message.includes(token));
}

function getErrorMessage(error) {
    if (!error) {
        return '';
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error.message) {
        return error.message;
    }

    if (error.statusText) {
        return error.statusText;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
}

function resetAutoSignInRetryState() {
    autoSignInRetryCount = 0;
    resetAutoSignInRetryTimer();
}

function resetAutoSignInRetryTimer() {
    if (autoSignInRetryTimer) {
        clearTimeout(autoSignInRetryTimer);
        autoSignInRetryTimer = null;
    }
}

window.triggerGenesysAutoSignIn = function(reason) {
    const details = reason || `manual-trigger-${Date.now()}`;
    setAutoSignInRequest(true, details);
    attemptAutoSignIn(details);
};
