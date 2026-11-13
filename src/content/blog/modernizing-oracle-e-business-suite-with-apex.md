---
title: "Modernizing Oracle E-Business Suite with APEX in 2026"
date: 2026-11-12
author: "JMJ Cloud"
tags: ["Oracle APEX", "Oracle EBS", "Modernization", "ORDS", "APEXlang", "AI-Assisted Development"]
summary: "Oracle APEX is still the most practical way to give Oracle E-Business Suite users modern screens without replacing the ERP or adding a large new cost. Here is the 2026 version of that case: the same three use cases, plus source control, AI coding agents, mobile and REST, document extraction, and what carries forward to Fusion Cloud."
---

*Originally published in 2018 by Jon Dixon. Rewritten in November 2026 for APEX 26 and AI-assisted delivery.*

In 2018 we argued that Oracle APEX is the most practical way to modernize Oracle E-Business Suite (EBS): better screens for users, no replacement of the ERP, and no large extra cost. That argument is still the core of our EBS work. What has changed is everything around it: how the custom code is managed, who (and what) writes it, and how far beyond a web page an extension can now reach.

This is the 2026 version of that post. The thesis and the three use cases are the same. The delivery model is not.

## Why EBS Still Needs Modernizing

Plenty of companies running EBS are not ready to move to a cloud ERP, and the reasons have not changed much:

- Features their industry needs are missing from the cloud product
- Years of customizations would have to be reworked
- EBS is wired into other on-premise systems
- The budget for a full migration is not there
- The system works, and replacing a working system carries risk

Meanwhile, the people using EBS every day expect software to behave like the applications they use everywhere else. The gap between that expectation and a screen designed decades ago is where time and data quality are lost. APEX closes that gap one process at a time, without touching the system of record underneath.

## Why APEX Fits

APEX runs inside the Oracle Database, which means it runs inside the same database as EBS. That one fact explains most of its value here:

- **No second platform.** APEX is included with the Oracle Database license, so there is no separate application stack to buy, host, and integrate.
- **Modest infrastructure.** APEX is installed in the EBS database, and Oracle REST Data Services (ORDS) runs on a small application tier to serve the pages.
- **No data movement.** APEX pages read EBS tables and views and call EBS public APIs directly. No middleware, no synchronization, no duplicate copy of the data.

![Architecture overview: users reach APEX through ORDS, either directly or from EBS menus, and APEX works against custom and EBS objects in the same database](/images/blog/modernizing-ebs-apex/architecture-overview-min_orig.png)

Users can reach an APEX application three ways:

- **From EBS menus:** APEX pages launched from inside EBS
- **Direct login:** standalone access using EBS credentials
- **Mobile devices:** responsive pages for people who are not at a desk

## Three Use Cases That Still Hold

These are the three examples from the original post. We have updated the wording, not the facts.

### Use Case 1: High Impact Performance Management

![Use case 1: employees use an APEX performance management application while HR managers continue to work in EBS](/images/blog/modernizing-ebs-apex/use-case-1-high-impact-min_orig.png)

We built an APEX application to replace the employee-facing screens of the EBS performance management module. The original screens were complex and intimidating for employees who used them only once or twice a year.

The APEX replacement:

- Simplified the user interface
- Guided employees through the process
- Used standard Oracle APIs for data updates
- Kept all existing EBS functionality working behind the scenes

### Use Case 2: Material Processing at 40 Manufacturing Plants

![Use case 2: plant users work through an APEX application and a mobile app, both served by ORDS, while the back office stays in EBS](/images/blog/modernizing-ebs-apex/use-case-1-simplify-min_orig.png)

An APEX application with native iOS integration simplified plant operations for workers who needed quick access to inventory and processing information on the manufacturing floor.

The solution:

- An APEX web application for desktop users
- An iOS app with barcode scanning for floor workers
- ORDS APIs serving both interfaces
- EBS in the background handling sales orders and invoicing

One set of business logic, more than one interface, all integrated with EBS.

### Use Case 3: Capital Expenses Tracking

A focused APEX application for capital expense tracking and approvals:

- 8 pages and 4 tables
- EBS authentication
- EBS views and value sets
- Oracle Workflow for approvals
- Integration with the Projects module for cost tracking

