---
title: "AI-Assisted Accrual Automation for Oracle Fusion General Ledger"
status: "Active"
date: 2026-11-01
year: 2026
summary: "An Oracle APEX page that turns a manual, spreadsheet-driven monthly accrual into a drag-and-drop run: fixed rules propose the journal, an AI assistant explains every figure, and the analyst confirms before Oracle Integration Cloud loads it into Fusion General Ledger."
technologies:
  - "Oracle APEX 26.1"
  - "APEX AI Agents"
  - "Oracle Fusion Cloud ERP"
  - "Oracle General Ledger"
  - "Oracle Integration Cloud"
  - "FBDI (Journal Import)"
  - "PL/SQL"
  - "Anthropic Claude"
industry: "Financial Services"
metrics:
  - "Analyst confirms every journal before it reaches Fusion"
  - "Every amount calculated by fixed rules, never by the AI model"
  - "11 AI tools, none of which can reach Fusion"
  - "103 automated checks passing on synthetic test data"
  - "Every step, decision and AI answer kept in an append-only log"
featured: false
order: 21
---

## Project Overview

A financial services firm prepares a recurring monthly expense accrual by hand. Once payables closes, the team requests a billing report from a third party, works out each accrual account by account in a spreadsheet, and loads the journal into Oracle Fusion General Ledger through a spreadsheet upload. The work lands in the tightest days of the month-end close, and it depends on a report whose layout the firm does not control.

We are building an Oracle APEX 26.1 page that replaces that routine. The analyst drags the file onto the page. Agreed rules read it, work out every accrual and propose the journal. An AI assistant sits beside the proposal to explain any line and prepare changes. Nothing goes to Fusion until the analyst clicks send. This is an active engagement: the application is built and tested on synthetic data, and the connection to the firm's Fusion environment is the next step.

## Business Challenge

**Manual Work at Month End:** Each accrual was worked out in a spreadsheet, one billing account at a time, during the close window.

**Layout-Dependent File Loads:** The source report comes from outside the firm. Title rows, column order and column names can change from one month to the next, and a load built around one fixed layout stops working when they do.

**Judgement Buried in a Spreadsheet:** New accounts, closed accounts that still bill, duplicate invoices and bills that move sharply all need a person's decision. Those decisions and the reasons behind them lived in the workbook.

**AI That Finance Can Trust:** The firm wanted to use AI in the finance close, but only in a form its audit, model risk and architecture reviewers could inspect: no model inventing numbers, and no model posting to the ledger.

## Solution Architecture

One APEX page, with three clearly separated roles: the rules work out every number, the AI explains and assists, and the analyst decides and sends.

### Drop the File

The analyst drags the month's report onto the page. There is no mapping step and no reformatting. The page finds the header row and matches columns by name, including known alternative names, so a report laid out differently from last month still reads. If a required column such as the amount is missing, the run stops and lists the columns it did find. It never guesses.

### Rules Propose the Journal

Each billing account on a master list falls into one of three agreed cases, based on whether it appears in the file and whether its invoice is already in payables. The cost centre split is copied from the last paid invoice. Ten rules flag anything that needs judgement and pin those accounts to the top of the proposal. The same file always gives the same answer.

### Ask the AI

The assistant answers in plain words from the run's own data, naming the invoice or file behind each figure. It can prepare a change, but the page asks the analyst to confirm it, with a reason, before anything is recorded. Asked to send the journal, it declines and points to the send button.

### One Click to Fusion

The send button stays off until every flag has a decision and the journal passes its checks. On the analyst's click, Oracle Integration Cloud loads the journal through Journal Import (FBDI), where it waits for the usual General Ledger approval. The import result and any rejected lines come back to the page.

## Technical Highlights

**Deterministic Rules Engine:**
- Accrual rules, splits and journal construction written in PL/SQL, next to the data they read
- Splits rounded to the cent, with a written rule for where leftover cents go
- Tested with an 18-way cost centre split on synthetic data
- Thresholds held as settings the business owns, which the AI cannot see or change

