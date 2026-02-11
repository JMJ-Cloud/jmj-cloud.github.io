---
title: "Talk to Your ERP: How OIC Gen 3 MCP Servers Could Streamline Oracle ERP Administration"
date: 2026-02-10
author: "Matt Paine"
tags: ["Oracle", "OIC", "AI", "MCP", "ERP", "Integration", "OCI", "Fusion", "Automation"]
summary: "With Oracle Integration 3 (Gen 3) projects now configurable as MCP servers, the pieces are coming together for agentic AI to handle the repetitive orchestration of ERP operations. This post explores what becomes possible when you connect conversational AI to your Oracle Financials environment."
---

If you've spent any time administering Oracle Fusion Financials, you know the reality: most of the job isn't complex decision-making. It's orchestrating the same set of ERP operations, over and over, with different parameters and judgment calls. Check period statuses. Triage journal errors. Monitor integrations. Run reports. Resubmit failed files. Navigate screen after screen after screen.

That pattern of repetitive orchestration with occasional human judgment is exactly what agentic AI is built for. And with Oracle Integration 3 (Gen 3) projects now configurable as MCP (Model Context Protocol) servers, allowing integrations to be registered and discovered as agentic AI tools, the pieces are starting to come together.

## What Would This Actually Look Like?

It's worth noting that Oracle ERP Cloud already has built-in AI capabilities for querying and assistance, as do Fusion Data Intelligence and EPM.

Oracle has also introduced AI Agent Studio for Fusion Applications, which is included at no additional cost with your Fusion subscription. It builds on a growing library of pre-built agents across ERP, HCM, SCM, and CX, and Oracle has previewed finance-focused agents such as a Ledger Agent and Payables Agent. Recent updates have also highlighted support for MCP and agent-to-agent collaboration patterns, multiple LLM options, and workflow checkpoints with human approvals. Oracle is clearly heading in this direction at the application layer.

What OIC adds to the picture is the ability to take controlled actions beyond what's available within Fusion's own boundaries, and to combine data sets across modules or systems that don't natively talk to each other. Querying is one thing. Acting on the result, or joining data from ERP with data from a third-party system to answer a broader question, is where OIC as the agent's toolbox comes in.

Forget the hype for a moment. Think about what a Finance System Admin actually does in a typical week, and imagine having a conversational agent that can execute against your ERP on your behalf.

### Period Close

This is the obvious first use case. Today, checking close readiness means navigating through multiple Fusion screens: period statuses across ledgers and subledgers, unposted journals, pending imports, open AP and AR items. It's a checklist, but working through it takes time.

Now imagine asking: *"How's the January close looking?"* and getting a plain-English answer. "AP and AR are closed for the primary ledger. GL has 14 unposted journals and 3 pending imports still running. The reporting ledger is waiting on the intercompany elimination." Then: *"Close AP for January in the reporting ledger"* and it does it, with your confirmation.

Better still, the agent runs the close checklist autonomously overnight and messages you in the morning with what's done and what's blocked.

### Journal Error Triage

Instead of logging into Fusion, navigating to the GL Interface screen, filtering for errors, reading cryptic validation messages, and cross-referencing with source data, you just ask: *"What failed today and why?"*

The agent queries the interface tables, groups errors by type, and tells you: "14 lines failed CCID validation because cost center 4520 doesn't exist in the target chart of accounts. 3 lines have an invalid period. 2 lines have a missing journal source." Then it offers to create the missing code combination or correct the period. What currently takes 30 minutes of screen navigation becomes a two-minute conversation.

### Integration Monitoring

*"Any OIC failures since yesterday?"* pulls all instance statuses, groups by integration, and summarizes. *"Resubmit the source file that failed at 3am"* and the agent finds the instance, identifies the file, and retriggers. Today that means logging into the OIC console, filtering instances, opening the failed one, reading the error, deciding the action, and navigating to resubmit.

The agent could also be proactive, running on a schedule and messaging you on Teams or Slack when something fails, with context already gathered before you even look at it.

### Natural Language Reporting

*"What's our unreconciled cash position across all bank accounts?"* or *"Show me AP invoices over 50K pending approval for more than 5 days."*

These are queries that admins run constantly, but they require either OTBI expertise or pre-built reports with specific parameters. BI Publisher itself isn't exposed as an MCP server, but OIC integrations can wrap BI report calls, accepting parameters and returning results. Expose those wrapper integrations as MCP tools, and the agent picks the right one, sets the parameters from your question, runs the report, and summarizes the output. You never open the report catalog.

### Reconciliation

*"Compare AP subledger to GL control account for January"* requires pulling data from two different places, matching, and identifying breaks. An agent with access to both the GL balances API and AP reporting could do this comparison and hand you just the discrepancies. Same idea for intercompany: *"Show me unmatched IC transactions between these two ledgers"* becomes a question rather than a half-day exercise.

## The Architecture: OIC as a Toolkit, AI as the Orchestrator

The key architectural insight is about granularity. You wouldn't expose a single massive "do everything" integration as an MCP tool. Instead, you build small, focused integrations (check period status, get journal errors, run a specific report, create a code combination, submit a journal import, check an ESS job status) and let the AI agent compose them together based on what you're asking.

OIC becomes a toolkit of atomic finance operations. The AI agent becomes the orchestrator that the admin used to be.

This depends on having a skilled OIC resource building out that set of integrations. These are the tools and skills that ultimately control what data the agent has access to and what actions it can perform. Getting the scope, error handling, and guardrails right on each integration is what makes the difference between a useful agent and a dangerous one. The AI layer is only as good as the OIC integrations underneath it.

