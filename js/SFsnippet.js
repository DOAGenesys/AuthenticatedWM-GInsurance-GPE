function initEmbeddedMessaging() {
    console.log('SFsnippet.js - Initializing Embedded Messaging...');
    try {
        embeddedservice_bootstrap.settings.language = 'en-US';
        embeddedservice_bootstrap.settings.hideChatButtonOnLoad = true; 

        embeddedservice_bootstrap.init(
            window.SFOrgId,
            window.SFWMName,
            window.SFWMURL,
            {
                scrt2URL: window.SFWMURL.replace('develop.my.site.com', 'develop.my.salesforce-scrt.com') 
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

var bootstrapScript = document.createElement('script');
bootstrapScript.type = 'text/javascript';
bootstrapScript.src = window.SFWMURL + '/assets/js/bootstrap.min.js';
bootstrapScript.onload = function() {
    console.log('SFsnippet.js - Bootstrap script loaded.');
    initEmbeddedMessaging();
};
bootstrapScript.onerror = function() {
    console.error('SFsnippet.js - Failed to load the Bootstrap script.');
};
document.body.appendChild(bootstrapScript);

window.addEventListener("onEmbeddedMessagingReady", () => {
    console.log("SFsnippet.js - Received the onEmbeddedMessagingReady event...");
});
