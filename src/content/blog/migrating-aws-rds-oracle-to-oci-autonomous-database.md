---
title: "Migrating Oracle and APEX from AWS RDS to OCI Autonomous Database: What Actually Went Wrong"
date: 2026-11-12
author: "JMJ Cloud"
tags: ["Oracle APEX", "OCI", "Autonomous Database", "AWS RDS", "Data Pump", "Migration", "AI-Assisted Development"]
summary: "We moved our own internal portal, an Oracle 19c database with 18 APEX applications, from AWS RDS for Oracle to an OCI Autonomous Database, with an AI coding agent doing much of the hands-on work. The data move was the easy part, so this post covers the problems that actually cost us time and how we fixed each one."
---

*We migrated our own internal portal from AWS RDS for Oracle to an OCI Autonomous Database. The data moved in minutes. Almost everything that cost us time was something else.*

At JMJ Cloud we run our business on an internal portal built in Oracle APEX: time entry, billing, service requests, code deployment and a few administrative apps. Earlier this year we moved it from AWS RDS for Oracle to an Oracle Cloud Infrastructure (OCI) Autonomous Database. We kept a detailed migration log throughout, and this post is drawn from that log, including the parts where we were wrong.

> **The short version**
>
> - Source: **Oracle 19c** (Standard Edition 2) on AWS RDS, running **APEX 20.2**.
> - Target: an **OCI Autonomous Database on 26ai**, running **APEX 24.2**.
> - Scope: 9 schemas, 958 MB of data, 18 APEX applications in two workspaces, and 5 scheduler jobs.
> - Method: **Data Pump** through object storage, plus APEX export and import.
> - The cutover data refresh, from fresh export to passing validation, took about **14 minutes**.
> - Sign-on, APEX metadata, package differences and networking took far longer than the data.

## Why We Moved

On AWS the portal was spread across several services: the database on RDS, ORDS on a separate compute instance in front of it, and static assets (logos, images, document templates) in an S3 bucket. An Autonomous Database includes APEX and ORDS as part of the managed service, so the move collapsed that into one database service plus an object storage bucket, on the platform we work on for clients every day.

The database was small and we could accept a maintenance window of one to two hours, so we planned a direct cutover with Data Pump. No GoldenGate, no change data capture.

## The Approach

We did the migration twice: a full test run in late January, then the production cutover on 21 February. An AI coding agent (Claude Code) ran most of the hands-on work under our direction: driving the AWS and OCI command-line tools and SQLcl, writing the post-import and validation scripts, and keeping the migration log.

**Database.** A schema-mode Data Pump export on RDS, pushed to S3 with the RDS S3 integration, copied to an OCI Object Storage bucket, then pulled into the Autonomous Database with `DBMS_CLOUD.GET_OBJECT` over a pre-authenticated request and imported with `DBMS_DATAPUMP`. The test export took 1 minute 52 seconds and produced a 460.5 MB dump file.

**APEX.** We exported each application with `APEX_EXPORT.GET_APPLICATION`, created the workspaces on the target, and imported with `APEX_APPLICATION_INSTALL` so we could set the workspace, application ID and parsing schema explicitly. The import upgraded the applications from APEX 20.2 to 24.2 as it went.

**Cutover.** Because the applications were already imported and fixed on the target from the test run, cutover became a data-only refresh: drop the application schemas, import a fresh dump, run one idempotent post-import script, validate. That script covered ten steps in about 12 seconds. Validation showed 1,190,164 rows across 126 tables, zero invalid objects and all 5 scheduler jobs scheduled. The source database stayed untouched as the rollback path.

So far, so smooth. Here is the rest.

## Problem 1: Sign-On Broke, and the Cause Was a Cookie

Our portal uses Microsoft sign-in through an APEX social sign-in authentication scheme. After the move, every login ended with "Your session has ended."

We fixed several real but secondary problems first:

- Web credentials are not included in APEX exports, so the client ID and secret had to be set again with `APEX_CREDENTIAL.SET_PERSISTENT_CREDENTIALS`.
- The new callback URL had to be registered with the identity provider.
- Our logging utility needed its application context recreated. Until then the post-authentication procedure failed with `ORA-01031`.
- On APEX 24.2, that procedure set session state before the session was fully established during the callback (`ORA-20987`). We deferred that work to the first page load.
- The database needed network ACLs to reach the identity provider.

Sign-on still failed. As a temporary diagnostic we signed in with a different authentication scheme, which proved the application itself was fine and isolated the fault to the OAuth round trip.

The clue was in `apex_webservice_log`: APEX was fetching the discovery document but never calling the token endpoint. It was not failing the token exchange. It was never attempting it. That pointed away from the network and toward the session, and this query found it:

```sql
select application_id, authentication_scheme_name, cookie_domain
from   apex_application_auth
where  cookie_domain is not null;
```

Every authentication scheme had its cookie domain set to the old site's domain. The browser would not send the session cookie back to the new host on the callback, so APEX could not find the session it had started. Clearing the cookie domain fixed sign-on immediately.

**Lesson:** when moving APEX to a new domain, check the cookie domain and the logout URL on every authentication scheme in every application before anything else.

## Problem 2: You Cannot Patch APEX Metadata After Import

Our first plan for the cookie domains, logout URLs and old asset URLs was a post-import script that updated APEX metadata directly. We found 53 references to the old S3 bucket across the 18 applications, in two different URL formats, and 14 applications with a logout URL pointing at the old site.

On Autonomous Database that script could not work. The ADMIN user cannot read or update the internal APEX tables: we got `ORA-00942` or `ORA-01031` on every approach we tried. Worse, we discovered this late. The script had run during cutover, its failures went unnoticed, and four applications in production were still carrying their old settings a day later.

The fix was to stop patching after import and patch before it. An APEX import removes the application and recreates it from the export file, so we edited the export files with `sed` and imported the corrected copies:

```bash
sed \
  -e "s/,p_cookie_domain=>'<old-domain>'//" \
  -e "s|https://<old-asset-host>/<bucket>/|https://<new-asset-host>/<bucket>/|g" \
  f<app_id>.sql > f<app_id>_fixed.sql
```

**Lesson:** do not accept a script's exit as proof. Query the APEX dictionary views afterwards and confirm the values changed.

## Problem 3: APEX Imports That Half Succeed

Three separate import issues:

- **Friendly URLs.** One application was exported with friendly URLs off but was being reached by a friendly URL, giving a 404. We set the flag in the export file and imported again.
- **Saved reports.** A default export leaves out users' saved Interactive Report layouts. We had to export the affected applications again from the source with the right flags and import them a second time:

```sql
apex_export.get_application(
  p_application_id          => <app_id>,
  p_with_ir_public_reports  => true,
  p_with_ir_private_reports => true)
```

- **Silently missing page items.** After one of those imports, a page returned HTTP 400. A duplicate saved Interactive Grid report had raised an error partway through one large PL/SQL block in the export file, and everything after it in that block was skipped, including two page items and several regions and buttons. The page count looked right, but the page was broken. We split the block so the page components ran independently of the saved reports.

By then we were running the imports from a script instead of an interactive SQLcl session. That worked well, with one trap: our first attempt had stripped `set define off` from the file. The import stopped at the first `&` in an HTML template, after it had already removed the existing application. Keep `set define off`.

**Lesson:** after an APEX import, compare component counts (page items, regions, saved reports), not just page counts.

## Problem 4: Package and Schema Differences

The first test import left 276 invalid objects. Recompiling brought that down to 2, and the rest surfaced only when someone clicked the right button:

- **Missing cross-schema synonyms and grants**, including those for a third-party printing plug-in. These went into the post-import script.
- **`DBMS_OBFUSCATION_TOOLKIT` is not available** on Autonomous Database. Our code used it for MD5 hashes, so we wrote a small compatibility wrapper around `DBMS_CRYPTO`.
- **A function that returned no value.** A utility function looked up the current database in a configuration table by container name. The Autonomous Database container name matched no row, every conditional `RETURN` was skipped, and the caller got `ORA-06503`. We added the row, and the script now reads the name from `SYS_CONTEXT` instead of hardcoding it.
- **A function that never existed.** Some administrative applications failed with `PLS-00302` on a missing package function. We assumed the migration had lost it. It had not: the function did not exist on the source either. We implemented it properly. Check the source before blaming the migration.