OIC Gen 3's AI Agents feature supports this direction with a clear set of building blocks: integrations registered as tools within an MCP-enabled project, configurable "thinking patterns" for multi-step tasks, LLM configuration, and the agent itself with its system prompt and behavioral rules.

## The Elephant in the Room: Security

Every one of these use cases sounds good on paper, right up until someone asks: *"So are we sending our financial data to ChatGPT?"*

That question stops most AI-in-finance conversations, and rightly so. Sending general ledger data, bank account details, AP invoices, or employee cost allocations to a third-party LLM isn't going to fly for any serious finance organization, let alone one subject to SOX compliance or financial services regulation.

The cleanest answer is to keep the inference and orchestration within Oracle's infrastructure using **OCI Generative AI Service**.

### Why OCI Generative AI?

OCI Generative AI enables LLM inference within OCI's cloud boundary. The flow can be designed so that:

1. Your question goes to OIC
2. OIC invokes an agent configured to use OCI-hosted LLM inference
3. The agent decides which OIC integrations (MCP tools) to call
4. Those integrations talk to Fusion
5. Results come back to you

Staying within the OCI ecosystem often simplifies vendor risk assessments because there's no new third-party data processor to evaluate, though you'll still need to document the new data flow and controls under your organization's policies. For a Fusion shop, it's often the path of least resistance because you're extending an existing vendor relationship rather than introducing a new one.

### Network-Level Controls

OCI networking options, including Virtual Cloud Networks (VCNs), private connectivity patterns, and service gateways, can be configured to keep OIC-to-GenAI traffic off the public internet. OCI IAM policies can restrict GenAI endpoint access to specific OIC service accounts, with audit logging. OCI maintains third-party attestations and certifications (including SOC and ISO programs), and you can map your use case to those controls as part of your compliance evidence.

## Governance: What the Agent Can and Can't Do

### Securing the Integrations

OIC Projects provide a natural security boundary here. By organizing integrations into projects, you can apply Role-Based Access Control (RBAC) to determine which integrations, and therefore which MCP tools, are available to which users. A Finance Manager might have access to tools that query balances and run reports, while only a GL Administrator has access to tools that create code combinations or submit imports.

But this only secures the integration layer. You also need to be careful about who can access the agent itself. If someone can interact with an agent, they can potentially ask it to call any tool it's been configured with. The RBAC on the OIC project helps define what's callable, but access to the conversational entry point needs its own layer of control. Think of it as two gates: who can talk to the agent, and what the agent is allowed to do on their behalf.

Also, don't forget the real blast radius: the privileges of the credentials used to execute actions in Fusion (whether that's a service account, delegated user context, or a hybrid pattern). That's what ultimately determines what "actions" are possible.

### Tiered Autonomy

The practical governance framework needs clear tiers:

**Tier 1: Autonomous (no approval required).** Read-only operations: check statuses, run reports, query errors, list files, show period status. The agent executes these freely.

**Tier 2: Agent proposes, human confirms.** Low-risk write operations: create a code combination, resubmit a failed file, schedule a report. The agent says "I'd like to do X, confirm?" and you approve. Human-in-the-loop approvals are where enterprise comfort comes from.

**Tier 3: Agent not permitted.** High-risk operations: close periods, post journals, reverse entries, change security roles. The agent can gather the information and tell you what needs doing, but you perform the action yourself.

Every agent action needs to be logged: who asked, what was interpreted, which integrations were called, what data was accessed, what actions were taken. OIC already has instance tracking and activity logging. You extend that with agent request/response logging and tool invocation logs. For SOX-regulated environments, this audit trail is non-negotiable.

## The Conversational Interface: AI Agent Studio

Oracle's AI Agent Studio is the natural front end for this pattern. Included with your Fusion subscription, it provides the conversational interface directly within the Fusion experience, inheriting existing user identity, roles, and security context. Users interact with agents where they already work, without needing a separate tool or channel. Combined with OIC-backed MCP tools, Agent Studio gives you a complete stack: the conversation layer, the orchestration layer, and the integration layer, all within Oracle's ecosystem.

## Where This Is Heading

The technology is here now. OIC Gen 3 projects can be configured as MCP servers. OCI Generative AI provides a secure LLM layer. The AI Agents feature in OIC provides an orchestration framework with human-in-the-loop controls.

The real shift isn't about replacing the Finance System Administrator. It's about changing the interface from "navigate screens and click buttons" to "have a conversation and confirm actions." The judgment, business rules, context, and knowing what should happen and when, stays with the human. The tedious orchestration of ERP operations to execute on those decisions is what the agent handles.

And because OIC already connects to the wider ecosystem, this isn't limited to Oracle Financials. The same agent pattern opens the door to checking status and taking actions across systems: comparing a customer record in Oracle with opportunities in Salesforce, validating a purchase order against a warehouse management system, or checking inventory levels across multiple fulfillment platforms. OIC is already the integration layer for most of these connections. Making those integrations available as AI tools just changes how they get invoked.

The blocker for most organizations isn't technical. It's getting Information Security comfortable that "AI talking to our ERP" doesn't mean "our financial data going to ChatGPT." The OCI-native approach addresses that concern directly, because everything stays within Oracle's infrastructure boundary and can be mapped to existing compliance frameworks. And there's an upside here, too: if done right, agent-driven monitoring and notification can be positioned as an enhancement to your security posture. Proactive alerting on unusual journal patterns, automated close-readiness checks, and continuous compliance evidence gathering are all things security and audit teams typically want more of, not less.

The question isn't whether this will happen. It's whether you want to be building toward it now, or catching up later.

---

Matt Paine, Owner JMJ Cloud