This one matters because of its size. Modernization does not need a massive scope. Start small, prove the value, expand.

## What Has Changed Since 2018

### Extensions Belong in Git, and AI Agents Work Them

In 2018 an EBS extension was usually a set of scripts and an application export. Today we treat custom EBS code as a properly engineered codebase. We keep 144 extension and integration projects (conversions, interfaces, reports, APEX applications, and REST APIs) in a single Git repository, every project laid out the same way, with context files that describe the architecture and the standards. We wrote up the structure in [Make Claude Code Your Most Productive Oracle EBS Developer](/blog/oracle-ebs-monorepo).

That structure is what makes AI coding agents useful on EBS. An agent that reads the repository knows our naming conventions, our logging pattern, and the four coordinated scripts that creating a custom table requires under Edition-Based Redefinition in R12.2. In our experience, a new table takes about 2 minutes with Claude Code against about 20 by hand. The agent never connects to the database. The repository is the context.

Around that repository we run what we call the [software factory](/software-factory): a written specification first, agents building against it, a second agent reviewing the first one's work, and a senior Oracle engineer as the final gate before anything ships.

APEX itself has moved the same way. APEX 26.1, released in May 2026, introduced APEXlang, which represents an application as plain-text files that can be versioned, diffed, validated with SQLcl, and reviewed like any other code. Many EBS environments are still on earlier APEX releases, so this is something you inherit when you upgrade, not something to assume on day one.

### Mobile and REST on Top of EBS

The 2018 post listed native mobile apps as something you could do "beyond APEX" once ORDS was in place. It is now a routine part of the work. The pattern from Use Case 2 has not changed: business logic lives in PL/SQL, ORDS exposes it as REST services, and both the APEX pages and the mobile apps call the same code.

Our [digital operations platform for hot-dip galvanizing](/projects/galvanizing-operations-platform) case study shows how far that pattern goes: APEX applications and native iPad apps across more than 40 plants, with document scanning, Bluetooth coating thickness probes, documents stored in AWS S3, and completed jobs posted to EBS for invoicing.

### AI Features Inside EBS Processes

AI is no longer a separate project from the ERP. Because the database can call REST services, an EBS extension can use an AI service as one more step in a process.

Document extraction is the clearest example. In one project we used an AI document service to read tax exemption certificates stored as PDFs and write the extracted fields into tables alongside EBS R12.2. The backlog was more than 5,700 certificates, extraction confidence scores ran at 95 to 99%, and each document took about 15 seconds. The detail is in our [tax certificate extraction case study](/projects/azure-tax-certificate-extraction).

APEX 26.1 also adds AI capabilities of its own, including AI Interactive Reports (users describe the report they want in plain language) and AI Agents that can act only through approved tools. We have built on 26.1 in our own lab and expect these to become part of EBS extension work as clients upgrade.

### If You Move to Fusion Cloud Later

A fair question in 2026: if we might move to Fusion Cloud one day, is building on EBS a dead end?

Our view is no, provided the extension is built with clean boundaries. We keep custom tables in their own schema, business logic in PL/SQL packages, and the APEX and REST layers on top calling those packages. When the ERP underneath changes, the integration layer is the part that has to be rebuilt. The application, its data model, and the knowledge of the process it encodes are still yours.

We are doing this kind of work now. Our [manufacturing execution system case study](/projects/manufacturing-execution-system-apex) describes APEX applications running on Oracle Autonomous Database next to Oracle Fusion Cloud: ERP data is mirrored into staging tables, and shop floor actions are posted back through Oracle Integration Cloud. APEX is not tied to EBS. It is tied to the Oracle Database, and that goes with you.

## Where to Start

The conclusion from 2018 stands. You are not replacing EBS. You are giving people modern windows into it:

- **Low cost:** APEX is included with the Oracle Database license, with no second platform to host and integrate
- **Low risk:** EBS keeps running as it is
- **High impact:** users get the interface they expect
- **Incremental:** one process at a time

What 2026 adds is speed and control. The extension is in Git, the standards are written down where agents and people both read them, and a small senior team can deliver what used to need a large one.

Pick the one EBS screen your users complain about most. That is usually the right first project.

---

**Want to talk through an EBS process you would like to modernize?** [Get in touch](/contact) and we will help you scope a first project.
