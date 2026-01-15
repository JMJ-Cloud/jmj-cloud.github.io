---
title: "Automated Procurement Budget Integration with BI Publisher"
status: "Active"
year: 2025
summary: "Delivered automated Oracle Fusion to BirchStreet integration using BI Publisher bursting, enabling real-time code combination validation for procurement invoice coding at a luxury hospitality resort."
technologies:
  - "Oracle Fusion Cloud Financials"
  - "Oracle BI Publisher"
  - "SQL Data Models"
  - "Bursting Delivery"
  - "SFTP Integration"
  - "Chart of Accounts"
industry: "Hospitality"
metrics:
  - "12 months of budget periods generated automatically per execution"
  - "7-segment Chart of Accounts validation"
  - "Daily automated file delivery to procurement system"
  - "Zero manual intervention required"
featured: true
order: 6
---

## Project Overview

A luxury resort undergoing a corporate merger needed to integrate their Oracle Fusion Cloud Financials environment with BirchStreet—a leading procurement, invoicing, and inventory management platform used throughout the hospitality industry. The challenge: BirchStreet users needed to code invoices using valid Oracle General Ledger account combinations, but without real-time validation, staff frequently selected segment values that were individually valid but created invalid combinations when assembled in Oracle.

JMJ Cloud designed and implemented an automated BI Publisher integration that extracts all valid, enabled code combinations from Oracle Fusion and delivers them to BirchStreet as budget entries. By sending the complete account string rather than individual segment values, the solution prevents invalid combination errors at the source—ensuring procurement coding aligns with Oracle's Chart of Accounts structure before invoices ever reach the financial system.

The integration runs daily on an automated schedule, generating budget files for the entire fiscal year and delivering them via SFTP to BirchStreet's consumption endpoint. This seamless synchronization ensures procurement teams always work with current, validated account structures without manual intervention from finance or IT.

## Business Challenge

The merger integration presented several critical challenges for financial system alignment:

**Invalid Code Combination Errors** — BirchStreet's standard integration approach sends individual segment values independently, allowing users to select any enabled Entity, Cost Center, or Account. When these selections combine in Oracle, invalid combinations trigger import failures, requiring manual correction and delaying invoice processing.

**Chart of Accounts Complexity** — The resort's 7-segment COA structure—Entity, Cost Center, Account, PreOpening, Intercompany, and two Future Use segments—created thousands of potential combinations. Only a subset of these combinations are valid for posting in Oracle, and maintaining this validation manually in BirchStreet was impractical.

**Merger Timeline Pressure** — The corporate acquisition required rapid financial system integration with zero tolerance for invoice processing delays. The solution needed to be production-ready quickly while maintaining data integrity across both platforms.

**Segment Lifecycle Management** — Oracle segment values have effective dates, enabled flags, and posting restrictions that change over time. BirchStreet needed to reflect these changes automatically rather than relying on periodic manual updates that could become stale.

**Multi-Environment Coordination** — Development, test, and production environments required separate SFTP credentials and delivery paths while maintaining identical integration logic. Configuration management needed to support environment promotion without code changes.

## Solution Architecture

A fully automated Oracle BI Publisher solution that extracts validated code combinations and delivers them to BirchStreet via scheduled bursting.

### BI Publisher Data Model

The integration uses a sophisticated SQL data model that joins multiple Chart of Accounts tables to identify valid code combinations. The query validates each segment independently—confirming that Entity, Cost Center, Account, PreOpening, Intercompany, and Future Use values are all active and enabled—then confirms the assembled combination allows detailed posting in Oracle. This multi-tier validation ensures only production-ready account strings reach BirchStreet.

The data model generates 12 months of budget periods automatically, creating one row per valid combination per month for the fiscal year containing the current date. By generating the full year's budget periods in each execution, the solution ensures BirchStreet has complete coverage for invoice coding regardless of posting date.

### Bursting Delivery Framework

BI Publisher's bursting capability delivers the generated file to multiple SFTP destinations simultaneously. Each execution writes to both an outbound directory—where BirchStreet consumes the file—and an archive directory for audit trail and troubleshooting. The bursting configuration uses dynamic file naming with timestamps (BSSBF_YYYY-MM-DD_HH-MM-SS.txt) ensuring each delivery is uniquely identifiable.

The SFTP configuration supports environment-specific credentials stored in BI Publisher's server registry, enabling seamless promotion from development through production without modifying report definitions. Separate service accounts for Oracle Integration Cloud and BirchStreet provide clear audit trails and security isolation.

### Budget File Format

BirchStreet's budget import expects a specific comma-separated format with Action Type, Budget Period, Department Code, GL Account Code, Budget Amount, and Inn Code fields. The integration maps Oracle's 7-segment COA structure to BirchStreet's expected format, using the complete account string as the GL Account Code to enforce combination-level validation.

All budget amounts are sent as zero values—the integration's purpose is identifying valid code combinations for invoice coding, not transmitting actual budget figures. This approach was confirmed with the client's finance team as the optimal method for enabling code combination validation without creating misleading budget data in the procurement system.

## Technical Highlights

**Complex COA Validation Logic:** The SQL data model implements a sophisticated join pattern across seven Chart of Accounts segment tables, each querying FND_FLEX_VALUES_VL and FND_FLEX_VALUE_SETS to validate segment-level enablement. The query filters for combinations where enabled_flag = 'Y' across all segments, the code combination allows detailed posting (detail_posting_allowed_flag = 'Y'), the combination is not a summary account (summary_flag = 'N'), and the combination has no expired end date. This comprehensive validation ensures only genuinely usable account strings reach BirchStreet.

