---
title: "Manufacturing Execution System on Oracle APEX - Shop Floor Execution Built with AI Agents"
status: "Active"
date: 2026-10-15
year: 2026
summary: "Built a manufacturing execution system for a steel processing manufacturer on Oracle APEX and Autonomous Database, integrated with Oracle Fusion Cloud, source-controlled as readable APEXlang in the client's own repository, and delivered with AI coding agents under engineer approval."
technologies:
  - "Oracle APEX"
  - "Oracle Autonomous Database"
  - "Oracle Cloud Infrastructure"
  - "APEXlang"
  - "PL/SQL"
  - "SQLcl"
  - "Oracle Fusion Cloud"
  - "Oracle Integration Cloud"
  - "GitHub"
  - "Codex"
  - "Claude Code"
industry: "Manufacturing"
metrics:
  - "3 active APEX applications tracked as readable APEXlang source"
  - "More than 400 database tables across two schemas under version control"
  - "ERP data mirrored from 10 Oracle Fusion functional areas"
  - "Every AI agent deployment gated by explicit engineer approval"
  - "Client-owned GitHub repository with automated tests, lint and secret scanning"
featured: false
order: 20
---

## Project Overview

A steel processing manufacturer was replacing its legacy manufacturing execution system (MES) as part of a move to Oracle Fusion Cloud. The ERP would remain the system of record for items, inventory, work orders and cost, but operators on the shop floor needed their own purpose-built screens to schedule work, start and finish operations, split lots, record quality results and trace material from raw stock to finished goods.

We are building that MES on Oracle APEX over Oracle Autonomous Database on OCI. The applications and every database object behind them live as readable source in a GitHub repository the client owns, and the work is delivered with AI coding agents (Codex and Claude Code) working under guardrails, with an engineer approving every deployment.

## Business Challenge

Shop floor execution has requirements that a general-purpose ERP screen does not meet well, and the project had to solve several problems at once:

**Replacing a Legacy MES:** The existing platform was being retired, so operators needed equivalent scheduling, tracking and quality functions on the Oracle stack.

**ERP Owns the Master Data:** The MES does not own its master data. Items, customers, work definitions, work orders and inventory originate in Oracle Fusion Cloud and have to be available locally to operator screens.

**Shop Floor Actions Must Flow Back:** As operators work jobs, each action needs to be posted back so the ERP stays the system of record for inventory, work orders and cost.

**Low-Code Without Losing Control:** Changes made directly in an APEX builder or a database do not reach version control on their own. The client wanted a reviewable, versioned record of the whole system, not a set of opaque exports.

## Solution Architecture

A set of Oracle APEX applications in a single workspace, running on one application schema, with a separate staging schema for ERP integration.

### Operator Application

The primary operator application is the shop floor front end. It covers the scheduling workbench and schedule views, track-in and track-out of operations, forming, annealing load creation with start and exit steps, lot splitting, pending lifts, material assignment, on-hand inventory views, downtime, lot holds and process results collection.

### Scheduling, Shifts and Calendars

PL/SQL packages in the application schema handle work order scheduling, calendars and working days, shift resolution, operator shift assignment and machine state tracking. Supporting pages maintain shifts, resource calendars, crews and substitute assignments.

### Lot Lineage and Attribute Management

A lot lineage feature shows material genealogy in both a graphical view and a table view, with rows running from raw material to finished goods. A dedicated attribute update form gives quality users a controlled way to maintain lot attributes, driven by lookup configuration and maintained through the admin application.

### Fusion Integration

Inbound, Oracle Fusion entities are mirrored into staging tables in the integration schema, then transformed into application tables by scheduled database jobs, with row-level failures captured for triage instead of stopping the load. Outbound, MES forms call one generic procedure that validates the event, builds a JSON payload and writes it to a queue table that Oracle Integration Cloud reads through its database adapter.

## Technical Highlights

**APEXlang Source Control:**
- The three active applications are exported as APEXlang trees, one file per component (page, list of values, authorization, automation)
- Trees are validated against the live workspace before commit and re-imported with SQLcl
- Component-per-file source makes review diffs legible in a way a single large export file is not

