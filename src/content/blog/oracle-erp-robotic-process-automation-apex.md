---
title: "From RPA Bots to AI Agents: Why Oracle ERP Transactions Still Belong in APEX"
date: 2026-11-12
author: "JMJ Cloud"
tags: ["APEX", "Oracle ERP", "AI Agents", "RPA", "Automation", "E-Business Suite", "Integration"]
summary: "In 2020 the question was whether to buy an RPA bot. In 2026 it is whether an AI agent should do the work. Our answer has the same core: let an APEX page call the ERP's own APIs for the transaction itself, and use AI at the edges, where it reads, explains and drafts for a person to confirm."
---

*Originally published in 2020 by Jon Dixon. Rewritten in November 2026 for the move from RPA bots to AI agents.*

When we first wrote this post, the question we heard from Oracle ERP customers was "should we buy an RPA bot for this?" Robotic Process Automation was the new thing, and the pitch was attractive: record what a user does on screen, then let software repeat it.

Six years on, the question has changed to "should an AI agent do this?" Our answer has barely moved. For the transaction itself, an Oracle APEX page that calls the ERP's own APIs is still the right tool. What has changed is everything around the transaction, and that is where AI now earns its place.

This post keeps the worked example from the original, an item creation process in Oracle E-Business Suite (EBS), and then looks at where AI fits in 2026.

## The Problem Has Not Changed

ERP software has a huge amount of functionality, but it is geared toward the most common business processes. A common task like creating an item is broken into its component steps: create the item, assign categories, choose catalog values, create cross references. If you create hundreds of items a week, that is slow and error-prone work, and item creation is only one example.

## What an RPA Bot Does

If you have used automated testing tools such as Selenium or Cypress, you already understand RPA. A bot repeats what an end user does in the UI: button clicks, data entry and page navigation.

To onboard one user, you log in, navigate to the user entry page, enter the details, click Create User and navigate back. To onboard 100 users, the bot repeats the last three steps 100 times while reading from a file. There is no database connection, no code and no API to learn, which is why adoption looks easy.

## Why We Preferred APIs in 2020

We argued that bots fall short of an API-based solution in three areas. All three still hold.

**A changing UI.** Bots depend on a consistent UI: certain HTML tags, field IDs and labels. Oracle ERP Cloud releases new functionality every quarter, and those releases often change the UI. An API is not immune to change, but there is an assumed contract between the API's developer and its consumers, and developers break that contract at their peril.

**Performance and reliability.** A bot is only as fast and stable as the screen it drives. A five second delay after each Save adds up quickly at volume. If a page fails to load, the script fails, and someone has to work out where it stopped and restart it from the right place. An API returns a specific response that your code can handle directly, and many APIs offer bulk options that take thousands of records in one call.

**Cost and skills.** A bot may not need a developer, but it does need skilled people to keep it running, and it carries its own license. Weigh the cost of any automation against the cost of doing nothing, and ask whether your team can maintain it. Automation built on software that only specialists can support may end up costing more than the manual process did.

## The Worked Example: Item Creation in EBS

APEX is a low-code platform that is included with your Oracle Database license. On EBS it lives in the same database as the ERP, so it can call the EBS public APIs directly. For a cloud ERP, it calls REST services through `APEX_WEB_SERVICE` with stored credentials.

In this use case, the goal was to let a user create inventory items in EBS with as few manual steps as possible. Done by hand, the process looks like this:

1. Log in to EBS
2. Launch EBS Java forms
3. Choose an inventory organization
4. Navigate to the item entry form
5. Find the item to copy from
6. Create a new item as a copy
7. Update the item number and description of the new item
8. Navigate to the item category form
9. Assign the correct category to the item
10. Navigate to the item catalog form
11. Enter up to 5 catalog name and catalog value combinations
12. Navigate to the item cross references form
13. Create a cross reference for the new item
14. Repeat steps 4 to 13 for every item

We merged steps 4 to 13 into one APEX page.

The user chooses an inventory organization and can enter an item prefix to filter the source items. They then add source items, which already exist in EBS, to an interactive grid and set the target values for each one:

- **Item number:** typed in, or generated for all rows from an EBS document sequence with one button
- **Item template:** EBS items have hundreds of attributes, and the template sets them for the new item
- **Long description:** optional
- **Catalog values:** brought in from the source item, so the user only updates what differs
- **Cross reference:** a type and a value, for example a supplier's item number

