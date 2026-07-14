---
title: "OIC OAuth Service Account Setup"
tagline: "Let external systems call OIC securely. No user, no password in the call."
category: "Security"
technologies: ["OIC", "OAuth 2.0", "OCI IAM", "IDCS"]
summary: "A hardened OAuth 2.0 client-credentials pattern for invoking Oracle Integration from external systems: scoped short-lived tokens, least-privilege roles, and a clean audit trail, set up and documented in your tenancy."
benefits:
  - "Pure system-to-system: no passwords or user sessions travel with any call"
  - "Invoke-only access via the ServiceInvoker role, never admin or deployer"
  - "One confidential app per consumer, so revocation and audit stay clean"
  - "Token caching and rotation guidance so you never hit endpoint throttling"
order: 3
---

## The pattern

Get a token, then call the integration. The external system authenticates with its own client ID and secret, receives a short-lived scoped token from your identity domain, and presents it as a bearer to the OIC invoke URL.

- No user, no session: the token is scoped to your OIC instance and expires after about an hour. Nothing long-lived travels with each call.
- Least privilege: the ServiceInvoker role lets the caller run integrations, not deploy or administer them.

## What we set up

- A dedicated confidential application in your OCI identity domain, one per external consumer, named for the consumer and environment.
- A token-issuance grant against the OIC resource app with **ServiceInvoker only**. Never ServiceAdministrator or ServiceDeployer.
- The exact scope string captured from your instance's resource app (it varies by release, and hand-typing it is the most common failure).
- The client secret stored in OCI Vault or your caller's secret manager, never in source control or logs.
- The full flow proven end to end, token request then invoke, before the caller is wired up.

## Token lifecycle

There is no refresh token with client credentials, and that is fine. The caller caches the access token, reuses it across calls, and requests a new one when the old one nears expiry, using the same credentials. We include this guidance in the handover so your integration partners do not fetch a token per call and hit endpoint throttling.

## Hardening checklist

Every setup we hand over covers:

- Least privilege: invoke-only app roles.
- Secret rotation: a documented rotation procedure with the secret held in a vault.
- Network restriction: OIC allow-lists or an API gateway so only known sources reach the invoke endpoint.
- One app per consumer: revoke or rotate one caller without touching the others, and keep audit logs attributable.

## How we deliver it

We configure the identity domain, create and document the confidential app, verify the token and invoke flow end to end with your external system, and hand over a runbook your team owns.
