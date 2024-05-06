(function (g, e, n, es, ys) {
    g['_genesysJs'] = e;
    g[e] = g[e] || function () {
        (g[e].q = g[e].q || []).push(arguments)
    };
    g[e].t = 1 * new Date();
    g[e].c = es;

    console.log("GCsnippet.js - Genesys Domain:", window.GCDomain);
    console.log("GCsnippet.js - Genesys Environment:", window.GCEnvironment);
    console.log("GCsnippet.js - Genesys Messaging Deployment ID:", window.GCMessagingDeplId);

    ys = document.createElement('script');
    ys.async = 1;
    ys.src = n; 
    ys.charset = 'utf-8';
    document.head.appendChild(ys);
})(window, 'Genesys', window.GCDomain + '/genesys-bootstrap/genesys.min.js', {
    environment: window.GCEnvironment,
    deploymentId: window.GCMessagingDeplId
});


function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  console.log('GCsnippet.js - getCookie1 Start '); 
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  console.log('GCsnippet.js - getCookie2 = ',ca);
  for(let i = 0; i < ca.length; i++) {
	let c = ca[i];
	console.log('GCsnippet.js - getCookie3 = ',c,ca);
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
	console.log('GCsnippet.js - getCookie4 = ',c,ca);
    if (c.indexOf(name) == 0) {
	        return c.substring(name.length, c.length);
			console.log('GCsnippet.js - getCookie5 = ',c,ca);
    }
	console.log('GCsnippet.js - getCookie6 = ',c,ca);
  }
  return "";
  
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
     user = prompt("Please enter your name:","");
     if (user != "" && user != null) {
       setCookie("username", user, 30);
     }
  }
}

function FormTrack() {
    console.log("GCsnippet.js - Form track");
    Genesys("command", "Journey.formsTrack", {
        selector: "form",
        captureFormDataOnAbandon: true
    });
}

function ButtonClickTrack() {
    console.log("GCsnippet.js - Button click track");
    Genesys("command", "Journey.trackClickEvents", {
        clickEvents: [
            { selector: "button.btn", eventName: "button_click" }
        ]
    });
}

function IdleTrack() {
    console.log("GCsnippet.js - Idle 120 seconds track");
    Genesys("command", "Journey.trackIdleEvents", {
        idleEvents: [{ idleAfterSeconds: 120, eventName: "user_idle_120_seconds" }]
    });
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

function setupJourneySubscriptions() {
    // Subscribe to readiness
    Genesys("subscribe", "Journey.ready", function() {
      console.log("GCsnippet.js - GPE Journey plugin is ready.")
    });

    // Subscribe to open actions
    Genesys("subscribe", "Journey.qualifiedOpenAction", function(event) {
        console.log("GCsnippet.js - Received GPE qualified open action event:", event);

        if (event.data.openActionProperties.openActionName.startsWith("GPE and SF - ")) {
            console.log("GCsnippet.js - Triggering Salesforce Web Messaging...");
            launchSalesforceChat();
        }
    });
}

console.log('GCsnippet.js - Customer email address is ', window.customerEmail);
username=getCookie("username");
console.log('GCsnippet.js - Cookie customer email address is ',this.username);
Genesys("command", "Database.set", {
    messaging: {
        customAttributes: {
                ID: username,
                browser_language: navigator.language,
                vertical: "insurance",
		language: "english"
               }
         }
  });

setupJourneySubscriptions();
FormTrack();
ButtonClickTrack();
IdleTrack();
