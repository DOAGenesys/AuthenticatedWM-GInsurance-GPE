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

//GPE & WM standard snippet

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
    
    //GPE standard events
    
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

    //GPE custom events
    
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
            });
    
            // Auth.authenticating event
            Genesys("subscribe", "Auth.authenticating", function(event) {
                console.log("GCsnippet.js - Authenticating. Auth Code:", event.data.authCode, "Redirect URI:", event.data.redirectUri);
            });

            // Auth.authenticated event
            Genesys("subscribe", "Auth.authenticated", function(event) {
                console.log("GCsnippet.js - Authenticated. JWT received.", "Data:", event.data);
            });
    
            // Auth.loggedOut event
            Genesys("subscribe", "Auth.loggedOut", function(event) {
                console.log("GCsnippet.js - Logged out.", "Data:", event.data);
            });
    
            Genesys("subscribe", "Auth.authError", function(event) {
                console.error("GCsnippet.js - Auth Error:", event.data);
            });
    
            Genesys("subscribe", "Auth.tokenError", function(event) {
                console.error("GCsnippet.js - Token Error:", event.data);
            });
    
            Genesys("subscribe", "Auth.authProviderError", function() {
                console.error("GCsnippet.js - Auth Provider Error");
            });
    
            Genesys("subscribe", "Auth.error", function(event) {
                console.error("GCsnippet.js - General Auth Error:", event.data);
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
    FormTrack();
    ButtonClickTrack();
    IdleTrack();
    setCustomAttributes();
}

//required for authenticated web messaging (https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/authenticatedMessenger)

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
        AuthProvider.ready();
    });
}
