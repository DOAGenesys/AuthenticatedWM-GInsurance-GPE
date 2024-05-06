module.exports = (req, res) => {
    res.json({
        GCDomain: process.env.GC_DOMAIN,
        GCEnvironment: process.env.GC_ENVIRONMENT,
        GCMessagingDeplId: process.env.GC_MESSAGING_DEPLOYMENT_ID,
        SFOrgId: process.env.SF_ORG_ID,
        SFWMName: process.env.SF_WM_NAME,
        SFWMURL: process.env.SF_WM_URL
    });
};
