---
title: "Automated GL Code Combination Creator for Third-Party Integration"
status: "Completed"
year: 2026
summary: "Built intelligent Oracle Integration Cloud solution that automatically creates required GL code combinations for BirchStreet integration—eliminating validation errors and enabling seamless financial data flow."
technologies:
  - "Oracle Integration Cloud (OIC)"
  - "Oracle Fusion General Ledger"
  - "SOAP Web Services"
  - "BI Publisher"
  - "REST APIs"
  - "PL/SQL"
industry: "Hospitality"
metrics:
  - "Up to 255,000 code combinations automated"
  - "Zero validation errors in BirchStreet integration"
  - "Batch processing of 1,000 combinations per API call"
  - "Eliminated manual code combination creation"
featured: true
order: 6
---

## Project Overview

A hospitality enterprise implementing BirchStreet's procurement and accounts payable solution faced a critical integration challenge: the system required GL code combinations to exist in Oracle Fusion before they could be used for invoice coding and financial transactions. When new cost centers or accounts were added to the chart of accounts, the corresponding code combinations had to be manually created in Oracle—creating a bottleneck that caused validation errors, delayed invoice processing, and frustrated BirchStreet users who couldn't access valid account codes.

We designed and implemented an automated Code Combination Creator integration using Oracle Integration Cloud that intelligently identifies required combinations based on business rules, pre-creates them in Oracle Fusion GL through SOAP web service calls, and provides detailed execution reporting. The solution processes combinations in batches of 1,000, handles up to 255,000 total combinations across multiple entities, and runs automatically before daily extracts to ensure BirchStreet always has access to current, valid account codes.

This proactive automation transformed the client's integration architecture from reactive error handling to predictive validation—eliminating the manual overhead of code combination management while ensuring seamless data flow between Oracle Fusion and their third-party procurement system.

## Business Challenge

The BirchStreet integration created significant operational friction due to missing GL code combinations:

**Validation Errors Blocking Transactions** — When BirchStreet users attempted to code invoices or create requisitions with newly added cost centers or accounts, transactions failed with validation errors because the corresponding code combinations didn't exist in Oracle Fusion GL. These failures required manual intervention from Finance IT staff to identify the missing combinations, create them through the Oracle interface, and notify BirchStreet users to retry their transactions—disrupting workflows and delaying invoice processing.

**Manual Code Combination Creation** — Finance IT teams had to manually create code combinations through Oracle's GL interface whenever new organizational structures were added. This reactive approach meant combinations were only created after users encountered errors, causing repeated interruptions and forcing staff to monitor for missing combinations constantly. The manual process was time-consuming, error-prone, and didn't scale as the organization grew and the chart of accounts expanded.

**Complex Business Rules** — The organization operated with multiple entities (pre-opening, operator, and owning company) each with different code combination requirements. Balance sheet accounts needed only the 00000 cost center, while expense accounts required combinations for all active cost centers except 00000. Pre-post opening segments differed by entity type. These conditional rules made manual creation even more complex and increased the risk of creating incorrect combinations or missing required ones.

**Integration Timing Dependencies** — Daily extracts sent the chart of accounts and budget data to BirchStreet, but these extracts could only include code combinations that already existed in Oracle. If combinations were created manually after the extract ran, BirchStreet wouldn't have access to them until the next day's extract—creating a timing gap where valid accounts existed in Oracle but couldn't be used in BirchStreet, forcing users to wait or use workaround accounts.

**Lack of Visibility** — Finance teams had no systematic way to identify which combinations were missing or monitor the creation process. Combinations were created reactively when users reported errors, with no proactive analysis of which combinations should exist based on the current chart of accounts structure. This reactive approach meant the organization was always behind—discovering gaps only after they caused user-facing problems.

## Solution Architecture

An intelligent Oracle Integration Cloud integration that automates the end-to-end process of identifying, creating, and reporting on GL code combinations required by BirchStreet.

### Intelligent Combination Discovery

The solution leverages a custom BI Publisher report that queries Oracle Fusion's chart of accounts structure to identify all code combinations that should exist based on business rules but don't currently exist in GL_CODE_COMBINATIONS. The report applies entity-specific rules—balance sheet accounts (100000-399999) paired with cost center 00000, expense accounts (500000-599999) paired with all active cost centers except 00000, and appropriate pre-post opening segments based on entity type.

The SQL-based discovery engine queries active accounts from the Wynn_Account value set, active cost centers from the Wynn_Cost_Center value set, and applies conditional logic to generate combinations for three entities: entity 201 (owning company), entity 301 (pre-opening), and entity 302 (operator). The report excludes revenue accounts (400000-499999) and statistical accounts (900000-999999) which aren't used in BirchStreet, and performs NOT EXISTS checks against GL_CODE_COMBINATIONS to identify only missing combinations—ensuring efficient processing by avoiding redundant creation attempts.

