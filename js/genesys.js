/**
* Genesys Digtal: GPE
*/

 (function (g, e, n, es, ys) {
    g['_genesysJs'] = e;
    g[e] = g[e] || function () {
      (g[e].q = g[e].q || []).push(arguments)
    };
    g[e].t = 1 * new Date();
    g[e].c = es;
    ys = document.createElement('script'); ys.async = 1; ys.src = n; ys.charset = 'utf-8'; document.head.appendChild(ys);
  })(window, 'Genesys', 'https://apps.mypurecloud.de/genesys-bootstrap/genesys.min.js', {
    environment: 'prod-euc1',
    deploymentId: 'db32d60a-f67c-4954-986e-caf4f00517a9'
  });

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  console.log('getCookie1 Start '); 
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  console.log('getCookie2 = ',ca);
  for(let i = 0; i < ca.length; i++) {
	let c = ca[i];
	console.log('getCookie3 = ',c,ca);
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
	console.log('getCookie4 = ',c,ca);
    if (c.indexOf(name) == 0) {
	        return c.substring(name.length, c.length);
			console.log('getCookie5 = ',c,ca);
    }
	console.log('getCookie6 = ',c,ca);
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

function CardSelect() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "credit_card_selection" });
}

function ClaimStage() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "claim_stage" });
}

function ClaimType() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "claim_type" });
}

function TravelClaimStage() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "travel_claim_stage" });
}

function TravelClaimType() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "travel_claim_type" });
}

function HealthCareClaimStage() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "healthcare_claim_stage" });
}

function HealthCareClaimType() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "healthcare_claim_type" });
}

function LifeClaimStage() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "life_claim_stage" });
}

function LifeClaimType() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "life_claim_type" });
}

function MotorClaimStage() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "motor_claim_stage" });
}

function MotorClaimType() {
console.log("Dropdown clicked");
Genesys("command", "Journey.record", { eventName: "motor_claim_type" });
}

function setupJourneySubscriptions() {
    // Subscribe to readiness
    Genesys("subscribe", "Journey.ready", function() {
      console.log("GPE Journey plugin is ready.")
    });

    // Subscribe to open actions
    Genesys("subscribe", "Journey.qualifiedOpenAction", function(event) {
        console.log("Received GPE qualified open action event:", event);

        if (event.data.openActionProperties.openActionName.startsWith("GPE and SF - ")) {
            console.log("Triggering Salesforce Web Messaging...");
            launchSalesforceChat();
        }
    });
}


var username='';
console.log('Email address is ',this.username);
username=getCookie("username");
console.log('Email address is ',this.username);
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

document.addEventListener('DOMContentLoaded', function(event) {
    setupJourneySubscriptions();
});
