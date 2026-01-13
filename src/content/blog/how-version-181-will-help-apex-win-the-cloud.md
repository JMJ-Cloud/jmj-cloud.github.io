---
title: "How Version 18.1 will help APEX win the Cloud"
date: 2018-05-15
author: "Jon Dixon"
tags: ["APEX", "Cloud", "REST", "ORDS", "OAuth", "APEX 18.1"]
summary: "In this post I will discuss three key features in Oracle APEX 18.1 that position APEX as a leading cloud development platform: REST Web Source Modules, REST Enabled SQL, and Social Login."
---

Oracle APEX 18.1 introduces several game-changing features that strengthen APEX's position as a cloud-ready development platform. In this post, I'll focus on three features that I believe will help APEX win in the cloud.

![APEX Win the Cloud](/images/blog/apex-18-1-win-cloud/title-apex-win-the-cloud-min.jpg)

## 1. REST Web Source Modules

This feature allows developers to access REST web service data through declarative APEX components without extensive custom coding. If you've ever struggled with consuming REST APIs in APEX, this feature is a game-changer.

![REST Web Source](/images/blog/apex-18-1-win-cloud/apex-win-the-cloud-min_orig.png)

The wizard previews service responses and lets developers:

- Remove unwanted fields from the response
- Add calculated columns
- Configure data profile for APEX components
- Set up caching options (session, user, or all users)
- Apply post-processing SQL

### APEX_EXEC Package

Beyond the declarative approach, the new `APEX_EXEC` PL/SQL package provides programmatic access to REST services. This opens up possibilities for batch processing and complex integrations.

### Example Use Case

Consider displaying WorkDay employee data in an Oracle ERP Cloud page via an APEX embedded application. Previously, this would require:

1. Custom PL/SQL to call the WorkDay API
2. JSON parsing logic
3. Error handling
4. Session management

With REST Web Source Modules, you configure the connection once and use it across multiple pages declaratively.

## 2. REST Enabled SQL

This Oracle REST Data Services (ORDS) capability allows secure SQL execution on remote Oracle databases via REST. It's like having a database link, but with modern REST-based security.

REST Enabled SQL supports:

- SELECT queries
- UPDATE, DELETE operations
- PL/SQL execution
- OAuth security controls

### Example Use Case

Imagine an AP department using ERP Cloud that needs to view Purchase Order data from on-premise EBS. With REST Enabled SQL:

1. Configure ORDS on the EBS database with OAuth security
2. From APEX in ERP Cloud, query EBS data directly
3. Users see integrated data without separate logins

This bridges the gap between cloud and on-premise systems without complex middleware.

## 3. Social Login

![Multiple Logins](/images/blog/apex-18-1-win-cloud/multiple-logins.png)

APEX 18.1 introduces a new authentication scheme supporting:

- Google authentication
- Facebook authentication
- OpenID Connect providers
- Any OAuth2 provider

![Social Login Configuration](/images/blog/apex-18-1-win-cloud/apex-win-the-cloud-social-min_orig.png)

This eliminates the need for custom password management. Instead of storing and securing user credentials yourself, delegate authentication to trusted identity providers.

### Benefits

- **Security**: Let the experts handle password storage and encryption
- **User Experience**: Users authenticate with credentials they already know
- **Enterprise Ready**: Support for corporate identity providers like Okta, Azure AD
- **Reduced Development**: No custom authentication code required

## Conclusion

These three features - REST Web Source Modules, REST Enabled SQL, and Social Login - significantly enhance APEX's cloud capabilities:

- **Integration**: Easily connect to any REST API
- **Hybrid Architecture**: Bridge cloud and on-premise systems
- **Modern Authentication**: Support enterprise and social identity providers

APEX 18.1 isn't just keeping up with cloud trends; it's providing practical solutions that make cloud development easier for Oracle developers.

---

Jon Dixon, Co-Founder JMJ Cloud
