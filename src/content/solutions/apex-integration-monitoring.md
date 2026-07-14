---
title: "APEX Integration Monitoring"
tagline: "See every integration. Without the digging."
category: "Monitoring"
technologies: ["Oracle APEX", "OIC", "ORDS", "OCI Object Storage", "Autonomous Database"]
summary: "A secure, read-only monitoring screen for your Oracle Integration flows, built on APEX and embedded inside Oracle Fusion. Support teams see status, counts, and every file without touching the OIC console."
benefits:
  - "One screen for support, with no OIC console, SFTP, or database access needed"
  - "Files and logs retained beyond the 7 to 30 day OIC tracking window"
  - "Read-only by design and secured by your existing Fusion roles"
  - "A reusable framework: each new integration just adds rows"
order: 1
---

## The problem

OIC moves your critical files in and out of Oracle Fusion, but when an integration fails, support has nowhere good to look:

- Investigating a file means access to the OIC Developer Console, the SFTP server, or the database. Access support teams do not have and should not need.
- OIC retains tracking for only 7 to 30 days, and production cannot run debug mode for payload logging. The evidence is often gone before anyone looks.
- What you do find is dense JSON and XML, with no friendly view of status, counts, or what actually went wrong.
- A single file can pass through several integrations, and there is no way to follow it end to end.

## The pattern

As OIC processes each file it writes a single tracking row. A read-only APEX page reads it back. That is the whole pattern.

1. **OIC** posts metadata at every stage of each file's lifecycle.
2. **ORDS REST endpoints**, secured with OAuth 2.0 client credentials, create and update one record per file.
3. **A tracking table** in Autonomous Database holds one row per file: status, row counts, job IDs, and links to every stored file.
4. **An APEX Integration Tracker** presents an interactive report over that table. Read-only, launched from the Fusion Springboard.

Source, mapped, FBDI ZIP, and log files live in OCI Object Storage with retention and lifecycle policies you control, not as LOBs in the database.

## What support sees

One screen to filter, read status, and open any file:

- Colour-coded status with load and import job IDs, plus total, imported, and error row counts on every file.
- Filter, search, and sort by date, file type, status, or source, with pivot and export.
- Drill to detail: sources, categories, OIC submit and callback instances, run times.
- One-click download of the source file, mapped file, FBDI ZIP, and every log, served securely from OCI storage.
- Trends by day, week, or month, so a bad run shows the moment it starts trending.

## Secured end to end

- A JWT session bridge reuses the existing Fusion login. No new passwords, no second login.
- Custom Fusion roles gate the page and row-level visibility.
- Only registered OIC clients can write to the table, via OAuth 2.0 secured REST.
- Users can query, filter, sort, and export. Never change, re-run, or delete.

## How we deliver it

We stand up the tracking table, REST endpoints, and APEX page against one integration first (GL journals is a common starting slice), review the live tracker with your support team, then roll the same framework out to every flow that follows. Each new integration is just more rows.
