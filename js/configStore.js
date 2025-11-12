const configState = {
    genesys: {
        domain: '',
        environment: '',
        deploymentId: ''
    },
    google: {
        clientId: null,
        additionalScopes: []
    }
};

export function setConfig(config = {}) {
    configState.genesys.domain = config.GCDomain || '';
    configState.genesys.environment = config.GCEnvironment || '';
    configState.genesys.deploymentId = config.GCMessagingDeplId || '';
    configState.google.clientId = config.GoogleCloudClientId || null;
    configState.google.additionalScopes = normalizeScopes(config.GoogleOAuthAdditionalScopes);
}

export function publishGenesysConfigToWindow() {
    if (typeof window === 'undefined') {
        return;
    }

    window.GCDomain = configState.genesys.domain;
    window.GCEnvironment = configState.genesys.environment;
    window.GCMessagingDeplId = configState.genesys.deploymentId;
}

export function getGoogleClientId() {
    return configState.google.clientId;
}

export function getGoogleAdditionalScopes() {
    return configState.google.additionalScopes;
}

export function hasGoogleClientId() {
    return Boolean(configState.google.clientId);
}

export function hasValidGenesysConfig() {
    const { domain, environment, deploymentId } = configState.genesys;
    return Boolean(domain && environment && deploymentId);
}

function normalizeScopes(scopes = '') {
    if (!scopes || typeof scopes !== 'string') {
        return [];
    }

    return scopes
        .split(/[\s,]+/)
        .map(scope => scope.trim())
        .filter(scope => scope.length > 0);
}
