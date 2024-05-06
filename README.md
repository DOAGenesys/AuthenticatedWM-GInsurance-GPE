# Genesys Cloud Predictive Engagement and Salesforce Web Messaging Integration

This repository contains the code and configuration necessary to integrate Genesys Cloud Predictive Engagement (GC PE) with Salesforce Web Messaging (SF WM), providing a cohesive customer engagement solution that tracks user activities on a website and initiates conversations via Salesforce Web Messaging based on predefined conditions.

## Overview

The integration includes the following components:

- **Genesys Cloud Predictive Engagement:** Monitors user behavior on the website to determine engagement opportunities.
- **Salesforce Web Messaging:** Engages users through a messaging widget triggered by conditions set in Genesys Cloud.

For more information on configuring Salesforce Web Messaging, refer to the [official Salesforce documentation](https://help.salesforce.com/s/articleView?id=sf.miaw_setup_stages.htm&type=5).


## Prerequisites

- **Genesys Cloud with Predictive Engagement enabled**
- **Salesforce with Messaging for In-App and Web User licenses and enabled Omnichannel** 

## Configuration Steps

### Salesforce Web Messaging Setup

1. Follow the steps provided in the [Salesforce documentation](https://help.salesforce.com/s/articleView?id=sf.miaw_setup_stages.htm&type=5) to configure Salesforce Web Messaging.
2. Retrieve the necessary environment variables from the generated code snippet for later use in deployment.

### Genesys Cloud Setup

1. Configure a Genesys Cloud Web Messaging deployment, required for predictive engagement.
2. Define your Segment Conditions in the Genesys Cloud UI as follows:
   - **Event Source:** Web
   - **Event:** Form abandoned
   - **Page domain:** contains any of your specified domains, e.g., `vercel.app`

### API Configuration for Open Actions

Use the API endpoints provided by Genesys Cloud to set up open actions. Below are examples of API requests used to create an open action and the action map that triggers it.

#### Create Open Action (the URLs can be arbitrary)

\```http
POST /api/v2/journey/openactions

{
  "name": "GPE and SF - Abandoned quote form",
  "displayName": "GPE and SF - Abandoned quote form",
  "description": "Used for Web messaging SF integration",
  "type": "web",
  "documentation": {
    "displayText": "example.com",
    "url": "https://www.example.com"
  },
  "icons": {
    "actionMapIconConfig": {
      "primaryIcon": {
        "defaultIconUrl": "https://www.example.com",
        "hoverIconUrl": "https://www.example.com",
        "activeIconUrl": "https://www.example.com"
      }
    }
  },
  "createdDate": "2024-04-16T07:26:18.813Z"
}
\```

#### Create Action Map Triggering the Open Action

\```http
POST /api/v2/journey/actionmaps

{
  "isActive": true,
  "displayName": "Trigger SF Web Messaging - open action",
  "triggerWithSegments": ["2541943b-d1c4-49f4-9620-1cb57535db01"],
  "activation": {"type": "immediate"},
  "weight": 5,
  "action": {
    "mediaType": "openAction",
    "actionTargetId": "e05683ef-736f-3a74-8905-bc8b52a07d6d",
    "openActionFields": {
      "openAction": {
        "name": "Abandoned quote form",
        "id": "e05683ef-736f-3a74-8905-bc8b52a07d6d"
      }
    }
  }
}
\```

### Web Application Setup

1. Clone this GitHub repository to your local machine.
2. Create a Vercel account using your GitHub account and start a new project with the cloned repository.
3. Set up the following environment variables before deploying:
   - **SF_WM_URL:** URL from SF WM generated code snippet (e.g., `https://<mydomain>.my.site.com/ESWSalesforcewebmessagi1712838660793`)
   - **SF_ORG_ID**
   - **SF_WM_NAME:** Can be obtained from SF WM generated code snippet (e.g., `Salesforce_web_messaging`)
   - **GC_DOMAIN:** e.g., `https://apps.mypurecloud.de`
   - **GC_ENVIRONMENT:** e.g., `prod-euc1`
   - **GC_MESSAGING_DEPLOYMENT_ID**

## Testing Steps

1. Clear browsing data on your browser.
2. Navigate to your Vercel website and access the "Appointment" section.
3. Interact with the form by filling out the first field but not completing it, then navigate to another section.
4. Observe the Salesforce Web Messaging widget; it should be triggered shortly after the specified conditions are met.
