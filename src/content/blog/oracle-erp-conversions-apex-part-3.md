---
title: "Oracle ERP Conversions Made Easy with APEX (Part 3)"
date: 2020-06-10
author: "Matt Paine"
tags: ["APEX", "Oracle ERP", "ERP Cloud", "Data Conversion", "HDL", "FBDi", "Web Services"]
summary: "In this final part of our blog series, we show you how APEX will make your ERP Cloud conversions simpler, faster and repeatable with real-world examples including employee conversion and PO change orders."
---

![APEX to the Rescue](/images/blog/erp-conversions-part3/snip20200610-113_orig.png)

In our prior post, **Oracle ERP Conversions Made Easy with APEX Part 2**, we reviewed the tools available to us to load data into ERP Cloud and discussed some of challenges using them.

This final part of our blog series shows you how APEX will make your conversions simpler, faster and repeatable.

## APEX to the Rescue

By taking advantage of APEX's built-in features for modern cloud-based applications, your conversion can be simplified and automated. With APEX, you can:

- Build a secure, multi-tenant, cloud application, delegating authentication to other entities such as Office365 or Gmail.
- Build forms allowing users to upload files securely to an APEX application and review content using an Interactive Report or Interactive Grid.
- Parse input files using APEX_DATA_PARSER in a variety of formats, for example CSV, Excel, XML and JSON.
- Call ERP Cloud REST or SOAP web services using the routines defined in the APEX_WEB_SERVICE package. For users of Autonomous Database, no additional wallet or Access Control List configuration is needed. If you're on Exadata Express Cloud Service, you're also OK, though perhaps it is time to upgrade!
- Enter Web Service Credentials and store them securely in APEX. Credentials can then be maintained or set at the session level using the APEX_CREDENTIAL package.
- Use APEX_JSON to work with JSON files used by many REST web services.
- Zip FBDi files for import using the built-in package APEX_ZIP.
- Use the rich functionality of SQL and PL/SQL to clean, map and transform data before it is imported.
- Use APEX_JWT to work with JSON Web Tokens (JWT) issued by ERP Cloud.

If you don't have access to APEX, this functionality is available FREE as Oracle provides you with two Always-Free instances of Autonomous Database via this link: https://www.oracle.com/cloud/free.

If you haven't done so already, sign up today as it isn't often you get something for nothing!

## Applying the APEX Toolset to ERP Cloud Conversion

An APEX application used to convert data to ERP Cloud can:

- Stage and parse simplified source data from Excel XLSX spreadsheets. APEX will accept other formats too (e.g. XML, JSON, CSV, PSV) but XLSX is more user friendly. APEX will read the underlying numbers and dates in their raw form, regardless of formatting.
- Reduce end-user data preparation of the number of fields required on an FBDi upload.
- Automate data cleansing (for example, changing case, removing trailing spaces, applying or reading date formats).
- Share data, files and results across users in a multitenant application.
- Maintain mapping tables for data transformation per target environment.
- Synchronize master data from ERP Cloud to validate data and mappings, for example lists of Legal Entities, Business Units or Chart of Accounts values.
- Retrieve conversion data from ERP Cloud to validate that all data imported and produce reconciliation reports.
- Create pre-zipped upload format files with a single button click, e.g. File Based Data Import, HCM Data Loader.
- Automate data uploads using FBDi, HDL or Business Object Web Services.

Sounds good? Let's move on to look at some real-world examples.

## Real-World Example 1 – Employee Conversion

A client recently needed help converting workers for an ERP Cloud project. The number of fields to be populated was small, as Oracle HCM was being used only to support Expenses and Self-Service Procurement. External systems were in place for HR and Payroll.

Workers would be provided to us in a simple spreadsheet format, similar to that below.

![Source worker spreadsheet](/images/blog/erp-conversions-part3/picture1_orig.png)

The Company field would act as a key used to derive additional fields such as Legal Entity and Business Unit.

The objective was to enrich multiple spreadsheets received in this format from each of the client businesses with the additional fields needed by Oracle, and then to map the data into the Employee/Supervisor HDL file formats.

First, we built an APEX Classic Report Cards page to allow users to upload an XLSX spreadsheet into a database table.

![APEX upload page with cards](/images/blog/erp-conversions-part3/picture2_orig.png)

This makes use of the APEX_DATA_PARSER package to quickly transform the Excel file into the database.

A mapping page was built using an APEX Interactive Grid, allowing us to enter and maintain the mapping from Company to other fields required by HCM Data Loader.

![Mapping page with Interactive Grid](/images/blog/erp-conversions-part3/picture3_orig.png)

A key field for ERP Cloud Finance projects is the Default Expense Account, used by Expenses and Procurement. As the Chart of Accounts structure could vary depending on which Ledger the Business Unit is linked to, the mapping simply populates any segments provided in the source file, then fills in any missing segments based on the Company. In this case, the Company, Division, and Department are in the source file, and the Account is defaulted in from the Company mapping.

The mapping is applied to the imported file, and the enriched data can be reviewed. At this stage, data has also been cleansed – for example worker names are trimmed of leading or trailing spaces and changed to uppercase.

![Enriched data review](/images/blog/erp-conversions-part3/picture4_orig.png)

When the data is ready to be loaded to ERP Cloud, the Build buttons are used to generate zipped HDL files in the correct format. APEX_ZIP is used to zip up the files. Only selected records are included; this allows us to re-send a specific worker if an error is encountered during the import process.

![Build HDL files](/images/blog/erp-conversions-part3/picture5_orig.png)

The prepared HDL files are then accessed on the Download page.

