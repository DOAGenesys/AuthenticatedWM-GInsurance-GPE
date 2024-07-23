module.exports = (req, res) => {
    res.json({
        GCDomain: process.env.GC_DOMAIN,
        GCEnvironment: process.env.GC_ENVIRONMENT,
        GCMessagingDeplId: process.env.GC_MESSAGING_DEPLOYMENT_ID,
        GoogleCloudClientId: process.env.GOOGLE_CLIENT_ID,
        GoogleCloudClientSecret: process.env.GOOGLE_CLIENT_SECRET
    });
};
