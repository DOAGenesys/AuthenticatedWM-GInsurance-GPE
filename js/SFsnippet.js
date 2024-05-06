function initEmbeddedMessaging() {
    console.log('SFsnippet.js - Initializing Embedded Messaging...');
    try {
        embeddedservice_bootstrap.settings.language = 'en-US';
        embeddedservice_bootstrap.settings.hideChatButtonOnLoad = true;

        var baseDomainURL = new URL(window.SFWMURL);
        var calculatedScrt2URL = baseDomainURL.origin.replace('develop.my.site.com', 'develop.my.salesforce-scrt.com');

        console.log("SFsnippet.js - Salesforce Org ID:", window.SFOrgId);
        console.log("SFsnippet.js - Salesforce Web Messaging Name:", window.SFWMName);
        console.log("SFsnippet.js - Salesforce Web Messaging URL:", window.SFWMURL);
        console.log("SFsnippet.js - Calculated scrt2URL:", calculatedScrt2URL);

        embeddedservice_bootstrap.init(
            window.SFOrgId,
            window.SFWMName,
            window.SFWMURL,
            { scrt2URL: calculatedScrt2URL }
        );
        console.log('SFsnippet.js - Embedded Messaging initialized successfully.');
    } catch (err) {
        console.error('SFsnippet.js - Error loading Embedded Messaging:', err);
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

console.log("SFsnippet.js - Bootstrap script source URL:", bootstrapScript.src);

bootstrapScript.onload = function() {
    console.log('SFsnippet.js - Bootstrap script loaded.');
    initEmbeddedMessaging();
};
bootstrapScript.onerror = function() {
    console.error('SFsnippet.js - Failed to load the Bootstrap script.');
};
document.body.appendChild(bootstrapScript);

// Listen for the onEmbeddedMessagingReady event
window.addEventListener("onEmbeddedMessagingReady", () => {
    console.log("SFsnippet.js - Received the onEmbeddedMessagingReady event...");
});