**Database as Versioned Source:**
- Every table, view, package, trigger, type and scheduler job is committed per schema and per object type
- A written object standard is enforced by a lint script, git hooks and CI
- Every deployed ALTER, DROP or RENAME is recorded in a dated, Liquibase-formatted change ledger
- A drift-capture tool re-extracts the live database, diffs it against the repository and opens a review pull request, flagging conflicts

**Guardrails for AI Agents:**
- Agents edit source files locally, explain what would be deployed, then ask before deploying
- The SQLcl wrapper is read-only by default, using a fail-closed statement classifier, and refuses deployments without explicit approval
- Approved deployments first check that the live database has not drifted from the repository
- Agents never see database or application passwords: connections use saved credentials, and UI testing runs in a pre-authenticated browser session
- Oracle's published agent skills and APEX 26.1 sample applications are vendored into the repository as reference material

**Configuration Over Code:**
- What each outbound event produces is held in configuration tables, not hard-coded
- The outbound procedure never commits, so the shop floor change and its ERP events land together
- Role-based access is table-driven, with roles granted to pages and menus through an admin application

**Platform:**
- Oracle Autonomous Database on OCI, reached over a private endpoint
- Identity columns and database-managed storage as the table standard
- A shared theme application keeps look and feel consistent across the workspace

## Key Features

| Feature | Description |
|---------|-------------|
| Scheduling Workbench | Schedule and publish work orders against resources, with schedule views for operators |
| Track In and Track Out | Start and complete operations, with output lots recorded at completion |
| Forming and Annealing | Process screens for forming, annealing load creation, start and exit |
| Split Lot and Pending Lift | Split material lots and manage lifts in progress |
| Process Results Collection | Define collection setups and capture quality results against them |
| Lot Lineage | Graphical and tabular genealogy from raw material to finished goods |
| Attribute Update | Quality-user form for maintaining lot attributes |
| Lot Holds | Place holds and add operations to a lot |
| Shifts and Calendars | Shift schedules, operator shifts, substitutes and calendar maintenance |
| Comments | Comments with attachments and version history |
| Lookup Administration | Lookup types, values, profiles and column mappings in an admin application |

## Results & Impact

This is an active build, so we describe what is in place today instead of quoting outcome figures.

**One Reviewable System:**
- Applications and database objects sit side by side in one repository
- Git history carries who changed what, when and why
- Dependency manifests generated from the database support impact analysis before a change

**Controlled Delivery:**
- Tests, lint and a secret scan run on every push and pull request
- Agent deployments require explicit approval in the working session
- Each feature carries a design bundle with a technical design, an append-only decision record and testing evidence

**Shop Floor Coverage:**
- Scheduling, execution, quality, lineage and comments delivered in the operator application
- Lot lineage and attribute update built in a development copy of the application, then merged into the main application, with the attribute update form accepted in a technical lead review first

## Why Source-Controlled APEX with AI Agents?

This approach suits an MES build on the Oracle stack because it:

- **Keeps ownership with the client:** The repository sits in the client's own GitHub organization, with full history
- **Makes low-code readable:** APEXlang turns an APEX application into text files a developer or reviewer can read and diff
- **Uses agents where they are strong:** Codex and Claude Code draft source, tests and documentation from the same shared instructions
- **Keeps people in charge:** Agents cannot deploy without an engineer's approval, and new features are built in a development copy before they merge into the main application
- **Integrates natively:** APEX, PL/SQL, scheduler jobs and staging tables all run inside the same Oracle database
- **Leaves a trail:** Standards, change ledger, decision records and testing evidence are committed alongside the code

## Deliverables

- **Operator Application**: Shop floor MES front end in Oracle APEX
- **Admin Application**: Lookup, profile and configuration maintenance
- **Integration Layer**: Inbound staging and transform, plus the outbound event queue for Oracle Integration Cloud
- **Source Repository**: APEXlang application trees and per-schema database source
- **Agent Tooling**: Guarded SQLcl wrappers, approval gate, lint, tests and drift capture
- **Documentation**: Architecture reference, developer guide, onboarding checklist and feature design bundles