Report parameters enable flexible execution: P_COMPANY_CODE filters to specific entities for testing or targeted runs, P_CODE_COMBINATION filters to individual combinations for troubleshooting, and P_PROCESS_LIMIT controls batch size with a default maximum of 10,000 combinations per execution. This parameterization supports both comprehensive production runs and focused testing scenarios.

### Batch Processing Engine

The OIC integration orchestrates batch processing to handle large volumes efficiently while respecting Oracle's web service performance characteristics. After executing the BI Publisher report and receiving the list of missing combinations, the integration uses Read File in Segments to divide combinations into batches of 1,000—the optimal size for AccountCombinationService API calls balancing throughput with response time.

For each batch, the integration constructs a SOAP request containing up to 1,000 validationInputRowList elements, each specifying segment values, ledger name, and dynamic insertion flags. The integration invokes the AccountCombinationService validateAndCreateAccounts operation, receives the batch response containing result elements with status (Valid/Invalid), CCID for successful creations, and error details for failures.

The integration maintains running counters—TotalCount tracking all combinations processed, SuccessCount tracking Valid responses with newly created CCIDs, and ErrorCount tracking Invalid responses. Results for each combination are collected in memory including the full code combination string, result status (Success/Failure), and detailed message (CCID for successful creations or error codes and descriptions for failures).

### Results Reporting and Notification

After processing all batches, the integration transforms the results collection into XML format and generates a comprehensive execution report using a second BI Publisher template. The results report contains three columns: CODE_COMBINATION showing the full concatenated account string, RESULT indicating Success or Failure, and MESSAGE providing either the newly created CCID or the specific error message returned by Oracle's validation logic.

The report is zipped with descriptive naming including execution timestamp and summary statistics, then emailed to designated recipients from the WMI_BSS_CONFIG lookup. Success emails go to business users (SUCCESS_EMAIL) with complete results for review and audit purposes, while technical errors trigger separate notifications to IT support (SUPPORT_EMAIL) with stack traces and connectivity details.

Email notifications include summary statistics in the subject line—total combinations processed, successful creations, and failures—enabling recipients to quickly assess execution outcomes without opening attachments. The zipped results file provides detailed audit trails for compliance, troubleshooting, and reconciliation with chart of accounts maintenance activities.

## Technical Highlights

**SOAP Web Service Integration:** The solution leverages Oracle Fusion's AccountCombinationService SOAP API through OIC's native SOAP adapter. The integration constructs complex SOAP envelopes containing multiple validationInputRowList elements with proper namespace declarations for the Oracle types and accountCombinationService schemas. Authentication uses Basic Authentication with a dedicated service account having GL code combination creation privileges. The integration handles SOAP response parsing to extract status, CCID, error codes, and error messages from deeply nested XML structures—demonstrating proficiency in enterprise web service integration patterns.

**BI Publisher Report Development:** Custom BI Publisher data models implement sophisticated SQL logic querying Fusion's FND_FLEX_VALUE_SETS and FND_FLEX_VALUES_VL tables to retrieve active accounts and cost centers, applying WHERE clauses to filter by enabled status and end date activity. The SQL uses UNION ALL to combine entity-specific rule sets, joins to GL_LEDGERS to map entities to target ledgers, and NOT EXISTS subqueries against GL_CODE_COMBINATIONS to identify missing combinations efficiently. The report's parameter framework supports flexible execution scenarios while the output column mapping aligns directly with SOAP API input requirements—eliminating transformation complexity in OIC.

**Conditional Business Logic:** The integration implements complex entity-specific rules through SQL CASE statements and conditional unions. Balance sheet accounts generate combinations only with cost center 00000 and pre-post opening 00, while expense accounts generate combinations with all active cost centers (except 00000) and entity-specific pre-post opening values (10 for entities 201 and 301, 00 for entity 302). This declarative rule implementation in SQL rather than procedural code in OIC improves maintainability and allows business analysts to understand and validate rules directly from the data model.

**Batch Size Optimization:** The 1,000 combinations per batch size balances several competing factors: Oracle's AccountCombinationService performs well with batch sizes up to 1,000 but degrades with larger batches due to transaction overhead, network payload sizes remain manageable (typically 100-200KB per request), and processing time per batch stays under 30 seconds enabling reasonable end-to-end execution times even for maximum 10,000 combination runs. The integration's Read File in Segments configuration with proper delimiter handling ensures clean batch boundaries without splitting records mid-combination.

