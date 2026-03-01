---
title: "Make Claude Code Your Most Productive Oracle EBS Developer"
date: 2026-03-01
author: "JMJ Cloud"
tags: ["Oracle EBS", "Claude Code", "AI-Assisted Development", "PL/SQL", "Monorepo", "Edition-Based Redefinition", "ORDS", "Oracle APEX"]
summary: "How consistent structure, embedded standards, and 143 context files turn Claude Code into an expert on your Oracle EBS extensions and integrations, no database connection required."
---

*It starts with how you structure the repo.*

## The Problem Every Oracle EBS Team Knows

If you've ever worked on an Oracle E-Business Suite project, you already know the pain.

Custom extensions and integrations are scattered across developer laptops, shared drives, and that one DBA's home directory. Half the custom PL/SQL packages have no version history. The staging table someone created two years ago has no comments, no documentation, and the person who built it left the company. When a new developer joins, onboarding takes months, not because the technology is hard, but because the knowledge of *how we do things here* lives in people's heads.

And then there's the AI problem. You try using an AI coding assistant and it produces generic PL/SQL that violates every standard your team has established. Wrong naming conventions. No logging. No exception handling. No understanding of your extension architecture. The AI doesn't know that you use Edition-Based Redefinition for zero-downtime deployments, or that your custom tables live in a separate schema from your business logic. It can't know, because that context doesn't exist in a structured form anywhere.

The problem isn't the AI. The problem is that your custom codebase isn't organized in a way that gives AI the context it needs.

This is the story of how we solved both problems at once by building a monorepo architecture for our Oracle EBS extensions and integrations that serves humans *and* AI equally well, and how that architecture turned Claude Code from a generic PL/SQL assistant into a genuine expert on our custom development.

---

## What Changes When You Get This Right

### For Your Development Team

**Faster onboarding.** A new developer clones the repo, reads the `DEVELOPER_GUIDE.md`, and has everything in one place. With Claude Code, they can ask questions about the codebase and get accurate, grounded answers.

**Consistent code quality.** Every custom procedure has logging. Every exception is handled. Every SQL statement uses bind variables. Not because developers memorize the rules, but because Claude Code applies them automatically.

**Concrete numbers from our experience:**
- New table creation (4 files): ~2 minutes with Claude Code vs. ~20 minutes manually
- New conversion package (spec + body + logging + error handling): ~5 minutes vs. ~2 hours
- Code review turnaround: reduced by roughly 40% (fewer standards violations to catch)

### For IT Management

**Audit compliance.** Every custom database object is in Git with full version history. When auditors ask "show me the change history for this extension package," you run `git log` instead of scrambling through email threads.

**Knowledge retention.** When a developer leaves, their knowledge of your custom extensions doesn't leave with them. It's encoded in the `CLAUDE.md` files, the package specs, and the commit history. Claude Code can answer questions about their code as effectively as they could.

**Faster issue resolution.** When a production issue comes in involving custom extensions, the traditional approach is painful: manually tracing through custom package bodies, cross-referencing table definitions, and hunting across files to understand what the code is supposed to do. With a structured monorepo, you can describe the error to Claude Code and it already understands the full context: which custom packages are involved, how the data flows through your extensions, what the table structures look like, and what the expected behavior should be. Instead of spending an hour reading code across a dozen files, Claude Code can pinpoint the likely cause in minutes. Support goes from an archaeology exercise to a conversation.

### For the Business

**Faster feature delivery.** Claude Code generates the extension boilerplate, the deployment scripts, and the test scaffolding. The team spends more time on business logic and less time on infrastructure.

**Reduced risk from staff turnover.** A well-structured monorepo of your custom extensions with embedded AI context is an asset that appreciates over time. Every new extension project adds to the repository's value. Every `CLAUDE.md` makes Claude Code more effective across the entire codebase.

**A new role for your Oracle developers.** The developers who know your EBS environment best shouldn't be spending their days writing boilerplate PL/SQL. They should be transitioning into Oracle Prompters: specialists who use their deep domain knowledge to guide AI and multiply their output. With a structured monorepo and Claude Code, your most experienced developers go from writing one package at a time to directing the creation of entire projects. That's not incremental improvement. That's 10X productivity.

---

## How We Built It

Here's how the architecture works, from the central idea down to the deployment pipeline.

### The Central Idea: Structure for Humans AND AI

**If you structure your custom Oracle EBS extensions so that an AI assistant can read a few files and instantly understand your entire architecture, naming conventions, coding standards, and deployment process, then that same structure will also make your human developers dramatically more productive.**

