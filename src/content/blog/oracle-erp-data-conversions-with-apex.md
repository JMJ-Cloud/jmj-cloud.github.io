---
title: "Oracle ERP Data Conversions with APEX: The 2026 Guide"
date: 2026-11-12
author: "JMJ Cloud"
summary: "Spreadsheet-driven conversions into Oracle E-Business Suite and Fusion Cloud ERP fail for the same reasons they did in 2020, and the fix is still a repeatable load, validate, transform, submit and reconcile loop built in Oracle APEX. This guide brings our three-part series up to date with the toolset we use today, the real-world examples that proved the pattern, and what AI coding agents change."
tags: ["Oracle APEX", "Data Conversion", "Oracle E-Business Suite", "Oracle Fusion Cloud ERP", "FBDI", "AI-Assisted Development"]
---

*This guide replaces and updates our three-part 2020 series on ERP conversions with APEX.*

ERP systems are data hungry. They need feeding at go-live, again with every acquisition, and then every week when another system produces a file that has to land in Oracle. Back in 2020 we wrote the original series ([part 1](/blog/oracle-erp-conversions-apex-part-1), [part 2](/blog/oracle-erp-conversions-apex-part-2), [part 3](/blog/oracle-erp-conversions-apex-part-3)) on using Oracle APEX to take the pain out of that work. The pattern has held up well. The tools around it have moved, so here is the single, current version.

> **The short version**
>
> - Conversions fail in the **spreadsheet**, long before they fail in Oracle.
> - Load data only through Oracle's **standard entry points**: open interfaces and public APIs on EBS; FBDI, HCM Data Loader and business object web services on Fusion.
> - Put an **APEX application** in front of them that runs one loop: load, validate, cleanse, transform, submit, reconcile, repeat.
> - Make every run **repeatable**, so cutover is the fifth rehearsal and not the first attempt.
> - AI coding agents now write much of the validation, mapping and reconciliation code, **under senior review**.

## Why Spreadsheet-Driven Conversions Fail

You may think conversions only happen during an implementation. In practice, an organization that makes acquisitions can run them several times a year, and many companies upload data from other systems on a regular schedule. Most of that work still starts in Excel, and that is where it goes wrong:

- **Manual manipulation is slow and error-prone.** Trailing spaces, inconsistent date formats and blank mandatory fields creep in. Formulas drift out of sync and lookups quietly fail. Opening and re-saving a CSV file can corrupt date and number formats.
- **Mapping by lookup formula proves nothing.** VLOOKUP and INDEX/MATCH will fill in extra fields, but they do not guarantee that a value is valid or that every row found a match.
- **Local files are hard to secure and hard to share.** Spreadsheets holding sensitive data sit unencrypted on laptops and travel by email.
- **Validation depends on the environment.** Data that was correct against one environment's setup values may not be correct against the next.
- **Reconciliation is an afterthought.** Once the data has been sent, somebody has to prove that everything arrived and compare what was sent with what Oracle now holds.
- **The cycle is long.** Each round trip between the business user and IT involves several manual steps, so teams run fewer rehearsals than they should.

## The Conversion Toolset on E-Business Suite

On EBS there are two standard routes into the base tables: the **Open Interface tables** with their import concurrent programs, and the **public PL/SQL APIs**. Either way, EBS performs its own final validations before anything is committed.

The traditional process around them was a dance of eight steps: the user sends a file to IT, IT copies it to the server, runs SQL*Loader into a custom staging table, runs a validation program, sends a report back, the user fixes the file, and the whole thing repeats before the open interface is finally launched and its output is sent back for review.

How we choose between the two routes has not changed much:

- **Public APIs** give immediate success or failure for each record, but the user waits while every record is processed and there is a risk of a web server timeout. Our rule of thumb in the original series was to use them for loads of up to 10 thousand records.
- **Open interfaces** run in the background as a concurrent program, so the user can carry on working. We use them for larger loads. Most have a batch identifier column, which is how you find your own records and their errors afterwards.
- **SQL*Loader** still has a place for very high volumes (hundreds of thousands or millions of records), where direct path loading into staging tables is far faster than standard inserts.

## The Conversion Toolset on Fusion Cloud ERP

Fusion offers more tools, and choosing between them is half the job. Where we describe limitations below, they reflect our experience when the original series was written. Check each tool against your current release before ruling it in or out.

