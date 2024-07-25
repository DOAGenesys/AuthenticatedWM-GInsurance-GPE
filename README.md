# Genesys Cloud Authenticated Web Messaging

This repository contains the code and configuration guidance necessary to integrate Genesys Cloud authenticated web messaging with Google Cloud OpenID Connect for authenticated web messaging, providing a cohesive customer engagement solution that tracks user activities on a website (if GPE is enabled on the GC messenger config) and initiates authenticated conversations via Genesys Cloud Web Messaging.

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
2. Go to credentials (https://console.cloud.google.com/apis/credentials)
3. Configure OAuth consent screen and create OAuth 2.0 client credentials (client ID and client secret).
4. Set up "Authorised JavaScript origins" (https://[yourSiteURL]) and Authorised redirect URIs (https://[yourSiteURL]/index.html) for your application.

### Genesys Cloud Setup

1. Configure a Genesys Cloud Messaging deployment for authenticated messaging (authentication enabled)
2. Install and configure a new OpenID Connect Messenger Configuration, using the Google OAuth credentials, and for the Discovery Uri, use: https://accounts.google.com/.well-known/openid-configuration

### Web Application Setup

1. Clone this GitHub repository to your GitHub account.
2. Create a Vercel account using your GitHub account and start a new project with the cloned repository.
3. Set up the following environment variables before deploying:
   - `GC_DOMAIN`: e.g., https://apps.mypurecloud.de
   - `GC_ENVIRONMENT`: e.g., prod-euc1
   - `GC_MESSAGING_DEPLOYMENT_ID`
   - `GOOGLE_CLOUD_CLIENT_ID`
   - `GOOGLE_CLOUD_CLIENT_SECRET`

## Genesys Cloud & Google Cloud integration details

This section provides a detailed explanation of how Genesys Cloud authenticated web messaging integrates with Google Cloud OpenID Connect, following the authorization code flow.

### Authentication Flow

1. **Customer Opens Page**:
   - The browser loads index.html and associated JavaScript files.
   - init.js executes, creating `window.initializationPromise`.
   - `getConfig()` fetches and sets up configuration.
   - `start()` function in init.js is called, which initializes auth and checks for existing auth state.

2. **Authentication Request**:
   - When the user clicks the login button, `signIn()` in GoogleAuthService.js is triggered.
   - This function constructs the authentication request URL with client ID, scopes, and redirect URI.

3. **Redirect to Authentication Prompt**:
   - `signIn()` redirects the user to Google's authentication page using `window.location.href`.

4. **User Logs In and Consents**:
   - This step occurs on Google's authentication page, outside of your application code.

5. **Authorization Code Response**:
   - After successful authentication, Google redirects back to your application.
   - The `start()` function in init.js detects this callback.
   - `handleAuthCallback()` in GoogleAuthService.js is called to process the response.

6. **Exchange Code for Tokens**:
   - This step is automatically handled by Genesys Cloud.
   - Genesys Cloud exchanges the authorization code for tokens with Google.

7. **Obtain User Information from ID Token**:
   - This step is automatically handled by Genesys Cloud.
   - Genesys Cloud decodes the ID token to extract user information.

8. **Store User Information**:
   - This step is automatically handled by Genesys Cloud.
   - Genesys Cloud stores the relevant user information internally.

9. **Send Authorization Code to Genesys Cloud**:
   - `initializeAuthProvider()` in GCsnippet.js sets up the mechanism to provide the authorization code to Genesys Cloud.

10. **Return Genesys Cloud Authentication JWT**:
    - This step is automatically handled by Genesys Cloud.
    - Genesys Cloud internally exchanges the authorization code for its own JWT.

### Available User Information

Genesys Cloud automatically extracts and uses specific claims from the ID token. According to the [Genesys Cloud documentation](https://developer.genesys.cloud/commdigital/digital/webmessaging/authenticate#required-scopes-and-used-claims-in-web-messaging), the following claims are used:

- `sub`: Used as the customer's identifier
- `email`: Used as the customer's email address
- `given_name`: Used as the customer's first name
- `family_name`: Used as the customer's last name

These claims are used to populate the customer's information in Genesys Cloud, enabling personalized interactions without requiring additional code on the client side.

### Key Components and Their Roles

1. **init.js**:
   - Manages the initialization process of the application.
   - Key functions:
     - `getConfig()`: Fetches configuration from the server.
     - `start()`: Initializes the application and handles authentication callback.
     - `initializeAuth()`: Sets up login/logout button listeners.
     - `checkAuthState()`: Checks if the user is authenticated on page load.
     - `updateAuthUI()`: Updates the UI based on authentication state.

2. **GoogleAuthService.js**:
   - Manages the OAuth 2.0 flow with Google.
   - Key functions:
     - `signIn()`: Initiates the Google sign-in process.
     - `handleAuthCallback()`: Processes the authentication callback from Google.

3. **GCsnippet.js**:
   - Handles the Genesys Cloud Web Messaging integration.
   - Key functions:
     - `initializeGCSnippet()`: Loads the Genesys Cloud script.
     - `initializeGCAdvancedSnippet()`: Sets up advanced Genesys Cloud features.
     - `initializeAuthProvider()`: Registers the AuthProvider plugin with Genesys Cloud.
     - Sets custom attributes for Genesys Cloud using user information from the ID token.

This integration demonstrates how the application seamlessly connects Google Cloud authentication with Genesys Cloud Web Messaging, providing a secure and user-friendly experience for authenticated customer interactions.

## Testing Steps

1. Clear browsing data on your browser.
2. Log in using Google authentication when prompted.
3. Observe the Genesys Cloud Web messaging widget; it should be triggered shortly after the user is authenticated.
4. Check the browser console for logs showing the extracted user information from the ID token.
5. Verify that the custom attributes in Genesys Cloud include the user's email, name, and other relevant information.

## Debug

Open the browser developer console and filter by "snippet.js" or "GoogleAuthService" to see debugging for both Genesys Cloud and Google authentication code snippets. Look for logs indicating successful token exchange and ID token decoding.

## Troubleshooting

If you encounter any issues during setup or testing:

1. Ensure all environment variables are correctly set in your Vercel project.
2. Verify that the Google Cloud OAuth credentials are correctly configured with the appropriate redirect URIs.
3. Check the browser console for any error messages related to authentication, token exchange, or ID token decoding.
4. Confirm that the Genesys Cloud Web messaging deployment is properly configured for authenticated messaging.
5. If user information is not being extracted correctly, ensure that the necessary scopes (e.g., 'email', 'profile') are requested in your Google OAuth configuration.
6. Verify that the `fetchIdToken()` function is successfully exchanging the authorization code for tokens.
7. If custom attributes are not being set in Genesys Cloud, check the logs in GCsnippet.js to ensure user information is being retrieved from localStorage correctly.