Our monorepo contains 144 Oracle EBS extension and integration projects: custom conversions, interfaces, reports, APEX applications, and REST APIs that extend EBS functionality. Each project follows an identical directory structure. Each project has a `CLAUDE.md` file, a structured context document that describes the project's architecture, packages, tables, views, data flows, and development patterns. At the repository root, a master `CLAUDE.md` defines universal standards: naming conventions, SQL formatting rules, table creation procedures, security requirements, and performance patterns.

When Claude Code opens any project, it reads the root `CLAUDE.md` and the project-level `CLAUDE.md`. In seconds, it understands what schema owns what objects, how to name a new table, the exact 4-step deployment process for creating a table with EBR, what logging framework to use, and every package, view, and table in the current project.

Claude Code doesn't connect to the database. It doesn't need to. **The repository IS the context.**

![Claude Code Context Flow](/images/blog/oracle-ebs-monorepo/01-context-flow.svg)

This isn't a documentation exercise. It's an architectural decision. The `CLAUDE.md` files are consumed by AI on every single interaction. They're coding standards that enforce themselves.

---

### The Four-Schema Architecture

Oracle EBS R12.2 ships with a sprawling APPS schema. When you build custom extensions and integrations on top of EBS, you need a clean separation between your custom data, your business logic, your UI, and your APIs. We use four schemas:

| Schema | Purpose | What Lives Here |
|--------|---------|-----------------|
| **XXCUS** | Custom data storage | Staging tables, conversion tables, extension tables |
| **APPS** | Custom business logic | PL/SQL packages, database views, EBS API wrappers |
| **XXAPX** | Custom APEX applications | APEX app schemas, UI packages |
| **XXORDS** | Custom REST APIs | ORDS modules, REST handlers, OAuth clients |

