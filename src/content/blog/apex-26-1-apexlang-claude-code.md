---
title: "First Impressions: APEX 26.1, APEXlang, and Building from Scratch with Claude Code"
date: 2026-05-25
author: "JMJ Cloud"
tags: ["Oracle APEX", "APEX 26.1", "APEXlang", "Claude Code", "AI-Assisted Development", "Low-Code"]
summary: "We built a real, AI-powered Oracle APEX application on the brand-new 26.1 release, authored entirely as APEXlang source and developed with Claude Code. Here is our honest first-impressions report."
draft: false
---

*We set out to build a real, AI-powered Oracle APEX application on the newest release, authored entirely as source code and developed with an agentic coding workflow. Here is what the experience was actually like.*

At JMJ Cloud we keep a close eye on where Oracle's low-code platform is heading. The APEX 26.1 release brought a change we'd been waiting for: **APEXlang**, which lets an APEX application live as plain-text source. So we decided to put it through a proper test: build a genuinely useful application on it, from a blank slate, using **Claude Code**, Anthropic's agentic development tool. This is our honest first-impressions report.

> **The short version**
>
> - Built on **Oracle APEX 26.1** in a local, containerized sandbox.
> - Authored **from scratch in APEXlang**, not copied from an existing app.
> - Developed with **Claude Code** plus a set of focused "skills."
> - Guided by Oracle's **official APEX 26.1 sample repository**.
> - Verified end-to-end in a real browser: public flow, admin console, and email.

## Just Released: Oracle APEX 26.1

Oracle shipped **APEX 26.1** earlier this month (it reached general availability on May 14, 2026), and they're positioning it squarely at the AI era, even branding it the "AI Application Generator." The guiding idea is governance: *if you generate it, you own it*, so AI generates structured, reviewable application intent rather than piles of opaque code. Three headline capabilities stood out to us:

- **APEXlang**, an open, human-readable specification language: an APEX application becomes a package of plain-text `.apx` files you can version, diff, validate (via SQLcl), and review with standard developer tooling, and that AI agents can generate. This is the one we built on.
- **AI Interactive Reports**: users query a report in plain language (think "European customers grouped by industry"), and APEX translates that intent into native, visible, editable report settings instead of executing AI-generated SQL.
- **AI Agents and AI Tools**: a governed way to add conversational actions, where an agent reasons over a request and can act only through approved tools, all inside the application boundary.

