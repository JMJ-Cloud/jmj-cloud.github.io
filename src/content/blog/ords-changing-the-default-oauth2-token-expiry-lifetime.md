---
title: "ORDS - Changing the default OAuth2 token expiry lifetime"
date: 2016-07-17
author: "Jon Dixon"
tags: ["ORDS", "OAuth2", "Security", "Configuration"]
summary: "Oracle REST Data Services offers two approaches for third party OAuth2 authentication. This post explains how to change the default token expiry lifetime."
---

Oracle REST Data Services offers two approaches for third party OAuth2 authentication. This post explains how to change the default token expiry lifetime from the default of one hour.

![ORDS OAuth2](/images/blog/ords-oauth2-token-expiry/oracle-ords-logo.png)

## Background

Oracle REST Data Services offers two approaches for third party OAuth2 authentication:

### Two Legged (OAuth2 Client Credentials Flow)

Primarily used when a trusted system (that is capable of securely storing the client id and client secret) needs access to your ORDS REST services.

### Three Legged (OAuth2 Authorization Code Flow)

As the name implies, this method involves three parties. The client (the party calling the service), the provider (the party providing the REST service) and the party which owns the data. This flow is primarily used for business to consumer flows.

![OAuth2 Flow](/images/blog/ords-oauth2-token-expiry/oauth2.png)

Both of the above methods utilize tokens to authorize clients to access ORDS REST services for a pre-defined period of time.

## Extending the Default Token Lifetime

By default, the lifetime of a token issued by ORDS is 3600 seconds (or 1 hour) before the client has to re-authenticate. Normally this is fine because you don't want to provide your clients access for too long a period of time (especially in consumer based scenarios).

I am yet to find this in any documentation, but it is possible to change this default by adding a parameter `security.oauth.tokenLifetime` to the defaults.xml file. When you initially install ORDS (at least as of R3.0.5) this parameter does not exist in defaults.xml so I assume the 3600 is hard coded somewhere in the ORDS code.

You can add the new line anywhere in the defaults.xml file. Here is a sample entry to change the default to two hours:

```xml
<entry key="security.oauth.tokenLifetime">7200</entry>
```

After making the change you will need to either re-start ORDS (if running in standalone mode) or reload ORDS (if running from GlassFish or WebLogic).

## Conclusion

While the default one-hour token lifetime works for most scenarios, there are cases where you may need longer-lived tokens. Just remember that longer token lifetimes increase the security risk if a token is compromised, so use this setting judiciously.

---

Jon Dixon, Co-Founder JMJ Cloud