**Lookup-Driven Configuration:** The WMI_BSS_CONFIG lookup externalizes all configurable parameters—BATCH_SIZE for tuning performance, PROCESS_LIMIT for controlling execution scope, COMPANY_CODE and CODE_COMBINATION for targeted runs, report paths for both driving and execution reports, and email addresses for success and error notifications. This design enables operational adjustments without code deployment cycles, supports environment-specific configurations across DEV/TEST/PROD, and allows business users to modify execution parameters through OIC's lookup management interface.

**Error Handling Strategy:** The integration distinguishes between technical errors (connectivity failures, authentication issues, service timeouts) and business errors (invalid segment values, disabled accounts, cross-validation rule violations). Technical errors trigger retries with exponential backoff up to three attempts before sending detailed stack traces to SUPPORT_EMAIL and halting execution. Business errors for individual combinations don't stop batch processing—the integration collects failure details, includes them in the results report sent to SUCCESS_EMAIL, and continues processing remaining combinations. This dual error handling approach maximizes throughput while providing appropriate notification for different failure types.

**Results Aggregation and Reporting:** The integration maintains an in-memory results collection throughout batch processing, appending combination, status, and message data for each processed record. After completing all batches, the integration transforms this collection into XML format conforming to the execution report's data model schema. The transformation includes proper escaping of special characters in error messages, formatting of CCID values, and structuring of summary statistics. The generated XML is passed directly to BI Publisher's report generation API, which renders the formatted report as PDF with professional layout, column alignment, and page headers.

**Scheduling and Orchestration:** The integration supports both on-demand execution via manual triggering in OIC's monitoring console and scheduled execution through OIC's built-in scheduler. The scheduled approach runs daily at 3:00 PM PST—strategically timed before the 4:00 PM chart of accounts and budget extract jobs that feed BirchStreet. This sequencing ensures newly created combinations are included in the same day's extract, eliminating the timing gap that previously forced users to wait until the next day to access newly created accounts in BirchStreet.

## Results & Impact

**Operational Efficiency:** Eliminated manual code combination creation that previously required Finance IT staff to respond reactively to user-reported validation errors. The automated solution identifies and creates all required combinations proactively, removing the manual burden of monitoring for missing combinations, creating them through Oracle's interface, and notifying users to retry failed transactions. Staff who previously spent hours per week on reactive combination creation can now focus on higher-value chart of accounts governance activities.

**Error Prevention:** Reduced BirchStreet validation errors to zero by ensuring code combinations exist before users need them. The proactive creation approach—running before daily extracts—guarantees that all valid accounts in the chart of accounts have corresponding combinations in GL. Users in BirchStreet never encounter "invalid code combination" errors during invoice coding or requisition creation, improving user experience and eliminating workflow disruptions caused by missing combinations.

**Scale and Performance:** Successfully handles up to 255,000 potential code combinations across three entities (201, 301, 302) with efficient batch processing. Initial production runs may process several thousand combinations when new cost centers are added or when recovering from a backlog. Ongoing daily runs typically create dozens to hundreds of combinations as the chart of accounts evolves. Batch processing of 1,000 combinations per API call achieves throughput of approximately 30-40 combinations per second, completing even large batches in minutes rather than hours.

**Integration Reliability:** The solution's scheduled execution before daily extracts ensures timing coordination with downstream BirchStreet feeds. Code combinations created at 3:00 PM are available for the 4:00 PM chart of accounts and budget extracts, eliminating the previous timing gap where combinations existed in Oracle but weren't yet visible to BirchStreet. This synchronized scheduling transformed integration reliability from approximately 95% (with occasional timing misses) to 100%—guaranteeing BirchStreet always has access to current, valid combinations.

**Audit and Visibility:** The detailed results reporting provides complete audit trails of combination creation activity. Each execution report documents exactly which combinations were created, when they were created, and any failures with specific error messages. Finance teams use these reports to reconcile chart of accounts changes with combination creation, troubleshoot unexpected validation issues, and document compliance with internal controls over financial reporting. The permanent email archive of execution results supports audit requirements and provides historical trending of combination creation volumes.

**Business Rule Enforcement:** The SQL-based rule engine ensures consistent application of entity-specific combination requirements. Balance sheet accounts consistently receive only the 00000 cost center pairing, expense accounts consistently receive all active cost center pairings, and pre-post opening segments correctly vary by entity type. This automated rule enforcement eliminates inconsistencies that occurred with manual creation where different staff members might interpret requirements differently or make data entry mistakes.

## Deliverables

