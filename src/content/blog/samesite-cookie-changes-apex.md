---
title: "Upcoming SameSite Cookie Changes and Oracle APEX"
date: 2020-04-12
author: "Jon Dixon"
tags: ["APEX", "Security", "Cookies", "Chrome", "Browser"]
summary: "Understanding the impact of Chrome's SameSite cookie changes on Oracle APEX applications and how to prepare your applications for these security updates."
---

## Introduction

Google Chrome has been rolling out changes to how cookies work, specifically around the `SameSite` attribute. These changes can impact Oracle APEX applications, particularly those that use third-party integrations or are embedded in iframes.

## What is SameSite?

The `SameSite` cookie attribute controls when cookies are sent with cross-site requests. It can have three values:

- **Strict**: Cookies only sent in first-party context
- **Lax**: Cookies sent with top-level navigations and GET requests from third-party sites
- **None**: Cookies sent in all contexts (requires Secure flag)

## Chrome's Changes

Chrome now treats cookies without a SameSite attribute as `SameSite=Lax` by default. Previously, cookies without this attribute were treated as `SameSite=None`.

This means:
- Cookies won't be sent with cross-site requests by default
- Applications relying on cross-site cookies may break
- Explicit `SameSite=None; Secure` is required for cross-site cookies

## Impact on APEX Applications

### Affected Scenarios

1. **APEX in iframes**: Applications embedded in third-party sites
2. **Social Sign-On**: OAuth flows that rely on cookies
3. **Third-Party Integrations**: REST calls that include cookies
4. **Cross-Domain Deployments**: APEX and ORDS on different domains

### Symptoms

If affected, you may see:
- Session loss after redirect
- Social login failures
- Unexpected logouts
- Cross-site requests failing

## Solutions

### ORDS Configuration

Configure ORDS to set the SameSite attribute explicitly:

```properties
# In ORDS configuration
security.cookies.samesite=None
```

### Application Express Settings

Review your APEX instance settings:
1. Check Session Cookie settings
2. Review Authentication Scheme configuration
3. Test OAuth/Social Sign-On flows

### SSL/TLS Requirement

Cookies with `SameSite=None` must also have the `Secure` flag, meaning:
- Your application must use HTTPS
- This is a good security practice regardless

## Testing Your Application

1. Open Chrome DevTools
2. Navigate to Application > Cookies
3. Check for warnings about SameSite
4. Test cross-site scenarios in your application

## Timeline

Chrome has been rolling out these changes gradually:
- Chrome 80: Started enforcing SameSite=Lax default
- Chrome 84+: Full enforcement

## Conclusion

While these cookie changes improve web security, they require attention for APEX applications that rely on cross-site cookie functionality. Review your applications, update your ORDS configuration if needed, and test thoroughly.

## Author

Jon Dixon, Co-Founder JMJ Cloud