All but two of these fields are optional, and users can upload items from Excel for bulk loads.

The entries are held in an APEX collection until the user clicks Copy Items. A PL/SQL package then calls the EBS public APIs in sequence, using the collection data as parameters:

- Item: `ego_item_pub.process_items`
- Category: `inv_item_category_pub.create_category_assignment`
- Catalogs: `inv_item_catalog_elem_pub.process_item_descr_elements`
- Cross references: `mtl_cross_references_pub.process_xref`

When the copy finishes, the page shows the result for each item, step by step, so users can see what completed and what failed.

## The 2026 Question: Should an AI Agent Do This?

There are two quite different things people mean by this question.

The first is an agent that operates the screens for you. Agentic tools can now drive a web browser, and unlike a recorded script they can read a page and adapt when a label moves. That softens the changing UI objection. It does nothing for the other two. The agent still works at the speed of the UI, one item and one form at a time, and it adds a new concern: a language model does not promise the same output for the same input. For a process that creates master data hundreds of times a week, we want the opposite. We want the same input to produce the same result every time, and a specific response from each API call that code can act on.

The second is an agent that calls tools. This is the direction the Oracle platform itself is taking. Oracle Integration 3 projects can be configured as MCP servers, so integrations become tools an agent can discover and call, which we covered in [From Screens to Conversations](/blog/talk-to-your-erp-oic-gen3-mcp-servers). APEX 26.1 added AI Agents and AI Tools, where an agent can act only through the tools the application approves.

Look closely at that second model and you find our 2020 argument sitting underneath it. The tool an agent calls is a small, deterministic piece of automation built on the ERP's own APIs. The PL/SQL package in the item example is exactly that kind of tool. The agent is only as good as what it is allowed to call, so the API-based automation is not replaced by the agent. It is the part that has to be built well first.

## Where AI Earns Its Place

Our position is that deterministic, API-based automation in the database stays in charge of the transaction, and AI adds value at the edges. We see four places where it does.

**Reading unstructured input.** For a manufacturing company, we used an AI document service to [extract data from tax exemption certificates](/projects/azure-tax-certificate-extraction) held as PDFs. More than 5,700 certificates are being processed at about 15 seconds each, with extraction confidence of 95 to 99%, and low-confidence results are flagged for a person to review. A bot could never read those documents. The AI reads them, and PL/SQL validates and stores the result.

**Explaining results.** In our [AI-assisted accrual automation for Oracle Fusion General Ledger](/projects/ai-accrual-automation-fusion-gl), fixed rules written in PL/SQL calculate every amount, so the same file always gives the same answer. An AI assistant sits beside the proposed journal and explains any line in plain words, naming the invoice or file behind each figure. That project is still in progress and has been tested on synthetic data so far.

**Answering questions.** Read-only questions are the safest place to start with an agent: what failed today, which records are waiting, what the status of a period is. APEX 26.1 applies the same thinking to reports, turning a plain-language request into visible, editable report settings.

**Drafting changes a person confirms.** In the accrual application, the assistant can prepare a change, but the page asks the analyst to confirm it, with a reason, before anything is recorded. The agent has 11 tools and none of them can reach Fusion. Asked to send the journal, it declines and points to the send button.

Applied to the item copy page, this suggests where we would add AI today, although we have not built these: reading a supplier's specification sheet to propose catalog values for the user to review, or turning an API error into a plain explanation of what to fix. The four API calls and the Copy Items button would stay exactly as they are.

## AI Also Changes the Cost of Building

In 2020, a fair objection to the APEX approach was that someone had to write the page and the PL/SQL behind it. AI coding agents have changed that. Our [software factory](/software-factory) uses them to build and review this kind of extension, with a senior Oracle engineer as the final gate before anything ships, so the deterministic automation we recommend is now much quicker to deliver.

## Conclusion

There is still a place for automating a UI: simple screens that rarely change, moderate volumes, and no API to call. ERPs rarely fit that description, whether the thing clicking the buttons is a script or a model.

Our advice in 2026 is to build the transaction once, on the ERP's own APIs, where it is fast, testable and repeatable. Then put AI where judgement about language helps: reading what arrives, explaining what happened, answering questions, and drafting changes for a person to confirm.

**Have a manual ERP process you are thinking of handing to a bot or an agent?** We can help you work out which parts belong in an API and which parts suit AI. [Let's talk](/contact).
