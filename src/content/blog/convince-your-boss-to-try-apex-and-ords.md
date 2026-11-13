---
title: "Convince Your Boss to Try APEX and ORDS: The 2026 Case"
date: 2026-11-12
author: "JMJ Cloud"
tags: ["Oracle APEX", "ORDS", "APEX 26.1", "APEXlang", "AI-Assisted Development", "Build vs. Buy"]
summary: "The case for asking your manager to approve a trial of Oracle APEX and ORDS, rewritten for 2026: applications that live in Git as readable text, AI coding agents working under senior review, a managed home on Autonomous Database, and build versus buy economics that now favor building."
---

*Originally published in 2019 by Jon Dixon. Rewritten in November 2026 for APEX 26 and AI-assisted delivery.*

Full disclosure: we have never had to convince a boss to try APEX or ORDS. What we do have is years of watching clients reap the benefits of running mission critical systems on them, and of running our own business on an internal portal built in APEX.

**The short version:** if you are a boss, approve a small trial of APEX and ORDS. If you already own an Oracle database, the barrier to entry is low and the upside for your business is large.

If you are a developer trying to make that case, this post is for you. As in the original, each talking point opens with a headline statement (for bosses with short attention spans), followed by the reasoning (for bosses who want evidence). Most of the 2019 arguments have held up. Several have become much stronger.

## An Architecture Your Boss Can Understand

**APEX runs inside the database, next to your data, with one thin layer between it and the browser.**

![APEX architecture: browser, ORDS in the mid tier, and the database tier](/images/blog/convince-boss-apex-ords/apex-architecture_orig.png)

**Data centric.** The application definitions, the business logic and the data all live in the same Oracle database. There is no separate application server full of code that has to fetch data across a network before it can do anything with it. That did not come about by accident: there are good reasons to keep your code next to your data, and they matter more as the frameworks around us get more abstracted from the data they serve.

**Stateless.** Requests come through Oracle REST Data Services (ORDS), which uses a pool of database connections. A request borrows a connection, does its work, and hands the connection back for the next request. Database sessions are only busy while a request is being processed, so a modest pool serves a large user population.

A manager does not need to follow every detail. The diagram has three boxes, and that is the whole picture.

## Stability and Innovation

**APEX has been around for more than two decades, and it is still shipping major releases.**

Stability and innovation rarely belong in the same sentence. With APEX they do. Heading into a multi-year project on a stack of half a dozen frameworks, some of which may not exist when the project ends, is unnerving for anyone signing off the budget. APEX has outlasted several generations of those frameworks.

The other half of the story is the care the APEX team takes with upgrades. In our experience, existing applications keep running when the platform moves forward, and you adopt new features application by application, when you are ready.