**AI Agent with a Fixed Tool List:**
- Built on the APEX 26.1 AI agent, with Anthropic Claude as the model in the proof of concept
- 11 tools: 7 that look things up and 4 that change something, each only after the analyst clicks and gives a reason
- No SQL access and no route to Fusion
- The agent brief is a version-controlled document, checked by an automated test against what is deployed
- The AI service is a named configuration, so changing the model is a settings change, not an application change

**File Controls:**
- A file for the wrong month is rejected before any journal is built
- The same file submitted twice is stopped, and matching content raises a warning
- Text in a file that reads like an instruction is flagged, logged and ignored, and the AI never sees raw file text

**Fusion Integration:**
- Oracle Integration Cloud is the only component that talks to Fusion
- Journal delivered as a standard FBDI Journal Import file, as a reversing accrual
- Expense lines at account and cost centre detail, with one offset per company so each company balances
- Whole-journal sense check before send: balance by company, open period, valid account combinations and every exception decided

**Audit and Cost:**
- Append-only event log of file drops, tool calls, decisions, the confirm click and every Fusion reply
- Every model call logged with tokens and cost, against a monthly cap with an alert at 80%

## Key Features

| Feature | Description |
|---------|-------------|
| Drag-and-Drop Run | Dropping the file starts the run, with each step shown as it works |
| Flexible File Layout | Header row found and columns matched by name, with renames reported |
| Proposal by Account | One line per billing account, flagged lines first, exclusions explained |
| Exception Decisions | Accept, change or exclude, always with a reason in the analyst's name |
| Carried Decisions | A decision applies again next month only when the same situation recurs |
| Ask the AI | Answers with sources, and changes that wait for the analyst's confirmation |
| Confirm and Send | A summary of what will be sent, anything blocking it, and the one click |
| Run Log | Events, prompts and answers, decisions, checks and cost, with export |
| Accounts Master List | The accounts in scope, with a reason and history for every change |
| AI Requests | Anything the assistant could not do is logged for the team to review |

## Results & Impact

This engagement is in progress, so we are reporting where it stands instead of production results.

**Built and Tested:**
- File reading, the rules, exceptions, the journal, the sense check and the Journal Import file are built
- The AI assistant, run log, master list and settings pages are built
- 103 automated checks pass in the build environment, on synthetic data only
- Demonstrated end to end to the client in October 2026, with the feedback already built in

**What Comes Next:**
- Connecting the Oracle Integration Cloud integrations to the firm's Fusion test environment
- Wiring the model connection to the AI service the firm selects
- Running a real month in parallel with the existing manual load and comparing the journals
- Automated file arrival in a later phase, with the manual drop kept as a fallback

## A Reusable Pattern for Other Accruals

The engine was designed from the start as a pattern, with this accrual as its first type:

- **Configuration, not code:** Every table carries an accrual type, so a second accrual needs configuration and no new code
- **Rules outside the model:** Calculations stay deterministic and unit-testable, whichever AI model is chosen
- **Human in control:** The analyst clears every exception and is the only one who can send
- **Reviewable by design:** Audit and model risk read the same log the analyst sees
- **Standard Oracle integration:** Journal Import through Oracle Integration Cloud, with normal General Ledger approval

## Deliverables

- **Oracle APEX Application**: Accrual run page, imports, master list, run log, AI requests and settings
- **PL/SQL Rules Engine**: File reading, accrual rules, journal build and sense check
- **AI Agent and Tool List**: Version-controlled agent brief and a fixed, tested set of tools
- **FBDI Journal Import File**: Generated per run and stored alongside the source file
- **Automated Test Pack**: End-to-end checks on synthetic data, including file and AI controls
- **Deployment Package**: Repeatable install with pre-checks, post-checks and an installation guide