- **ADF Desktop Integration (ADFdi) spreadsheets.** Preconfigured Excel sheets for objects such as GL journals and AP invoices, with pre-validation and built-in lists of values. They suit small, occasional loads by end users. In our experience at the time they struggled with larger volumes, needed a local Excel add-in installed, and covered only certain business objects.
- **File-Based Data Import (FBDI).** Oracle's templates produce a zip of CSV files, which is loaded to the interface tables and then imported by scheduled (ESS) processes. The templates have many columns, most of them optional and some conditionally required, and there is no live validation as you type. FBDI is still our default for volume. Our current Fusion delivery notes build a GL journal load as a CSV plus a properties file, zipped and submitted through Oracle's bulk import web service in a single call, then poll the scheduled job to completion and report record counts.
- **Business object web services (SOAP and REST).** These suit targeted creates and updates, and loads where you want an answer per record. If a REST service and a SOAP service both exist for an object, we choose REST, but verify first that it supports the operations and fields you need. When we wrote the original series, many REST resources were read-only. Some jobs still call for SOAP: one of our recent integrations uses a SOAP service to validate and create GL account combinations ahead of a [journal import](/projects/oic-gl-journal-import).
- **HCM Data Loader (HDL).** Pipe-separated files with metadata lines followed by data rows, covering workers, users, roles and setup objects such as jobs and locations. Take care with date-effective records, and set source keys so that records can be updated after the load. Summarizing errors across a large file was awkward in our experience, which is why we extract the results and report on them ourselves.
- **BI Publisher and BI Cloud Connector.** Not load tools, but essential for conversions: they let you pull setup values, import errors and loaded data back out to verify a run. For large extracts we batched the calls or delivered the output to content storage and downloaded it from there.

One update to the 2020 picture: FBDI is not automatically the answer for people data. On a recent [worker synchronization](/projects/workday-worker-integration) covering 2,000+ employees daily, we used the worker REST services in place of file-based HDL, because an immediate response for each record made error handling and reporting much simpler.

## The Repeatable APEX Pattern

On EBS, the pattern cut the eight-step dance to four steps and put the whole process in the hands of the end user.

![APEX conversion process flow for E-Business Suite: the end user uploads a file, APEX parses and validates it, the open interface is launched, and the results are reviewed](/images/blog/erp-conversions-part1/erp-conversions-with-apex_orig.png)

Generalized to both platforms, it is one loop:

1. **Load.** The user drags a file onto an APEX page. [APEX_DATA_PARSER](/blog/apex-data-parser-data-load-made-easy) (available since APEX 19.1) reads XLSX, CSV, JSON and XML and returns the rows through a SELECT statement, reading the underlying numbers and dates regardless of cell formatting.
2. **Validate.** Check the data against the target before Oracle sees it. The aim is to intercept 95% of errors here, because it is much harder to clear and retry records once they are in an interface table. On Fusion this means synchronizing reference data first (legal entities, business units, chart of accounts values) so that the checks run against the real target environment.
3. **Cleanse.** Automate the dull fixes: trim spaces, change case, apply consistent date formats.
4. **Transform.** Keep mapping tables in the application, maintained by the people who own the data and held per target environment. Default the fields the user should never have to type.
5. **Submit.** One button populates the open interface and launches the concurrent program on EBS. On Fusion, it builds the FBDI or HDL zip with APEX_ZIP and calls the web services with APEX_WEB_SERVICE, using credentials held securely with APEX_CREDENTIAL.
6. **Reconcile.** Bring the results back into the same application: interface error tables on EBS, a BI Publisher extract on Fusion. Compare what was sent with what arrived and keep the result as the audit trail.
7. **Repeat.** The user corrects the source, re-uploads and goes round again without waiting for IT. Being able to iterate is the main advantage over the traditional approach.

A few design notes from the original series still apply. APEX collections are a convenient place to hold session data during validation and reduce the number of custom objects you deploy, but delete them when you are done, especially with large volumes. Always carry a unique batch identifier through to the interface, so users can review their own results without leaving the application.

## Real-World Examples

**EBS uploads.** The conversions and recurring loads we built this way included new inventory items, item category assignments, on-hand balances and costs, mass price updates across blanket purchase agreements through the Purchasing Open Interface, WIP labor hours from a time and attendance system, and payroll data from several third-party payroll systems.

