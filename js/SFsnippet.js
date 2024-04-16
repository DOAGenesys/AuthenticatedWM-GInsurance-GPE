// The Salesforce web messaging snippet
function initEmbeddedMessaging() {
    console.log('SFsnippet.js - Initializing Embedded Messaging...');
    try {
        embeddedservice_bootstrap.settings.language = 'en-US';
        embeddedservice_bootstrap.settings.hideChatButtonOnLoad = true; // Hide chat button initially

        embeddedservice_bootstrap.init(
            '00Dav0000006ihV',
            'Salesforce_web_messaging', 
            'https://cxcloudsaemea-dev-ed.develop.my.site.com/ESWSalesforcewebmessagi1712838660793',
            {
                scrt2URL: 'https://cxcloudsaemea-dev-ed.develop.my.salesforce-scrt.com'
            }
        );
        console.log('SFsnippet.js - Embedded Messaging initialized successfully.');
    } catch (err) {
        console.error('SFsnippet.js - Error loading Embedded Messaging: ', err);
    }
}

function launchSalesforceChat() {
    if (typeof embeddedservice_bootstrap === 'undefined') {
        console.error("Salesforce Embedded Service is not yet initialized.");
        return;
    }

    embeddedservice_bootstrap.utilAPI.launchChat().then(() => {
        console.log("Salesforce chat launched successfully.");
    }).catch(error => {
        console.error("Failed to launch Salesforce chat:", error);
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    console.log('SFsnippet.js - DOM fully loaded and parsed.');
    var bootstrapScript = document.createElement('script');
    bootstrapScript.type = 'text/javascript';
    bootstrapScript.src = 'https://cxcloudsaemea-dev-ed.develop.my.site.com/ESWSalesforcewebmessagi1712838660793/assets/js/bootstrap.min.js';
    bootstrapScript.onload = function() {
        console.log('SFsnippet.js - Bootstrap script loaded.');
        initEmbeddedMessaging();
    };
    bootstrapScript.onerror = function() {
        console.error('SFsnippet.js - Failed to load the Bootstrap script.');
    };
    document.body.appendChild(bootstrapScript);
});

// Listen for the onEmbeddedMessagingReady event
window.addEventListener("onEmbeddedMessagingReady", () => {
    console.log("SFsnippet.js - Received the onEmbeddedMessagingReady event...");
});
