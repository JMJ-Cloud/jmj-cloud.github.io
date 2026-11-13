---
title: "AI Plant Statistics on APEX 26.1: A Weekend Build with Claude Code"
status: "Active"
date: 2026-11-10
year: 2026
summary: "Rebuilt a multi-plant manufacturer's daily statistics engine and reporting app on Oracle APEX 26.1 with a Claude-powered assistant, AI search on its reports and APEXlang source control. The first working version took one weekend with Claude Code, and it went live 39 days after the first commit."
technologies:
  - "Oracle APEX 26.1"
  - "APEXlang"
  - "APEX AI Agents"
  - "APEX AI Interactive Reports"
  - "Claude API (Anthropic)"
  - "Claude Code"
  - "Oracle E-Business Suite"
  - "PL/SQL"
  - "APEX Automations"
  - "Oracle Database"
industry: "Manufacturing"
metrics:
  - "First working version built in one weekend: 117 commits in two days"
  - "Nightly statistics refresh cut from about 48 minutes to about 1.5 minutes"
  - "121,905 of 121,905 stored values matched the existing system on the first run"
  - "Figures refreshed every 15 minutes instead of once a night"
  - "AI assistant answers in a median of 4.8 seconds from nine read-only data tools"
featured: true
order: 1
---

## Project Overview

A manufacturer with more than 40 plants runs its operations on a set of daily plant statistics held in Oracle E-Business Suite: production, material usage, on-time delivery, cycle time, sales and labor. Managers trusted the numbers, but the process behind them had aged. The statistics were recalculated once a night by a batch program that took about 48 minutes, today's figures did not exist until the next morning, and nobody could see how a figure had been worked out.

We rebuilt the statistics engine and the reporting application on Oracle APEX 26.1, next to the existing system and without changing any of it. The new application has an AI assistant that answers questions about the figures in plain English, AI search on its reports, and a definition beside every number. The first working version (engine, reports and assistant) was built in a single weekend by one senior engineer directing Claude Code. It went into production 39 days after the first commit.

## Business Challenge

**A Slow Nightly Batch:** The existing program rebuilt the statistics one plant and one day at a time. Its median run on production was about 48 minutes, and most of that time went on recalculating month-to-date figures it then discarded.

**Yesterday's Numbers:** Figures updated once a night, at about 3 a.m. A plant manager looking at the screen in the afternoon was looking at the night before.

**Failures Nobody Saw:** There was no alert when a run failed or the schedule stopped, so a problem surfaced only when someone noticed stale figures.

**Figures Without Explanations:** A number on the screen came with no definition and no way to see the rows behind it. Questions went to whoever remembered how the report was written.

**No Room for Error:** These are the figures the business is run on. Any replacement had to produce the same values, to the same rounding, and prove it before anyone was asked to switch.

## Solution Architecture

A new statistics engine, a new set of query tables and a new APEX 26.1 application, all reading the existing system and writing nothing back to it.

### A Set-Based Statistics Engine

The engine calculates all 64 daily statistics for every plant at once, in a handful of SQL statements, and writes only the rows that changed. It then keeps the monthly summaries and job-level facts that the pages and the assistant read. No page and no AI tool calculates anything from transactions while the user waits.

### Proven Against the Existing Numbers

The old system stayed untouched as the reference. A parity check compares the old and new values for every plant, day and statistic each night and stores the result. On its first run the new engine matched 121,905 of 121,905 stored values. When we measured the nightly comparison during the parallel run in October 2026, it was finding no differences in 121,088 values a night. On-time delivery and cycle time call the same shared business rules the existing reports use. They are never copied.

### An Assistant People Can Trust

Users ask questions in plain English from any page: what a plant produced last month, which plants had the best on-time delivery, which jobs were most late, how a figure is defined, how current the data is. The assistant answers with real figures, names the period and the plants it used, and ends with a link to the report already filtered to match. It can draw a chart above any table in its answer.

It was designed around what it must never do:

- It is read only. Its data tools build SQL only from an approved list of metric names, with every value bound.
- It sees only the plants the person asking is allowed to see.
- Customer names are withheld from it.
- When it cannot answer, it says so and offers to log the question. Logged requests are raised as backlog tickets for the team.

### Reports You Can Question

Four of the reports have AI search. A user types "plants under budget, worst first" into the search box and APEX 26.1 turns that into visible report settings that narrow, sort or group the rows already on the page. Sample questions sit above each report as one-click chips.

### Every Figure Explained

An info button beside each figure opens its definition, drawn from a metric dictionary that also teaches the assistant what users mean by each phrase. A "show the working" page lists the source rows behind a daily figure, adds them up with the engine's own rounding, and checks the total against the stored value.

## Technical Highlights

**Claude Through APEX Generative AI Services:**
- Two APEX Generative AI services call the Claude API: Claude Sonnet 5.5 for the assistant and Claude Haiku 4.5 for report search
- The split was decided by measurement, not preference. On the same evaluation questions, the larger model answered 41 of 41 numeric questions correctly and the smaller one 33 of 41
- A single application setting switches the assistant between models, and another turns AI off entirely

**APEX 26.1 AI Agents and Chat:**
- The assistant is a declarative APEX AI Agent opened with the built-in Show AI Assistant action, so the chat is a native component and not a custom front end
- The agent can act only through its approved tools: nine read-only data tools, plus tools for help topics, page links and logging a request
- Each data tool is a thin wrapper around one PL/SQL function that returns a single JSON envelope, with a measured 95th percentile of 7 milliseconds per call