**Employee conversion to Fusion.** A client needed workers loaded to support Expenses and Self-Service Procurement, with HR and payroll remaining in external systems. Each business supplied a simple spreadsheet. A mapping page (an Interactive Grid) derived the legal entity, business unit and default expense account from the company, filling in any account segments the source file did not provide. Names were trimmed and converted to uppercase. A button generated the zipped worker HDL file, including only the selected records so that a single failed worker could be re-sent. After the load, a background job ran a BI Publisher report to bring the workers back into APEX, where the application confirmed each line manager existed before building the supervisor file. APEX helped us reliably validate, map and load 1000 workers from five different sources in under an hour on cutover weekend.

**PO change orders.** Another customer needed a mass update of 7,000 PO line schedules from 3-way match to 2-way match. Users uploaded a flat XLSX file, reviewed the rows and submitted a background job that called a Procurement SOAP web service for each purchase order, checking the PO status before and after the change. Failures (for example, a PO that already had a change order in process) were reported back against the row, and the Interactive Grid download served as the status report and audit trail. Following a dry run in a test environment, the update worked successfully in production in a couple of hours.

**Smaller repeatable jobs.** The same toolkit handled putting scheduled jobs on hold ahead of a quarterly update and releasing them afterwards, inactivating unused supplier sites, validating GL conversion journals (segment values, cross-validation rules and journal totals) before mapping them into FBDI format, resetting passwords in bulk for UAT or training, and changing project statuses from a spreadsheet.

## What Has Changed Since 2020

**The pattern scales up into a platform.** For a full migration program, session collections give way to standardized staging tables, a common PL/SQL processing framework and shared audit logging. Our [Enterprise Data Migration Platform](/projects/apex-data-migration-platform) case study describes that approach for a manufacturer moving from legacy systems to EBS: purchase orders, receipts, suppliers, inventory and GL, each as a module on one framework, with multi-tier validation and data lineage from source file through to Oracle.

**APEX does more of the loading natively.** Oracle's sample data loading application for APEX 26.1 shows declarative data load definitions that map columns at design time, apply transformation rules and lookup queries, append, merge or replace data with error handling, and push large loads into the background. We still write PL/SQL when the validation is specific to an ERP, but the amount of plumbing we write keeps falling.

**Conversion applications are now source code.** With [APEXlang in APEX 26.1](/blog/apex-26-1-apexlang-claude-code), an APEX application can live as plain-text files in Git beside the PL/SQL packages and conversion scripts, and go through the same review.

**Middleware is an option, not a requirement.** Where a client has Oracle Integration Cloud, the same steps (transform, generate the FBDI file, upload, submit the import, handle the callback) can run there for recurring interfaces. For one-off conversions and loads driven by business users, we still reach for APEX first.

## What AI Coding Agents Change

Conversion work is mostly rules: this field is mandatory, that value must exist in the target, these totals must agree. That makes it a natural fit for our [Software Factory](/software-factory), where coding agents build from a written specification, a second agent reviews the result, and a senior Oracle engineer is the final gate before anything ships.

In practice, the agents draft the validation rules, the mapping code and the reconciliation queries, and they do it quickly. What they cannot do is decide what "correct" means for your data. That is why the specification matters more than it used to: when the code is fast to write, building the wrong rule is the main risk left.

The guardrails matter just as much. Our own working rules for agents on Fusion allow reads freely, but require explicit human confirmation for every write, with a second confirmation for production.

## Lessons Learned

- **Validate before Oracle does.** Errors caught in your own application take minutes to fix. Errors caught in an interface table take a cleanup.
- **Use the standard entry points.** Open interfaces, public APIs, FBDI, HDL and business object services. Never the base tables.
- **Keep mappings in tables, not formulas.** Maintained by the business, per environment.
- **Build reconciliation at the start.** If you cannot prove what loaded, the conversion is not finished.
- **Rehearse.** A dry run in a test environment is what turns cutover into a repeat performance.
- **Keep a human at the gate.** For AI-generated code and for anything that writes to production.

---

**Planning a conversion, or living with a recurring one?** JMJ Cloud builds repeatable, auditable data loads for Oracle E-Business Suite and Fusion Cloud ERP. If you would like to see how the pattern fits your data, [let's talk](/contact).