## Problem 5: Network Rules You Did Not Need Before

Outbound calls from the database need explicit ACLs for the APEX schema, even on a publicly reachable Autonomous Database. We needed them for the identity provider and for SMTP:

```sql
begin
  dbms_network_acl_admin.append_host_ace(
    host => '<identity-provider-host>',
    ace  => xs$ace_type(
              privilege_list => xs$name_list('connect', 'resolve'),
              principal_name => '<APEX_SCHEMA>',
              principal_type => xs_acl.ptype_db));
end;
/
```

One more: when we later attached another private resource to the database's network security group, connections timed out. OCI network security groups deny traffic in both directions by default, and ours had ingress rules but no egress rules.

## Problem 6: Data Pump from SQLcl

On cutover day the export failed three times with `ORA-39001: invalid argument value`. The cause was positional parameters to `DBMS_DATAPUMP.ADD_FILE` when run from SQLcl 25.2. Named parameters worked:

```sql
dbms_datapump.add_file(
  handle    => h,
  filename  => '<dump_file>.dmp',
  directory => 'DATA_PUMP_DIR',
  filetype  => 1);
```

Each failed attempt also left an orphaned job in the `DEFINING` state, which we had to reopen and stop. Use a unique job name and file prefix per attempt.

## Problem 7: Quotas, Tiers and the Vanity URL

- **Always Free quota.** Our first attempt to create an Always Free database failed with a quota error, and along the way we created a paid instance by mistake and had to delete it. Check the quota first.
- **Always Free limits.** The plan assumed 30 GB of storage and the tier allows 20 GB. Our data fit easily (about 747 MB after import). You also cannot clone one Always Free database to another, so we built the development copy from the same cutover dump file.
- **Vanity URL.** We wanted users to see our own domain. That design puts a load balancer in front of a private endpoint, and private endpoints are not available on Always Free. Production moved to a paid instance, and that upgrade cannot be reversed.
- **A failed experiment.** Months later we tried switching production back to a public endpoint to make developer SQL access simpler. The custom domain broke: the public endpoint routes by host header, the load balancer cannot rewrite it, and rewriting it at the proxy layer produced APEX checksum errors after login. We rolled back to the private endpoint and now reach SQL through an OCI Bastion tunnel. Switching endpoint type also means a new private IP address and a regenerated wallet.

## Problem 8: Email

APEX mail needed OCI Email Delivery, an ACL for the SMTP host and the instance SMTP settings. After cutover, messages arrived marked "Unverified." The DKIM key showed as active in OCI, but the DKIM CNAME record had never been created in DNS. We had changed DNS provider mid-project and the runbook still described the old one.

## A Short Checklist

- Inventory schemas, APEX applications, scheduler jobs, web credentials and every hardcoded URL.
- Run a full test migration and turn every fix into one idempotent post-import script.
- Use named parameters with `DBMS_DATAPUMP`, and unique job names per attempt.
- Fix APEX export files before import, and export with saved reports.
- Clear cookie domains, update logout URLs and register the new callback URL.
- Recreate web credentials, network ACLs and SMTP settings on the target.
- Search your code for unavailable packages and for logic keyed on the database name.
- Validate with queries: row counts, invalid objects, constraints, synonyms, jobs, page items.
- Decide early whether you need a custom domain. It drives the endpoint type and the service tier.
- Keep the source untouched until the new system has run cleanly.

## What We Took from It

The agent made the mechanical work fast and kept a far better log than we would have by hand, which is the only reason this post can be specific. It also wrote a script that failed quietly and made at least one wrong assumption about where a problem came from. What caught those was the same thing that catches them in any migration: independent validation queries, and people clicking through the applications.

---

**Planning a move like this?** Migrating Oracle databases and APEX applications between clouds, and finding the problems before your users do, is the kind of work we do for clients. If you are weighing a move to OCI or an Autonomous Database, [let's talk](/contact).