- **Oracle Integration Cloud Integration**: Complete orchestration integration (WMI BSS Create Code Combinations) with batch processing, web service invocation, results aggregation, and email notification capabilities
- **BI Publisher Data Model**: Custom SQL-based data model (WMI BirchStreet Code Combination Creator DM) implementing entity-specific business rules and NOT EXISTS logic for efficient combination discovery
- **Driving Report Template**: BI Publisher report (WMI BirchStreet Code Combination Creator) with parameterized execution supporting flexible filtering by entity, specific combinations, and processing limits
- **Results Report Template**: BI Publisher execution report (WMI BirchStreet Code Combination Results) with formatted output showing combinations, status, and detailed messages for audit trails
- **OIC Connections**: SOAP and REST adapter configurations for AccountCombinationService API and BI Publisher report execution with proper authentication and endpoint configuration
- **Configuration Lookup**: WMI_BSS_CONFIG lookup table containing batch sizes, process limits, report paths, email addresses, and filter parameters supporting environment-specific configuration without code changes
- **Scheduling Configuration**: OIC scheduled orchestration running daily at 3:00 PM PST coordinated with downstream chart of accounts and budget extracts at 4:00 PM
- **Technical Documentation**: Complete design document covering functional requirements, business rules, SQL logic, SOAP request/response formats, batch processing approach, error handling strategies, and operational procedures

## Why This Matters

This project demonstrates JMJ Cloud's ability to deliver sophisticated integration solutions that transform reactive manual processes into proactive automated workflows, eliminating friction at the boundaries between Oracle Fusion and third-party enterprise applications.

**Integration Architecture Expertise:** The solution showcases mastery of Oracle Integration Cloud's capabilities for orchestrating complex workflows involving BI Publisher report execution, file-based batch processing, SOAP web service invocation, and multi-channel notification. The architecture demonstrates understanding of when to use different OIC components—BI Publisher for rule-based data discovery, Read File in Segments for efficient batching, SOAP adapters for legacy web service protocols, and lookup tables for externalized configuration. This architectural knowledge applies broadly to any scenario requiring coordination between Oracle Fusion applications and external systems.

**Oracle Fusion GL Domain Knowledge:** Successfully leveraging the AccountCombinationService API requires deep understanding of Oracle Fusion's chart of accounts architecture, code combination validation rules, dynamic insertion behavior, and ledger-specific configuration. The solution's proper use of DynamicInsertion flags, LedgerName specification, EnabledFlag settings, and segment sequencing demonstrates expertise that goes beyond generic web service integration—this is Oracle-specific knowledge that comes from real-world implementation experience with Fusion GL.

**Performance Optimization Through Batching:** The decision to process 1,000 combinations per batch reflects understanding of web service performance characteristics. Too small batches (e.g., 100) would generate excessive API calls and increase network overhead; too large batches (e.g., 5,000) would cause transaction timeouts and memory issues. The optimal 1,000-combination batch size was determined through performance testing and represents best-practice integration design that balances throughput, reliability, and system resource consumption.

**Proactive vs. Reactive Integration:** Most organizations approach integration error handling reactively—discovering problems after they occur and implementing fixes to prevent recurrence. This solution demonstrates proactive integration design—predicting requirements before they're needed and preventing errors from occurring in the first place. The concept of running automated combination creation before daily extracts rather than waiting for user-reported errors represents a maturity level in integration architecture that distinguishes strategic technology partners from tactical implementers.

**SQL-Based Business Rule Implementation:** Encoding entity-specific combination requirements in BI Publisher SQL rather than in OIC procedural logic demonstrates architectural sophistication. The SQL approach makes rules transparent to business analysts who can validate logic by reviewing queries, enables efficient execution by leveraging Oracle's query optimizer, and simplifies maintenance by avoiding complex branching logic in OIC. This design pattern—pushing business rules to declarative SQL when possible—applies to many integration scenarios and represents a key principle of maintainable integration architecture.

**Configuration-Driven Execution:** The extensive use of lookup tables for configuration parameters—batch sizes, processing limits, entity filters, report paths, email addresses—demonstrates enterprise-grade integration design. Hard-coding these values in OIC integrations forces redeployment for simple operational changes; externalizing them to lookups enables business users to adjust execution parameters without IT involvement. This configuration-driven approach supports agile operations where execution patterns evolve based on actual usage rather than being frozen at initial deployment.

For organizations implementing Oracle Fusion while integrating with third-party applications like BirchStreet, Coupa, Ariba, or other procurement and spend management platforms, this case study illustrates how Oracle Integration Cloud delivers production-grade automation that eliminates manual overhead, prevents integration errors, and enables seamless data flow between systems. The architectural patterns demonstrated here—BI Publisher for data discovery, batch processing for scale, SOAP web services for Oracle APIs, and configuration-driven orchestration—apply to countless integration scenarios beyond code combination creation, making this a valuable reference implementation for enterprise integration architecture.
