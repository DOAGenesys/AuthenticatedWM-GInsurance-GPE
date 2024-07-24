// Wait for initialization before running the script
if (window.initializationPromise) {
    window.initializationPromise.then(() => {
        initializeGCAdvancedSnippet();
    }).catch(error => {
        console.error("Failed to initialize GCadvancedSnippet:", error);
    });
} else {
    console.error("Initialization promise not found. Make sure init.js is loaded first.");
}

function initializeGCAdvancedSnippet() {    
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
        console.log("GCadvancedsnippet.js - Form track");
        if (typeof Genesys === 'function') {
            Genesys("command", "Journey.formsTrack", {
                selector: "form",
                captureFormDataOnAbandon: true
            });
        } else {
            console.error("GCadvancedsnippet.js - Genesys function is not available");
        }
    }
    
    function ButtonClickTrack() {
        console.log("GCadvancedsnippet.js - Button click track");
        if (typeof Genesys === 'function') {
            Genesys("command", "Journey.trackClickEvents", {
                clickEvents: [
                    { selector: "button.btn", eventName: "button_click" }
                ]
            });
        } else {
            console.error("GCadvancedsnippet.js - Genesys function is not available");
        }
    }
    
    function IdleTrack() {
        console.log("GCadvancedsnippet.js - Idle 120 seconds track");
        if (typeof Genesys === 'function') {
            Genesys("command", "Journey.trackIdleEvents", {
                idleEvents: [{ idleAfterSeconds: 120, eventName: "user_idle_120_seconds" }]
            });
        } else {
            console.error("GCadvancedsnippet.js - Genesys function is not available");
        }
    }
    
    function CardSelect() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "credit_card_selection" });
    }
    
    function ClaimStage() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "claim_stage" });
    }
    
    function ClaimType() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "claim_type" });
    }
    
    function TravelClaimStage() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "travel_claim_stage" });
    }
    
    function TravelClaimType() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "travel_claim_type" });
    }
    
    function HealthCareClaimStage() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "healthcare_claim_stage" });
    }
    
    function HealthCareClaimType() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "healthcare_claim_type" });
    }
    
    function LifeClaimStage() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "life_claim_stage" });
    }
    
    function LifeClaimType() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "life_claim_type" });
    }
    
    function MotorClaimStage() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "motor_claim_stage" });
    }
    
    function MotorClaimType() {
        console.log("GCadvancedsnippet.js - Dropdown clicked");
        Genesys("command", "Journey.record", { eventName: "motor_claim_type" });
    }
    
    //subscribe to GPE events
    function setupJourneySubscriptions() {
        if (typeof Genesys === 'function') {
            // Subscribe to readiness
            Genesys("subscribe", "Journey.ready", function() {
                console.log("GCadvancedsnippet.js - GPE Journey plugin is ready.");
            });
    
            // Subscribe to open actions
            Genesys("subscribe", "Journey.qualifiedOpenAction", function(event) {
                console.log("GCadvancedsnippet.js - Received GPE qualified open action event:", event);
    
                if (event.data.openActionProperties.openActionName.startsWith("GPE and SF - ")) {
                    console.log("GCadvancedsnippet.js - Triggering Salesforce Web Messaging...");
                    launchSalesforceChat();
                }
            });
        } else {
            console.error("GCadvancedsnippet.js - Genesys function is not available.");
        }
    }
    
    //subscribe to Auth events
    function setupAuthSubscriptions() {
        if (typeof Genesys === 'function') {
            // Auth.ready event
            Genesys("subscribe", "Auth.ready", function() {
                console.log("GCadvancedsnippet.js - Auth plugin is ready.");
            });
    
            // Auth.authenticating event
            Genesys("subscribe", "Auth.authenticating", function(event) {
                console.log("GCadvancedsnippet.js - Authenticating. Auth Code:", event.data.authCode, "Redirect URI:", event.data.redirectUri);
            });
    
            // Auth.authenticated event
            Genesys("subscribe", "Auth.authenticated", function(event) {
                console.log("GCadvancedsnippet.js - Authenticated. JWT received.", "Refresh Token available:", !!event.data.refreshToken);
            });
    
            // Auth.loggedOut event
            Genesys("subscribe", "Auth.loggedOut", function(event) {
                console.log("GCadvancedsnippet.js - Logged out.", "Status:", event.data.status, "Status Text:", event.data.statusText);
            });
    
            Genesys("subscribe", "Auth.authError", function(event) {
                console.error("GCadvancedsnippet.js - Auth Error:", event.data);
            });
    
            Genesys("subscribe", "Auth.tokenError", function(event) {
                console.error("GCadvancedsnippet.js - Token Error:", event.data);
            });
    
            Genesys("subscribe", "Auth.authProviderError", function() {
                console.error("GCadvancedsnippet.js - Auth Provider Error");
            });
    
            Genesys("subscribe", "Auth.error", function(event) {
                console.error("GCadvancedsnippet.js - General Auth Error:", event.data);
            });
    
            Genesys("subscribe", "Auth.logoutError", function(event) {
                console.error("GCadvancedsnippet.js - Logout Error:", event.data);
            });
        } else {
            console.error("GCadvancedsnippet.js - Genesys function is not available for Auth subscriptions.");
        }
    }
    
    console.log('GCadvancedsnippet.js - Customer email address is ', window.customerEmail || "Not set");
    let username = getCookie("username") || "";
    console.log('GCadvancedsnippet.js - Cookie customer email address is ', username);
    
    if (typeof Genesys === 'function') {
        Genesys("command", "Database.set", {
            messaging: {
                customAttributes: {
                    ID: username || "Unknown",
                    browser_language: navigator.language || "Unknown",
                    vertical: "insurance",
                    language: "english"
                }
            }
        });
    } else {
        console.error("GCadvancedsnippet.js - Genesys function is not available.");
    }
    
    setupJourneySubscriptions();
    setupAuthSubscriptions();
    FormTrack();
    ButtonClickTrack();
    IdleTrack();
}
