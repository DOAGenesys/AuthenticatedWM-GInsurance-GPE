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
    };
    ys.onerror = function() {
        console.error("GCsnippet.js - Failed to load Genesys script.");
    };
    document.head.appendChild(ys);
})(window, 'Genesys', (window.GCDomain || '') + '/genesys-bootstrap/genesys.min.js', {
    environment: window.GCEnvironment || '',
    deploymentId: window.GCMessagingDeplId || ''
});
