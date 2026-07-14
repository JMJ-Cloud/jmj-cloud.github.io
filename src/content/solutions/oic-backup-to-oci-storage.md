---
title: "OIC Backup to OCI Storage"
tagline: "Cross-region backups for your Oracle Integration instance."
category: "Backup & DR"
technologies: ["OIC", "OCI Object Storage", "OCI IAM"]
summary: "On-demand exports of your entire OIC environment to private, cross-region OCI Object Storage. Integrations, connections, and lookups ready to restore, with the full setup documented and handed over."
benefits:
  - "Full-instance archives: integrations, connections, lookups, packages, libraries"
  - "Cross-region by design, so one regional outage cannot take out both"
  - "Least-privilege service account writing to a private, encrypted bucket"
  - "A documented, rehearsed recovery runbook your team owns"
order: 2
---

## Why back it up

OIC is a managed platform, but the code on it is yours to protect:

- Oracle runs the infrastructure and routine recovery. Your integrations, connections, and lookups are your responsibility.
- A large-scale regional outage can mean standing up a brand-new instance in another region at short notice.
- A recent export rebuilds integrations, connections, and lookups in minutes, not days of manual work.

A backup is only as good as it is recent. Export after every significant change: a service-account rotation, an OIC upgrade, a code migration, a lookup update.

## How it works

OIC writes a full-instance archive straight to an OCI Object Storage bucket over the Swift API. No servers, no scripts.

- The bucket is private, encrypted at rest, and lives in a different region from the OIC instance, so a regional outage cannot take down both the platform and its backups.
- OIC authenticates with a scoped, auth-token-only service account. No console access, least privilege.
- Lifecycle rules age out old exports automatically.
- The export is all-or-nothing: it always captures the whole instance, including integrations, connections, lookups, packages, and libraries.

## The credentials decision

Exports can include or exclude security artifacts, and the right choice depends on what worries you more:

- **Without security artifacts** (the default): no credentials ever leave OIC, but a restore means re-entering every connection's credentials by hand.
- **With security artifacts**: credentials, security policies, and certificates travel with the export, encrypted inside the archive, for a near-complete, fast restore. This is usually the right choice for true disaster recovery.

## What we deliver

- The OCI compartment, bucket, IAM user, group, policy, and auth token, set up least-privilege and documented.
- The OIC storage configuration pointing at the bucket.
- Run and recovery runbooks written for your team, covering the export cadence and the three-pass restore (import, re-point connectivity, activate).
- A rehearsed restore. A backup you have never restored is a hope, not a plan.