**Period Generation Pattern:** Rather than hardcoding budget periods, the data model uses Oracle's CONNECT BY LEVEL syntax to dynamically generate 12 monthly periods. The PERIODS CTE calculates period numbers from January through December of the current fiscal year using ADD_MONTHS and TRUNC functions, creating a reusable pattern that automatically adjusts as the year changes without requiring annual report modifications.

**Segment Value Filtering:** The integration filters code combinations to specific business requirements—only expense accounts (account_type = 'E') with a particular PreOpening segment value are included. An additional filter uses a custom value set (WMI_BIRCHSTREET_ORG_MAP) to control which Entity values are eligible for BirchStreet integration, providing finance with configuration-based control over integration scope without code changes.

**eText Report Layout:** The output file uses BI Publisher's eText template format for precise control over field positioning and delimiters. The single-field layout extracts the concatenated row data directly from the SQL, avoiding the formatting inconsistencies that can occur with standard RTF templates when generating delimited text files. UTF-8 encoding ensures proper handling of any special characters in description fields.

**Dual-Destination Bursting:** The bursting SQL uses UNION ALL to create two delivery records per execution—one for the outbound directory and one for the archive directory. This pattern ensures every file delivered to BirchStreet has a corresponding archived copy for audit purposes, with identical content guaranteed by the single-execution delivery model.

**Environment-Agnostic Configuration:** SFTP server names are stored as BI Publisher server definitions rather than hardcoded in report SQL. The same report definition deploys across development, test, and production environments, with environment-specific SFTP credentials managed through BI Publisher's administrative interface. This separation of configuration from code simplifies deployment and reduces environment-specific maintenance.

## Results & Impact

**Data Quality:** Eliminated invalid code combination errors in BirchStreet invoice processing by validating combinations at the source rather than during Oracle import. Procurement staff select from pre-validated account strings, ensuring every coded invoice passes Oracle's Chart of Accounts validation without exception handling or manual correction.

**Processing Efficiency:** Automated daily file generation and delivery removes manual effort from finance and IT teams. The scheduled execution runs 15 minutes after the COA integration completes, ensuring BirchStreet always reflects the most current Oracle account structure without requiring coordination or manual file transfers.

**Business Continuity:** Enabled seamless financial system integration during the corporate merger, meeting aggressive timeline requirements without compromising data integrity. The solution was production-ready within the merger's technical integration window, supporting invoice processing from day one of combined operations.

**Audit and Compliance:** Complete archive of every file delivered to BirchStreet provides full traceability for financial audits. Timestamped file names and dual-directory delivery create a clear audit trail linking procurement coding to Oracle's Chart of Accounts as it existed at each point in time.

**Technical Success:** The BI Publisher approach leverages Oracle's native reporting infrastructure without requiring additional middleware, integration platforms, or custom code deployments. Standard Oracle tools—SQL data models, bursting delivery, and SFTP connectivity—combine to deliver a robust integration that finance teams can monitor and troubleshoot without specialized technical skills.

## Deliverables

- **BI Publisher Report Definition:** Complete report configuration with data model, layout template, and bursting settings for automated execution and delivery
- **SQL Data Model:** Optimized query joining Chart of Accounts tables with period generation and segment validation logic
- **eText Layout Template:** Text output template producing BirchStreet-compatible comma-separated format with proper encoding
- **Bursting Configuration:** Dual-destination SFTP delivery to outbound and archive directories with dynamic file naming
- **SFTP Directory Structure:** Configured directory hierarchy for outbound delivery, archive storage, and error handling across all environments
- **Environment Configuration:** BI Publisher server definitions for development, test, and production SFTP connectivity with appropriate credential management
- **Scheduling Configuration:** Automated job schedule coordinated with upstream COA integration timing
- **Technical Documentation:** Complete design specification including file format, field mappings, validation rules, and operational procedures

## Why This Matters

This project demonstrates how Oracle's native BI Publisher capabilities can deliver sophisticated integration solutions without requiring middleware platforms, custom development frameworks, or additional licensing costs. For organizations already invested in Oracle Fusion Cloud, BI Publisher provides a powerful—and often underutilized—tool for automated data extraction and delivery to external systems.

**Procurement System Integration Expertise:** Connecting Oracle Financials with procurement platforms like BirchStreet requires understanding both systems' data models and validation requirements. The decision to send complete code combinations rather than individual segments prevented a category of integration errors that would have created ongoing operational friction. This business-aware technical design reflects experience with real-world procurement workflows.

**BI Publisher Mastery:** Many organizations underestimate BI Publisher's integration capabilities, treating it solely as a report generation tool. This project leverages advanced features—bursting delivery, dynamic SQL, eText formatting, and multi-destination output—that transform BI Publisher into a lightweight integration platform. The approach is particularly valuable for scheduled batch integrations where real-time connectivity isn't required.

**Chart of Accounts Complexity:** Oracle Fusion's flexible COA structure creates powerful segmentation capabilities but introduces validation complexity that downstream systems must handle correctly. The multi-table join pattern and segment-level validation logic demonstrate deep understanding of Oracle's flex field architecture and combination validation rules.

**Merger Integration Readiness:** Corporate acquisitions create intense timeline pressure for financial system integration. The ability to deliver a production-ready solution within merger timelines—while maintaining data integrity and audit compliance—demonstrates both technical competence and project delivery discipline.

For organizations using Oracle Fusion Cloud alongside procurement platforms like BirchStreet, Coupa, or similar systems, this case study illustrates how thoughtful integration design prevents downstream errors while leveraging existing Oracle infrastructure. The pattern of sending validated combinations rather than individual segments applies broadly to any integration where Oracle's Chart of Accounts must interoperate with external systems that lack native COA validation.