![Download page](/images/blog/erp-conversions-part3/picture6_orig.png)

If we open up the zip file, we can see that the hard work of building the HDL file in the correct format has all been done.

![HDL file contents](/images/blog/erp-conversions-part3/picture7_orig.png)

In this Use Case, the upload was performed manually from ERP Cloud using the Data Exchange screen below. Note, this step could also have been automated in APEX.

![ERP Cloud Data Exchange](/images/blog/erp-conversions-part3/picture8_orig.png)

Having uploaded the workers, we now need to check that they all imported successfully in order to load the supervisors. That's easy from the Data Exchange screen if all workers load, in a larger file, getting a quick list of kickouts can be challenging.

We'll use another APEX page for this. Clicking on the **New Worker Extract** button initiates a worker download from your ERP Cloud Environment.

![Worker extract page](/images/blog/erp-conversions-part3/picture9_orig.png)

A background job uses the APEX built in packages APEX_WEB_SERVICE and APEX_CREDENTIAL to connect securely to BI Publisher running on ERP Cloud and run a report on workers. Data is retrieved in XML format and parsed into our database using APEX_DATA_PARSER.

Once loaded, the worker data can be reviewed and verified.

![Worker data review](/images/blog/erp-conversions-part3/picture10_orig.png)

Back on the original Worker Upload page, the Build Supervisor HDL File button can build a second file adding each worker's Line Manager. The form checks first that the Line Manager exists in Oracle, based on the data that was downloaded using BI Publisher in the prior step.

![Build Supervisor HDL](/images/blog/erp-conversions-part3/picture11_orig.png)

APEX helped us reliably validate, map, and load 1000 workers from five different sources in under an hour on cutover weekend – and this process can be repeated on subsequent projects.

## Real-World Example 2 – PO Change Orders

Another customer needed assistance doing a mass-update of 7,000 PO Line Schedules from 3-Way Match to 2-Way Match.

They would provide a list of the Purchase Orders, Lines and Schedules, and wanted us to create a process to create Change Orders using a Procurement Cloud SOAP web service.

We verified the changePurchaseOrder web service was operational and met customer requirements before documenting the inputs it needed for a successful update of single and multi-line orders.

The input file would be a flat XLSX format, which we extended to allow update of up to three fields at the Line or Schedule levels. As it turned out, the only attribute that the client wanted changing was MatchApprovalLevelCode, but this future-proofed us for any additional requirements or use on other projects.

As before, we created an upload form in APEX to accept XLSX files using **APEX_DATA_PARSER**.

![PO Change upload form](/images/blog/erp-conversions-part3/picture12_orig.png)

Imported rows are reviewed, and when the Submit Change Process button is clicked, a background job is run to do the updates.

![Review imported rows](/images/blog/erp-conversions-part3/picture13_orig.png)

The ERP Cloud Credentials used by the web services are held securely using **APEX_CREDENTIAL**. **APEX_WEB_SERVICE** is used to call SOAP web services for each PO update, checking the PO status before and after the changes using further web service calls.

Any issues with updates (for example because a PO already has a change order in process) are reported back to APEX, along with the PO status before and after the change.

![Update results](/images/blog/erp-conversions-part3/picture14_orig.png)

The standard **APEX Interactive Grid** download functionality is used to download the files rows and the update messages, providing a status report and Audit Trail.

![Download results](/images/blog/erp-conversions-part3/picture15_orig.png)

Following a dry-run in a TEST environment first, the mass-update of 7,000 PO schedules worked successfully in PROD in a couple of hours.

## Additional Use Cases

Over the last 5 years of working with ERP Cloud, we have encountered many reproducible use-cases that would benefit from the tools available to us in APEX.

We are building these into the **TurboLoad** module of **JMJ ERP Cloud Express**.

Further examples include:

**ESS Job Hold and Release.** Oracle asks you to put ESS and BI jobs on hold before quarterly updates; if you have hundreds of jobs running this can be time-consuming without automation. Upload a simple spreadsheet with a list of the ESS Job Ids to quickly apply the holds and release them once the environment is released back to you by Oracle.

**Supplier Inactivation.** Do you have hundreds of supplier sites that are no longer used or required? A mass-update can be used to quickly apply an inactive date to these records to clean up your supplier master.

**GL Conversion.** The FBDi format is recommended for high-volume uploads but doesn't pre-validate GL Code Combinations or check that other attributes of your conversion journals are correct before Import Journals is run. This APEX page allows you to convert your GL data from a simple Excel file, check account segment values and cross-validation rules and journal totals before mapping into FBDi format and automating **Import Journals**.

**Password Resets.** We don't recommend mass password resets using a single password post-clone as this represents a security risk, however it can be necessary to mass-update multiple user passwords from time to time for UAT or Training purposes. This can be done from a spreadsheet using Oracle's SCIM (System for Cross-domain Identity Management) web services.

**Project Status Changes.** If you have many open projects in PPM and want to change their statuses, e.g. from Contracted to Closed, this tool will help you. Upload a spreadsheet with the Project Numbers and their desired status, and APEX will quickly apply the updates.

## Conclusion

A SaaS based environment with all the features of APEX and the Oracle Database is the ideal tool for Oracle ERP Cloud data conversions and integrations.

Streamline your ERP Cloud data loads using APEX built-in web service calls, Excel file parsing and low code UI development allied with the power of SQL & PL/SQL.

Your conversion process can be faster, repeatable, and generate a full audit trail and upload reporting. Isn't that we all want when loading data to Production?

---

Matt Paine, Co-Founder JMJ Cloud
