---
title: "The JMJ Cloud Software Factory"
date: 2026-07-03
author: "JMJ Cloud"
summary: "AI coding agents did not just make developers faster. They broke the economics of the 40-hours-a-week staffing model that most Oracle EBS and Fusion ERP customers still pay for. Here is how our software factory delivers in weeks what hourly teams deliver in months, and why we can afford to bill in 30-minute increments with no minimum commitment."
tags:
  - "AI-Assisted Development"
  - "Oracle EBS"
  - "Oracle Fusion Cloud ERP"
  - "Software Factory"
  - "Claude Code"
  - "Consulting Model"
draft: false
---

*A follow-up to [Build vs. Buy in the Age of AI](/blog/build-vs-buy-age-of-ai), for IT leaders who already build and are wondering why it still costs so much.*

---

## The Friday Invoice

If you run Oracle E-Business Suite or Fusion Cloud ERP, there is a good chance you also run a staffing arrangement that looks like this: a contract team, often offshore, billing 40 hours per person, every week, all year. The invoice arrives with the reliability of a heartbeat. The backlog of extensions, interfaces, conversions, and reports does not shrink with anything like the same reliability.

Ask yourself one question about last month's invoices: what shipped?

If the answer takes longer to work out than the invoice took to approve, this article is for you.

## You Are Not Paying for Software. You Are Paying for Time.

Let me be clear about what the problem is not. It is not the developers. Most contract and offshore engineers are capable people doing honest work inside a model that wastes them.

The problem is the model. An hourly staffing arrangement sells time, so time is what gets produced. Every incentive in it points away from finishing:

**Nobody is rewarded for being fast.** If a developer finishes in 10 hours what was estimated at 40, the arrangement loses revenue. You will rarely see that happen twice.

**Rotation resets the clock.** Contract teams churn. Every new developer spends billable weeks relearning your instance, your customizations, and your naming conventions, knowledge the last developer took with them.

**Process is billable.** Status calls, standups, weekly reports, re-estimation meetings. All of it lands on the same invoice as engineering.

**Requirements are discovered through rework.** In the hourly model, coding starts early because billing starts when coding starts. Misunderstandings surface in testing, and fixing them is billed again.

None of this is a scandal. It is just what the incentives produce. For twenty years it was also the only option, because software was so labor-intensive that renting labor by the hour was the rational way to buy it.

That era is over.

## What Changed

In [Build vs. Buy in the Age of AI](/blog/build-vs-buy-age-of-ai) I wrote about how AI-assisted development collapsed the cost of building custom software. Since then the tools have moved again. Claude Code and Codex are not autocomplete. They are coding agents: they read an entire codebase, plan a change, write the code, run the tests, and document what they did. One senior engineer can direct several of them in parallel.

But here is what the hype coverage misses: a raw coding agent, pointed at an Oracle ERP environment with no preparation, produces generic code that ignores your standards and your instance realities. The agent is an engine. The value is in the factory built around it.

We spent the last two years building that factory. Here is how it works.

## The Factory Starts with Requirements

This is the most counterintuitive lesson we have learned, so I will state it plainly: **when building software becomes ten times faster, requirements become the most important phase of the project.**

When code took months to write, a misunderstood requirement was one problem among many. When code takes days to write, building the wrong thing is the dominant risk left. AI agents amplify whatever you feed them. Feed them a precise specification and they produce exactly what you asked for at remarkable speed. Feed them ambiguity and they produce the wrong thing at remarkable speed.

So the deepest human expertise in our factory is concentrated at the front. Before an agent writes a line, a senior Oracle architect sits with your team and interrogates the requirement the way only someone with decades of EBS and Fusion experience can: Which module does this really live in? What happens at period close? Which of the four ways to integrate with Fusion is right for this volume? What does the exception path look like when a supplier site is end-dated mid-cycle?

The output is a written specification: scope, data contracts, acceptance criteria, error handling, and a test plan. That document is not paperwork. It is executable direction for the agents, and it is the single biggest reason our projects do not loop through rounds of rework.

Notice the inversion. The hourly model rushes past requirements to start the billing clock, then pays for the misunderstanding later, on your invoice. The factory model spends its most senior hours on requirements precisely because everything downstream is now fast.

## The Factory Floor Is a GitHub Repository

The second foundation is one most ERP shops have never been given: a properly engineered repository.

It still surprises people outside the Oracle world, but an enormous amount of EBS custom code lives on the server it runs on, or in a shared folder called something like `FINAL_v3`. No history, no review trail, no way to know what changed or why. You cannot run a factory on that floor.

So before agents build anything, we set up the workshop:

- **Everything under version control.** Your CEMLI objects, PL/SQL packages, APEX applications, OIC integrations, and conversion scripts go into a GitHub repository you own, with full history from day one.
- **Context the agents can read.** The repository carries structured guidance files describing your instance topology, naming standards, patch levels, and environment quirks, so every agent starts every task already knowing your landscape instead of billing hours to rediscover it.
- **Our skills library.** Twenty-five plus years of Oracle delivery standards, CEMLI patterns, Fusion REST and BIP integration approaches, APEX and PL/SQL conventions, encoded as reusable instructions the agents must follow. Standards stop living in people's heads.
- **Pipelines and gates.** Automated tests, CI/CD deployment, and pull-request review gates, so nothing reaches your environment without passing checks.

This setup is not overhead. It is a permanent asset. Every future work item moves faster because the floor is already built, and if we disappeared tomorrow, you would keep the repository, the history, and the documentation. Compare that to what you keep when an offshore contract ends.

## How a Work Item Moves Through the Factory

![The JMJ Cloud Software Factory pipeline: requirements and specification, parallel agent build, agent cross-review, verification and testing, then delivery, with senior Oracle engineers directing every station and the GitHub repository as the foundation](/images/blog/software-factory/factory-pipeline.svg)

With the spec written and the repository in place, delivery looks like this:

**Agents build in parallel.** Multiple coding agents work the spec simultaneously. Through MCP connections to your development environment they see live database schemas and ERP REST APIs, so they verify their work against reality as they build, not in a test phase weeks later.

**Agents review agents.** Every piece of code is adversarially reviewed by a second agent whose only job is to find problems with the first one's work. Tests are mandatory, not aspirational.

**A senior engineer is the final gate.** Nothing ships until an experienced Oracle engineer has reviewed and approved it. The agents multiply our engineers; they do not replace their judgment.

**Delivery is automated.** Code moves through CI/CD with documentation generated alongside it, not promised for later.

Every hour on our invoice is an engineering hour applied to your deliverable. There is no ramp-up tax, no rotation churn, and no standup billed at a blended rate.

## The Math

Consider a representative work item, and I want to be explicit that this is an illustrative scenario, not a specific client engagement: a mid-size integration between Fusion Cloud ERP and a warehouse system, or an EBS extension with a couple of forms and a workflow.

Under a typical hourly arrangement, that is two to three offshore developers over roughly six months. Call it 1,500 billed hours before your own team's meeting time.

Through the factory, the same item is a spec week followed by roughly two weeks of build, review, and deployment. About three weeks, end to end, led by senior engineers.

![Illustrative delivery timeline comparison: a typical hourly offshore team takes about 26 weeks for a representative ERP work item, while the JMJ Software Factory takes about 3 weeks](/images/blog/software-factory/delivery-timeline.svg)

Ten times faster is not a slogan. It is what happens when you remove everything from the process that was only ever there because someone was billing for it.

## Quality Goes Up, Not Down

The reasonable objection: surely this speed costs quality. In a factory, the opposite is true.

**Standards are enforced by construction.** Encoded conventions mean the five-hundredth package looks like the first. Consistency is no longer a function of who happened to be staffed.

**Everything is reviewed twice.** An adversarial agent review plus a senior engineer review on every deliverable is more scrutiny than most traditional teams can afford on any deliverable.

**Tests always exist.** No one skips the test suite to protect a deadline, because writing the test suite no longer threatens the deadline.

**Documentation is a by-product, not a promise.** It is generated with the code, in the repository, where the next person can find it.

Set that against the hourly alternative you may be living with: standards in people's heads, reviews when time permits, tests when the schedule allows, and documentation as a line item that never quite gets prioritized.

## Our Billing Model Is the Proof

Here is where I will let our contract make the argument.

JMJ Cloud has **no minimum commitments**. We bill in **30-minute increments**. When nothing is in flight, you pay nothing.

![Billing model comparison: the retainer model bills fixed 40-hour blocks every week regardless of output, while the factory model bills small 30-minute increments only when work is delivered, with no minimum commitment](/images/blog/software-factory/billing-model.svg)

We can only afford to bill this way because the factory works. If we were slow, 30-minute increments with no committed hours would put us out of business in a quarter. A firm that bills 40 hours a week, every week, whether or not anything ships, is making the opposite bet, and its incentives follow.

When you evaluate any development partner, look at their billing model before their slide deck. It tells you what they are optimizing for.

## Benchmark Us

If you are paying for 40 hours a week, every week, here is a low-risk experiment: pick one real item from your backlog. A report, an interface, an extension that has been "in progress" for a while. Give it to us with no commitment beyond that item, and compare the outcome, the timeline, and the invoice against your current arrangement.

That comparison is the entire pitch. [Get in touch](/contact) and we will scope it in days, not weeks.
