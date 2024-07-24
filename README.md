# Genesys Cloud Authenticated Web Messaging

This repository contains the code and configuration guidance necessary to integrate Genesys Cloud authenticated web messaging with Google Cloud OpenID Connect for authenticated web messaging, providing a cohesive customer engagement solution that tracks user activities on a website and initiates authenticated conversations via Genesys Cloud Web Messaging.

## Overview

The integration includes the following components:

- Genesys Cloud Web messaging: Engages users through an authenticated messaging widget triggered by conditions set in Genesys Cloud.
- Google Cloud OpenID Connect: Provides secure authentication for web messaging.

## Prerequisites

- Genesys Cloud with Predictive Engagement enabled
- Google Cloud project with OAuth 2.0 client credentials
- Genesys Cloud messaging deployment configured for authenticated messaging

## Configuration Steps

### Google Cloud OpenID Connect Setup

1. Create a new project in the Google Cloud Console or use an existing one.
2. Enable the Identity Platform API for your project.
3. Configure OAuth consent screen and create OAuth 2.0 client credentials (client ID and client secret).
4. Set up authorized redirect URIs for your application.

### Genesys Cloud Setup

1. Configure a Genesys Cloud Web Messaging deployment for authenticated messaging.


### Web Application Setup

1. Clone this GitHub repository to your GitHub account.
2. Create a Vercel account using your GitHub account and start a new project with the cloned repository.
3. Set up the following environment variables before deploying:
   - `GC_DOMAIN`: e.g., https://apps.mypurecloud.de
   - `GC_ENVIRONMENT`: e.g., prod-euc1
   - `GC_MESSAGING_DEPLOYMENT_ID`
   - `GOOGLE_CLOUD_CLIENT_ID`
   - `GOOGLE_CLOUD_CLIENT_SECRET`

## Detailed Integration Process

This section provides an in-depth explanation of how Genesys Cloud authenticated web messaging integrates with Google Cloud OpenID Connect.

### Authentication Flow

1. **Initialization**: 
   - The web application loads and initializes the Genesys Cloud Web messaging.
   - It sets up event listeners for user authentication actions.

2. **User Authentication**:
   - When the user initiates sign-in, the `signIn()` function in `GoogleAuthService.js` is called.
   - This function constructs the Google OAuth 2.0 authorization URL with necessary parameters (client_id, redirect_uri, response_type, scope, state).
   - The user is redirected to the Google sign-in page.

3. **Authorization Code Receipt**:
   - After successful authentication, Google redirects back to your application's callback URL with an authorization code.
   - The `handleAuthCallback()` function in `GoogleAuthService.js` processes this callback.

4. **Token Exchange**:
   - The `fetchTokens()` function exchanges the authorization code for Google OAuth 2.0 tokens.
   - It sends a POST request to the Google token endpoint with the code, client ID, client secret, and redirect URI.
   - Google responds with an ID token, access token, and optionally a refresh token.

5. **Genesys Cloud Integration**:
   - The application stores the authorization code in localStorage.
   - It calls `window.GCWeb messaging.setAuthToken(idToken)` to set the ID token for Genesys Cloud Web messaging.

6. **AuthProvider Setup**:
   - The `registerAuthProvider()` function in `GCsnippet.js` sets up the AuthProvider plugin for Genesys Cloud Web messaging.
   - It implements the `getAuthCode` and `reAuthenticate` commands required for authenticated messaging.

### Key Components and Their Roles

1. **GoogleAuthService.js**:
   - Manages the OAuth 2.0 flow with Google.
   - Key functions:
     - `signIn()`: Initiates the Google sign-in process.
     - `handleAuthCallback()`: Processes the authorization code from Google.
     - `fetchTokens()`: Exchanges the authorization code for tokens.

2. **GCsnippet.js**:
   - Handles the Genesys Cloud Web messaging integration.
   - Key functions:
     - `registerAuthProvider()`: Sets up the AuthProvider plugin.
     - `getAuthCode` command: Retrieves the stored auth code for Genesys Cloud.
     - `reAuthenticate` command: Handles scenarios where re-authentication is needed.

3. **index.html**:
   - Contains the main structure of the web application.
   - Imports and initializes both Google authentication and Genesys Cloud services.

### Data Flow and Security

1. User credentials are sent directly to Google and never pass through your server.
2. The authorization code is sent from Google to your frontend application.
3. Your frontend exchanges this code for tokens with Google.
4. The ID token is used to authenticate with Genesys Cloud Web messaging.
5. All communications use HTTPS to ensure data security in transit.
6. Tokens are stored in the browser's localStorage, which should be used cautiously and cleared on logout.

## Testing Steps

1. Clear browsing data on your browser.
2. Log in using Google authentication when prompted.
3. Observe the Genesys Cloud Web messaging widget; it should be triggered shortly after the user is authenticated.

## Debug

Open the browser developer console and filter by "snippet.js" to see debugging for both Genesys Cloud and Google authentication code snippets.

## Troubleshooting

If you encounter any issues during setup or testing:

1. Ensure all environment variables are correctly set in your Vercel project.
2. Verify that the Google Cloud OAuth credentials are correctly configured with the appropriate redirect URIs.
3. Check the browser console for any error messages related to authentication or Genesys Cloud integration.
4. Confirm that the Genesys Cloud Web messaging deployment is properly configured for authenticated messaging.