The separation matters for security (each schema gets only the privileges it needs), deployment (you can deploy custom APEX apps independently of PL/SQL extensions), and comprehension (when you see a table in XXCUS, you know it's custom extension data, not business logic masquerading as storage).

![Four-Schema Architecture](/images/blog/oracle-ebs-monorepo/02-schema-architecture.svg)

XXAPX never touches XXCUS directly; it goes through APPS. XXORDS calls APPS packages for all business logic. This means your custom REST APIs, your APEX applications, and your batch jobs all execute the same validated, logged, secured PL/SQL code. One custom package serves all channels.

Why four schemas instead of just dumping everything into APPS? **Security isolation:** if an APEX vulnerability is exploited, the attacker's access is limited to what XXAPX can see. **Deployment independence:** you can redeploy an APEX application without touching PL/SQL packages. **Clarity:** the schema name is metadata.

The data access chain uses Oracle's Edition-Based Redefinition infrastructure:

![EBR Data Access Chain](/images/blog/oracle-ebs-monorepo/03-ebr-chain.svg)

XXAPX accesses a synonym, which points to a synonym in APPS, which points to the edition view in XXCUS (the `#` suffix), which sits on top of the base table. This chain enables zero-downtime patching. Oracle can create a new edition of the view while the old edition continues serving traffic.

For Claude Code, this architecture is gold. When it sees a custom table reference in PL/SQL code, it knows to look in `XXCUS/TABLES/` for the DDL. When it sees a custom package call, it knows to look in `APPS/PLSQL/`. The four-schema model is simple enough to encode in a `CLAUDE.md` file, and Claude Code applies it correctly every time.

---

### One Repo, 144 Projects, Zero Ambiguity

All of our custom extensions and integrations live in a single Git repository. 144 projects. Every data conversion, every third-party integration, every custom APEX application, all in one place. To be clear: this is not Oracle EBS source code. This is the custom code our team has written to extend EBS functionality and integrate it with other systems.

```
oracle-ebs/
├── CLAUDE.md                    # Universal standards (naming, SQL, deployment)
├── DEVELOPER_GUIDE.md           # Onboarding and workflow documentation
├── projects/
│   ├── conversion-project/      # Custom data conversion
│   ├── manufacturing-ops/       # Custom manufacturing extensions
│   ├── benefits-outbound/       # Custom benefits interface
│   ├── tax-integration/         # Custom tax engine integration
│   ├── template/                # Scaffold for new projects
│   └── ... (139 more projects)
├── shared/                      # Reusable custom packages (logger, utilities, email)
│   ├── APPS/PLSQL/              # Shared custom APPS packages
│   ├── XXAPX/                   # Shared custom APEX packages
│   └── XXORDS/                  # Shared custom ORDS utilities
└── scripts/                     # Database extraction and sorting tools
```

Every project follows the same skeleton:

```
[project]/
├── CLAUDE.md                     # AI context: architecture, objects, data flow
├── README.md                     # Human documentation
├── APPS/
│   ├── PLSQL/                    # Custom PL/SQL packages (*_PKS.sql, *_PKB.sql)
│   ├── VIEWS/                    # Custom database views (*_VW.sql)
│   └── FNDLOAD/                  # EBS config (menus, responsibilities)
├── XXCUS/
│   └── TABLES/                   # Custom table DDL (*_00.sql)
├── XXAPX/
│   └── APEX/                     # Custom APEX application exports
├── XXORDS/                       # Custom REST handler definitions
└── PATCHES/
    └── [TICKET]/V1/              # Versioned deployment scripts
```

This structure is identical across all 144 extension projects. When Claude Code opens a project it has never seen before, it already knows the layout. Custom package specs are in `APPS/PLSQL/`, custom tables are in `XXCUS/TABLES/`, custom views are in `APPS/VIEWS/`. No guessing, no exploring, no wasted context window.

The real power is compound learning. Claude Code learns the pattern once from the root `CLAUDE.md` and applies it everywhere. Ask it to "create a staging table for the benefits interface" and it produces a custom table DDL with the correct naming (`XXCUS_BEN_[NAME]`), in the correct directory, with the correct file suffix, identity columns, timestamps, comments, and the right tablespace, because those rules are universal across all your extensions.

---

### Zero-Downtime Table Deployment in Four Steps

Creating a custom table in Oracle EBS R12.2 isn't just a `CREATE TABLE` statement. Because of Edition-Based Redefinition, you need four coordinated scripts across two schemas, executed in a specific order. Get the order wrong and you break the edition view chain.

![4-Step Table Creation Pipeline](/images/blog/oracle-ebs-monorepo/04-table-creation-pipeline.svg)

**Step 1: Create Table** (run as XXCUS): the base table DDL with identity columns, timestamps, and comments.

**Step 2: Create Edition View** (run as APPS): `ad_zd_table.upgrade()` creates the edition view with the `#` suffix.

**Step 3: Grant to APPS** (run as XXCUS): grants on both the table *and* the edition view (note the `#` suffix; miss this and APPS can't see the table through the EBR chain).

**Step 4: Grant to Other Schemas + Create Synonyms** (run as APPS): `ad_zd.grant_privs()` for each target schema, then create synonyms.

Before AI assistance, developers frequently got this wrong. With Claude Code, you say: "Create a staging table called `XXCUS_CNV_FILES` with columns for file_id, file_name, file_content, and status." Claude Code generates all four scripts, correctly named, in the correct directories, with the correct schemas, grants, and synonym, because the 4-step process is documented in the root `CLAUDE.md`.

One request. Four files. Zero errors.

---

### Standards That Enforce Themselves

Most Oracle EBS extension teams have coding standards. They live in a wiki or a PDF that nobody reads after onboarding week. We put our standards in `CLAUDE.md`. Because Claude Code reads it on every interaction, the standards are enforced at write time, not review time.

**Naming conventions** are defined once in the root `CLAUDE.md`. Tables use `XXCUS_[MODULE]_[NAME]`, packages use `XXCUS_[MODULE]_[NAME]_PK`, variables use `l_` for locals, `p_` for IN parameters, `x_` for OUT parameters. Claude Code applies them automatically, eliminating an entire category of code review feedback.

**Logging** uses a structured pattern with `logger.log_info()` at entry, parameter logging via `logger.add_param()`, and `logger.log_error()` with full backtrace in exception handlers. Claude Code produces this pattern automatically and never forgets the `utl_call_stack.subprogram(1)(2)` call for scope resolution.

**Security** means all dynamic SQL uses bind variables. Claude Code has been told (through `CLAUDE.md`) to never concatenate user input into SQL strings. It generates secure code by default.

**Performance** means bulk operations use `BULK COLLECT` with `LIMIT 1000` and `FORALL` for batch DML. Claude Code doesn't generate row-by-row loops for large datasets, because `CLAUDE.md` explicitly marks that as the anti-pattern.

The key insight: **standards in a `CLAUDE.md` file are consumed by AI on every interaction. Standards in a wiki are consumed by humans during onboarding and then forgotten.** The former enforces itself.

---

### No Database Required

**Claude Code never connects to the database.** It has no credentials. It can't query `DBA_OBJECTS` or `ALL_TAB_COLUMNS`. And yet it produces correct, standards-compliant custom extension code, because the repository gives it everything it needs.

| Source | What Claude Code Learns |
|--------|------------------------|
| `XXCUS/TABLES/*_00.sql` | Custom table structures, column names, data types |
| `APPS/PLSQL/*_PKS.sql` | Custom package interfaces and parameters |
| `APPS/PLSQL/*_PKB.sql` | Custom implementation patterns |
| `APPS/VIEWS/*_VW.sql` | Custom view definitions and joins |
| Root `CLAUDE.md` | Universal extension coding standards |
| Project `CLAUDE.md` | Project-specific architecture and inventory |

A developer says: "Create a custom staging table for purchase order receipts with columns for receipt number, PO number, quantity, receipt date, and status. Then create the conversion package with stage, validate, and convert procedures." Claude Code reads the project's `CLAUDE.md`, sees existing extension patterns, and produces the custom table DDL, all four deployment scripts, the package spec, and a full package body with logger calls, parameter logging, exception handling, and BULK COLLECT, all from that one sentence.

The repository *is* the knowledge base. The DDL files *are* the data dictionary. The `CLAUDE.md` files *are* the institutional knowledge.

This has a profound implication: **any Oracle EBS team can adopt this approach for their custom extensions without giving AI access to their database.** No security review for database credentials. No network access rules. No Oracle source code involved. Just a well-organized Git repository of your custom code with embedded context files.

---

### Keeping Git in Sync with the Database

The monorepo only works if it reflects reality. We use a two-step extraction pipeline:

![Database-to-Git Extraction Pipeline](/images/blog/oracle-ebs-monorepo/05-extraction-pipeline.svg)

**Step 1: Extract.** A SQLcl script connects to the database and uses `DBMS_METADATA` to extract DDL for all custom extension objects (not Oracle's base objects). The raw DDL goes into a `staging/` directory organized by schema and object type.

**Step 2: Sort.** A Python script reads the staging directory and distributes each object to the correct project folder using prefix matching. `XXCUS_CNV_*` goes to the conversion project, `XXCUS_MANU_*` goes to manufacturing. Longest prefix match wins. The sorter also cleans up the raw DDL: removing `EDITIONABLE` and `FORCE` keywords, stripping double-quoted identifiers, and adding `-- Run As:` header comments.

Files that already exist in the repo are never overwritten. The extraction only adds new objects. This prevents accidental regression of hand-tuned code.

---

### From Developer Branch to Production

![Branch and Deployment Strategy](/images/blog/oracle-ebs-monorepo/06-branch-deployment.svg)

The deployment order matters. Tables must exist before edition views can be created. Grants must be applied before synonyms work. Package specs must compile before bodies. Views depend on tables and packages. APEX applications depend on everything above them.

This order is documented in both the `DEVELOPER_GUIDE.md` and the root `CLAUDE.md`. When Claude Code generates deployment scripts for a new feature, it numbers them correctly and places them in the right `PATCHES/TICKET/V1/` directory. The versioned patch directory provides a clear audit trail. If a deployment needs a second attempt, you create `V2/` with the corrected scripts rather than modifying `V1/`.

---

## How to Start Building Your Own

You don't need to reorganize 144 projects overnight. Start small, prove the value, and expand.

1. **Create your root `CLAUDE.md`.** Define your extension schema architecture, naming conventions, PL/SQL templates, table creation process, and deployment order. Start with 100 lines.

2. **Structure one extension project.** Take your most active custom project and reorganize it into the standard directory layout. Create a project-level `CLAUDE.md` that describes its architecture, packages, tables, and data flow.

3. **Extract your custom database objects.** Write a SQLcl script that pulls DDL for your custom objects using `DBMS_METADATA`. Place the output in the correct project directories.

4. **Create a template.** Strip project-specific details and replace them with placeholders. This becomes the scaffold for every future extension project.

5. **Expand.** Repeat for remaining extension and integration projects. Each one makes Claude Code more effective. It sees more patterns, more conventions, more examples of how your team extends EBS.

The first project takes the most effort. The second takes half the time. By the fifth, you'll have a `CLAUDE.md` template that takes 15 minutes to populate and a Claude Code assistant that generates correct, standards-compliant extension code from a single sentence.

---

## The Bottom Line

A monorepo for your Oracle EBS extensions and integrations with embedded AI context isn't just a better way to organize custom code. It's a fundamentally different relationship between your team, your codebase, and your AI assistant.

The structure you build for human comprehension (consistent directories, clear naming, explicit standards) is exactly the structure that makes AI effective. The `CLAUDE.md` files you write to describe your extension architecture become the context that turns Claude Code from a generic PL/SQL writer into your team's expert on your custom EBS development.

Claude Code doesn't need a database connection. It doesn't need DBA credentials. It doesn't need access to Oracle's source code. It just needs a well-organized repository of your custom extensions with clear, consistent, embedded context.

144 extension and integration projects. 143 context files. One set of standards. And an AI assistant that applies them all, every time, without being reminded.

That's the architecture. Start building yours.
