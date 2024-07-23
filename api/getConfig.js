module.exports = (req, res) => {
    res.json({
        GCDomain: process.env.GC_DOMAIN,
        GCEnvironment: process.env.GC_ENVIRONMENT,
        GCMessagingDeplId: process.env.GC_MESSAGING_DEPLOYMENT_ID,
        GoogleCloudApiKey: process.env.GOOGLE_API_KEY,
        GoogleCloudAuthDomain: process.env.GOOGLE_AUTH_DOMAIN,
        customerEmail: process.env.CUSTOMER_EMAIL
    });
};