**Evaluated Like Software:**
- An evaluation set that grew to 108 questions covers figures, comparisons, rankings, definitions, refusals and attempts to get data the user should not see
- By the end of day two of the build, the scored evaluation stood at 50 of 50 numeric answers and 23 of 23 refusal, ask-back and no-data answers correct, with a median answer time of 4.8 seconds
- Every assistant turn and every tool call is logged with its model, timings and row counts, and reviewed in an admin page

**APEXlang in the Same Repository:**
- The application is an APEXlang source tree of 73 files, version controlled beside its 27 PL/SQL packages, 37 tables and 10 views
- Every region is a native APEX or Universal Theme component, and a lint step fails the build if a hand-built one appears
- Every commit carries its work item key, and every release has a written runbook and test evidence

**Scheduling Inside APEX:**
- APEX Automations run the nightly refresh, the 15-minute daytime refresh and the alerts, with no ERP concurrent program to schedule and resubmit
- Each daytime refresh takes about 8 seconds
- A failed run, or no successful nightly run by 6 a.m., sends an email and puts a warning on every page

## How a Weekend Was Enough

The prototype and the first commit both happened on a Friday. By Saturday night the repository held the statistics engine, the parity check, the metric dictionary, the history load, a dozen report and admin pages, the assistant with its tools and evaluation set, and AI search on the reports: 117 commits in two days.

That speed came from the way the work was run, not from skipping steps:

- **The codebase was ready for agents.** The client's custom code already lived in one Git repository with written standards and a starter application, as described in [our post on the EBS monorepo](/blog/oracle-ebs-monorepo). Claude Code began from those conventions instead of a blank page.
- **Agents worked in parallel.** Each stage was split across up to three build branches, merged into an integration branch, and then checked by a separate QA pass that recorded its evidence. Most stages went through that review twice.
- **Decisions stayed with a person.** Who may see which plants, whether the AI may read the data, which model to use and when to release were each decided and recorded by the engineer leading the work.
- **Tests were written with the code.** Engine parity, report parity, AI tool behavior, access and performance each have their own test scripts, because writing them no longer threatened the schedule.

The weekend produced a working version, not the finished product. Over the next five weeks, feedback from the people who use the figures added quarterly business review charts, a capacity utilization model, plant records drawn from the general ledger, and a new home page built from a stakeholder's mockup. The application grew to 22 pages before it went live.

This is the [Software Factory](/software-factory) model applied to one work item: a senior engineer who knows the ERP, agents doing the building, and review at every stage.

## Key Features

| Feature | Description |
|---------|-------------|
| Home | Key figures against budget or a prior period, with a short rules-based summary of what to look at |
| Data | One table to filter, roll up by plant, region or operation, and download |
| Plant Daily | Every statistic for one plant on one day, with month to date beside it |
| Show the Working | The source rows behind a figure, totalled and checked against the stored value |
| On-Time Delivery and Available Work | Summaries with the job lists behind them |
| Quarterly Review | Trend, ranking and capacity charts for business reviews |
| Ask the Assistant | Plain-English questions about figures and about how the app works, on every page |
| AI Report Search | Natural-language filtering, sorting and grouping on four reports |
| How Values Are Calculated | Every definition on one searchable page, with a downloadable guide |
| Parity | Old figures against new, by plant, day and statistic |
| Refresh History | Run log, refresh on demand with progress, and alerts |
| Assistant Log | Every question, the tools it used and how long it took |

## Results & Impact

Figures below were measured on a development copy of production during the parallel run in October 2026.

**Speed and Freshness:**
- Nightly refresh of every plant in about 1.5 minutes, against about 48 minutes for the existing program
- Figures refreshed every 15 minutes through the working day, where they used to wait for the next night
- Report pages opening in 0.2 to 1.3 seconds

**Trust:**
- The same numbers as before, checked value for value every night
- A definition beside every figure and the working behind daily figures
- Alerts when a refresh fails, in place of silence

**AI in Daily Use:**
- Questions answered in a median of 4.8 seconds, with the period, the plants and a link to the report
- AI search on reports returning in 3 to 6 seconds
- Unanswered questions turned into backlog items automatically

**Delivery:**
- First working version in one weekend
- In production, with the assistant switched on, 39 days after the first commit

## Why APEX 26.1 for an AI Application?

- **The AI sits next to the data.** Agents, tools and reports run in the same database as the ERP, so there is no copy of the data and no separate AI platform to secure.
- **Guardrails are declarative.** An APEX AI Agent can do only what its tools allow, and each tool here is a reviewed PL/SQL function.
- **The model is a setting.** Claude is reached through an APEX Generative AI service, so changing or adding a model does not change the application.
- **The application is source code.** With APEXlang the whole app is text in Git, which is what lets an AI coding agent read it, change it and have the change reviewed. We covered that in [our first look at APEX 26.1 and APEXlang](/blog/apex-26-1-apexlang-claude-code).
- **It leaves the old system alone.** Building beside the existing application, with nightly proof that the numbers agree, lets the business move across when it is ready.

## Deliverables

- **Statistics Engine**: Set-based PL/SQL refresh with change-only writes and a run log
- **APEX 26.1 Application**: 22 pages in APEXlang, on native components throughout
- **AI Assistant**: APEX AI Agent on the Claude API with read-only tools, logging and an off switch
- **AI Report Search**: Natural-language search on four interactive reports
- **Metric Dictionary**: Definitions, synonyms and roll-up rules shared by the pages and the assistant
- **Parity and Test Suite**: Nightly old-versus-new comparison and test scripts for engine, reports, AI and access
- **Evaluation Set**: 108 questions with a scoring runner for the assistant
- **Runbooks**: A release runbook and test evidence for every deployment