It has not stood still either. Oracle shipped APEX 26.1 in May 2026 and aimed it squarely at the AI era. Users can ask an interactive report for what they want in plain language, and APEX turns that into visible, editable report settings. Developers can add AI agents that act only through approved tools, inside the application boundary. The full list is in [Oracle's APEX 26.1 announcement](https://blogs.oracle.com/apex/announcing-oracle-apex-261).

## Your Applications Become Real Source Code

**With APEXlang, an APEX application is a set of readable text files that live in Git and get reviewed like any other code.**

This is the biggest change since the original post, and it removes a long-standing objection to low-code platforms: that the applications are a black box only the vendor's tool can open.

APEX 26.1 introduced APEXlang, an open, human-readable specification language. An application becomes a tree of plain-text files, one per page, region and shared component. You can version it, diff it, validate it with SQLcl before anything is imported, and review a change in a pull request. Oracle's own 26.1 sample applications ship this way.

For a boss, that means the same change control, audit trail and code review discipline you expect from any other software. We wrote up our hands-on experience in [First Impressions: APEX 26.1, APEXlang, and Building from Scratch with Claude Code](/blog/apex-26-1-apexlang-claude-code).

## AI Agents Build, Senior Engineers Review

**AI coding agents can now write APEX and PL/SQL. The productivity story that APEX always had has taken another large step.**

APEX has always been known for letting developers build useful, scalable applications in a short period of time. Once an application is text, an AI coding agent can read it and write it too. When we tested this on 26.1, the agent edited the source, ran the validator, read the errors and fixed them in a tight loop, and took us from a blank slate to a deployed, working application in a single focused effort.

Your boss should hear the caveat as clearly as the promise. A raw agent with no preparation produces generic code that ignores your standards. The value comes from the process around it: a precise written specification, a repository that carries your conventions, automated checks, a second agent reviewing the first, and a senior engineer as the final gate before anything ships. The agents multiply experienced people. They do not replace their judgment. We describe that process in detail on our [Software Factory](/software-factory) page.

## An Integration Hub

**APEX and ORDS give you what you need to publish and consume REST web services.**

ORDS has two jobs. One is serving APEX pages to users. The other is hosting REST services built directly on SQL and PL/SQL, which lets you give other systems secure, controlled access to the data in your Oracle database. That is useful for integrations, and for serving native mobile applications.

In the other direction, APEX can build reports and forms directly on external REST services, and can stage that data into local tables when you need it closer. That extends the reach of an application beyond the database and avoids unnecessary copying of data between systems.

## Sign-In Without Storing Passwords

**APEX can hand authentication to the identity provider your company already uses.**

Authentication is hard to get right. If you store usernames and passwords yourself, you need to know exactly what you are doing. It is generally far safer to make your corporate identity provider the single source of truth and let every application, including your APEX applications, authenticate against it. APEX supports this declaratively, and it is how our own portal signs users in.

## Batteries Included

**APEX provides features out of the box that would otherwise mean assembling and maintaining a pile of third-party libraries.**

To name a few: authorization, multi-language support, email and email templates, an extensible plug-in framework, JSON handling, spreadsheet data loading, charts, maps, calendars, approvals and the Universal Theme, which gives you a responsive, accessible user interface without custom front-end work.

The benefit of having these bundled is that fixes and enhancements arrive from Oracle with each release. With utilities spread across many providers, you get fixes when each provider gets around to them, and you inherit the rework when one of them drops by the wayside.

## At Home On-Premises and in the Cloud

**The same application runs next to an on-premises database or on a managed cloud service.**

In 2019 we described the cloud options as either a packaged service or installing everything yourself. Both paths still exist, but the managed option is now the obvious starting point for a trial. An Oracle Autonomous Database includes APEX and ORDS as part of the managed service. When we moved our own portal to one this year, a database, a separate ORDS server and a storage bucket collapsed into one database service plus object storage.

That matters for the conversation with your boss, because a trial no longer needs a server request or an infrastructure project.

## Leverage the Talent You Already Have

**If you run Oracle ERP, you probably already employ most of the skills you need.**

Many of our customers run Oracle E-Business Suite and have PL/SQL developers on staff. Those developers already understand the data model, the business rules and the database. In our experience they become productive in APEX quickly, because SQL and PL/SQL are the core of the skill set and the web layer is the smaller part. AI assistance narrows that remaining gap further, provided someone senior is reviewing what gets produced.

## The Economics Have Shifted

**APEX is included with the Oracle Database license, and AI has collapsed the cost of building on it.**

We left cost until last in 2019 because APEX and ORDS stand on their own against any enterprise development platform. That is still true. But the cost argument has changed shape. It used to be "the tooling is free". Now it is about the whole build versus buy decision.

The usual answer to a gap in your ERP has been to buy another product, pay to configure it until it approximates your process, integrate it, and then pay per user every year. The alternative is to extend the platform you already own, with a small senior team using AI tools, and to keep everything you build. We made that argument at length in [Build vs. Buy in the Age of AI](/blog/build-vs-buy-age-of-ai).

Two of our case studies show what it looks like in practice: a [galvanizing operations platform](/projects/galvanizing-operations-platform) and a [performance management platform](/projects/performance-management-platform), both built on APEX and integrated directly with Oracle E-Business Suite.

## What to Ask For

Do not ask your boss for a platform decision. Ask for a small, bounded trial:

- Pick one real item from the backlog, something useful but not business critical.
- Build it on APEX, with the application source in Git from the first day.
- Agree up front how you will judge it: time to deliver, fit to the requirement, and what it would have cost to buy.

If the trial goes well, the next conversation will be about what to build second.

---

**Want help making the case, or running the trial?** JMJ Cloud builds and modernizes Oracle APEX applications for organizations running Oracle ERP. [Get in touch](/contact) and we will help you pick the right first project.