There's plenty more besides, across workflow automation, components, reporting, translation, and security. The full rundown is in [Oracle's APEX 26.1 announcement](https://blogs.oracle.com/apex/announcing-oracle-apex-261).

## Our Setup

We worked entirely in a private lab: a local, containerized **Oracle Database 26ai** running **Oracle APEX 26.1**, used purely as a sandbox so we could experiment freely against a current release with no production data and nothing exposed to the internet. That freedom to break things and start over is exactly what you want when you're learning a new tool.

The interesting part isn't the infrastructure, though; it's *how* we drove the development. Rather than clicking through the App Builder by hand, we let an AI assistant author the application as source, deploy it, and test it, while we steered.

## The Claude Code Setup

Claude Code is Anthropic's agentic coding tool: it reads and writes files, runs commands, can even drive a web browser, and follows *skills*, focused, reusable playbooks for particular kinds of work. We equipped it for Oracle development with a few of these:

- Oracle's own **APEX skill** for generating and validating APEXlang, plus companion **database and cloud skills** for SQL, PL/SQL, and infrastructure, all from Oracle's official skills repository ([github.com/oracle/skills](https://github.com/oracle/skills)), which we keep synced so the guidance tracks each APEX release.
- A set of **engineering-discipline skills**: brainstorming before building, writing a plan, debugging systematically, and verifying work before calling it done (from an open Claude Code skill library known as "superpowers").
- A standing rule we lean on hard: **check Oracle's official samples first**. We pointed the assistant at the official Oracle APEX repository on GitHub ([github.com/oracle/apex](https://github.com/oracle/apex/tree/26.1), branch 26.1) and its sample apps, starter apps, plug-ins, and blueprints, so canonical patterns guided every component instead of guesswork.

That last point mattered more than we expected. Whenever the assistant needed to know the *right* way to express something (a login page, an interactive report, a credential), it consulted Oracle's own examples and adapted the blessed pattern.

## What We Built

We built a public **lead-generation chatbot** for our own business. A prospective client enters their name and email, then has a short, natural conversation, driven by Anthropic's Claude, that adapts to their answers and gathers a structured project brief in ten questions or fewer. When it has enough, it thanks the prospect and produces a clean, structured summary: the type of work, the systems involved, rough size and timeline, and a set of follow-up questions for our team. Everything is stored in the database and surfaced in an internal admin console where we review, prioritize, and follow up, with an email notification the moment a new lead completes.

It's a complete, end-to-end application: a public intake form, an AI-driven chat, structured data capture, an admin reporting console with full transcripts, runtime configuration including an on/off switch, and email notifications, all running on APEX 26.1.

![The JMJ Cloud intake assistant: a Claude-driven conversation in the JMJ Cloud brand on Oracle APEX 26.1.](/images/blog/apex-26-1-apexlang-claude-code/intake-assistant.jpg)

*The intake assistant in action: a Claude-driven conversation, in the JMJ Cloud brand, on Oracle APEX 26.1.*

> **Built from scratch, on purpose**
>
> We did **not** copy an existing starter app and rename it. Every page, region, process, and the entire data model were authored as new APEXlang source. We referenced Oracle's samples to learn the correct *patterns*, but the application itself is original. That was the real test we wanted to run: could a brand-new APEX app be written as source and stood up entirely through an agentic workflow? It could.

## APEXlang: The Headline

APEXlang represents an APEX application as an exploded tree of plain-text files: one per page, region, shared component, and so on. For us, this is the story. Your application becomes **real source code**: diffable, reviewable, and versioned in Git, editable by both people and AI. Changes are no longer locked inside a binary export that only the App Builder can open. Here's a tiny taste: a page region, as text:

```
region transcript (
    name: Conversation
    type: classicReport
    source {
        location: localDatabase
        type: sqlQuery
        sqlQuery: "select ... from chat_message ..."
    }
)
```

*An APEX component as plain text, reviewable in a pull request like any other code.*

Pairing that with Claude Code felt natural. The assistant edits the text, runs APEX's built-in validator, reads any errors, and fixes them in a tight loop *before* anything is imported into the database. Authoring from scratch is strict (the format is precise and the validator is unforgiving), but that strictness turned out to be a feature: mistakes surfaced instantly, and Oracle's samples showed exactly how each piece is meant to look.

## Lessons Learned

- **APEX-as-source is a genuine shift.** Version control, code review, and AI-assisted editing all become first-class for APEX apps, a real improvement for change management and team collaboration.
- **From scratch is viable, but you opt in.** Building without the "Create App" wizard means a few conveniences it would generate for you, such as the sign-in page, are things you add deliberately. Worth knowing before you start.
- **Validate, then trust.** The compile/validate gate plus Oracle's official examples removed almost all the guesswork.
- **Verify in the browser, not just at compile time.** A couple of issues only appeared when we actually clicked through the live app, so we did exactly that, and fixed them.
- **Reuse what the platform already offers.** We connected the chatbot to Claude through a capability the APEX environment already supported, which kept setup to a minimum.
- **Treat the AI like a disciplined teammate.** Brainstorm, plan, build in small verified steps, debug methodically. The structure is what makes it productive rather than chaotic.

## Overall Impression

The combination of **APEX 26.1, APEXlang, and Claude Code** is the most modern Oracle development workflow we've used. APEX is still a remarkably fast way to ship data-rich enterprise applications; APEXlang finally makes those applications behave like real source code; and an agentic assistant turns the documentation, the samples, and the validator into a quick, reliable feedback loop. What impressed us most was the speed: Claude Code picked up APEXlang (a brand-new specification language) almost immediately, and took us from a blank slate to a deployed, working application in a single focused effort. It has been genuinely solid in testing.

> APEX gets you to a working app fast; APEXlang makes it real software; and an AI teammate makes the whole loop quick.

## What This Means for Our Clients

This is the part we're most excited about. For the organizations we work with, the combination of APEX 26.1, APEXlang, and an agentic assistant translates into faster delivery, cleaner change management, and a practical path to weaving modern AI into the Oracle systems they already run. Many of our clients are still on earlier releases, and once they upgrade to 26.1 they inherit this same workflow, so we genuinely can't wait to show them just how quickly they'll be able to release new functionality. We're excited about where this is heading, and we're already putting it to work.

---

**Curious what this could do for your team?** JMJ Cloud helps organizations build and modernize on Oracle APEX, now with AI woven in. If a Claude-powered APEX application sounds useful for your business, [let's talk](/contact).
