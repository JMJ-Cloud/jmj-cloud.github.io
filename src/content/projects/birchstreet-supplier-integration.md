---
title: "Automated Supplier Master Data Integration with BirchStreet"
status: "Active"
date: 2025-01-15
year: 2025
summary: "Built real-time Oracle Fusion to BirchStreet supplier synchronization enabling automated procurement workflows and accurate AP payment processing for hospitality operations."
technologies:
  - "Oracle Fusion Cloud"
  - "BI Publisher"
  - "PL/SQL"
  - "SFTP Integration"
  - "Data Quality Validation"
  - "Flex Value Sets"
  - "Report Bursting"
industry: "Hospitality"
metrics:
  - "Hourly automated supplier synchronization"
  - "Real-time supplier availability management across procurement systems"
  - "100% vendor code accuracy for AP automation"
  - "Eliminated manual supplier data entry and reconciliation"
featured: true
order: 7
---

## Project Overview

A luxury hospitality organization implementing BirchStreet for procurement and accounts payable automation faced a critical integration challenge: their supplier master data resided in Oracle Fusion Cloud, while BirchStreet needed accurate, up-to-date vendor information to support eProcurement workflows and AP invoice processing. Without seamless synchronization, the organization risked incorrect vendor codes in payment vouchers, manual data reconciliation overhead, and procurement disruptions from outdated supplier status.

We designed and implemented an automated supplier integration using Oracle BI Publisher that delivers comprehensive vendor information from Oracle Fusion to BirchStreet via SFTP every hour. The solution validates data completeness, enforces supplier site requirements, handles complex address formatting for international operations, and maintains supplier availability status across both systems, ensuring procurement users always work with current, accurate vendor data while enabling straight-through AP processing without manual intervention.

The integration now processes supplier updates hourly, automatically flagging inactive vendors in BirchStreet, maintaining vendor code consistency for payment automation, and eliminating the manual data entry and reconciliation that previously consumed significant procurement team resources.

## Business Challenge

The organization's procurement transformation depended on establishing reliable supplier master data flows between their Oracle ERP and the new BirchStreet procurement platform:

**AP Automation Risk:** Incorrect vendor codes flowing from BirchStreet to Oracle would cause payment processing failures, requiring manual intervention to match invoices to the correct suppliers. This risk threatened the entire value proposition of AP automation, potentially creating more work than the manual processes being replaced.

**Manual Reconciliation Overhead:** Without automated synchronization, procurement staff would need to manually maintain supplier records in both Oracle and BirchStreet, creating duplicate data entry workload, introducing human error, and consuming time better spent on strategic sourcing activities. As the supplier base grew, this manual approach would become increasingly unsustainable.

**Supplier Availability Confusion:** Vendors marked inactive in Oracle EBS due to end-dating, payment holds, or compliance issues would remain selectable in BirchStreet unless manually deactivated. Procurement users would submit purchase orders to unavailable suppliers, creating order fulfillment delays, exception handling overhead, and supplier relationship confusion.

**Data Quality Inconsistency:** BirchStreet requires complete supplier contact information including phone numbers, email addresses or fax numbers, and properly formatted addresses for purchase order transmission. Incomplete or incorrectly formatted supplier records in Oracle would either fail to transfer or create downstream issues in eProcurement workflows, requiring reactive data cleanup.

**Geographic Complexity:** Operating across multiple countries introduced address formatting challenges, particularly for United States and Canadian suppliers where BirchStreet requires two-character state or province codes. Oracle's flexible address structures needed transformation to meet BirchStreet's standardized format requirements without losing data fidelity.

**Multi-Organization Mapping:** The hospitality organization's Oracle environment supports multiple business units that need mapping to BirchStreet's organizational structure. Suppliers assigned to different procurement business units required appropriate routing to corresponding BirchStreet "inn codes" to maintain proper organizational segregation and approval workflows.

## Solution Architecture

A comprehensive Oracle BI Publisher integration that extracts, validates, transforms, and delivers supplier master data from Oracle Fusion Cloud to BirchStreet's SFTP interface with hourly frequency and built-in data quality controls.

### Intelligent Data Selection and Change Detection

The solution implements sophisticated change detection logic that identifies suppliers requiring synchronization based on multiple update vectors. The integration queries suppliers where the supplier profile, supplier site, or supplier address was created or modified within the previous two hours—capturing updates regardless of which table changed. This multi-table monitoring ensures that changes to vendor names, site assignments, contact information, or address details all trigger appropriate downstream updates to BirchStreet.

The hourly execution frequency balances timeliness requirements against system load considerations. Procurement users typically don't need real-time supplier updates, but several-hour lags would create confusion when suppliers are added or modified in Oracle but don't appear available in BirchStreet. The two-hour lookback window provides overlap between runs to ensure no changes fall through timing gaps.

### Comprehensive Data Quality Validation

Before supplier records flow to BirchStreet, the integration enforces strict data completeness requirements that mirror BirchStreet's operational needs. Supplier sites must have phone numbers for vendor contact, email addresses or fax numbers for purchase order transmission, complete address information including address line 1, city, country, postal code, state or province codes for US and Canadian addresses, and valid assignments to procurement business units. Records failing these validations are excluded from the feed, preventing incomplete data from creating downstream processing issues.

This validation framework ensures BirchStreet receives only operationally useful supplier records. The integration doesn't attempt to "fix" incomplete Oracle data—instead, it surfaces data quality issues that require resolution in the source system, maintaining Oracle as the authoritative supplier master.

### Address Standardization and Geographic Formatting

The integration handles complex address transformation requirements, particularly for state and province codes. For United States suppliers, the solution queries Oracle's income tax region tables to map state names or abbreviations to standardized two-character codes that BirchStreet requires. For Canadian suppliers, it navigates Oracle's geography hierarchy to extract province codes from geography identifiers, handling cases where suppliers use either full province names or two-character abbreviations.

This geographic intelligence ensures addresses comply with BirchStreet's formatting requirements while preserving the flexibility of Oracle's address capture. The solution prioritizes data accuracy over rigid formatting, using Oracle's reference data to perform intelligent transformations rather than applying simplistic string manipulation that could introduce errors.

### Supplier Deactivation Logic

The integration implements comprehensive deactivation rules that automatically flag suppliers as unavailable in BirchStreet when they shouldn't be used for new procurement. A supplier is marked for deactivation if the supplier profile is end-dated, the supplier site is end-dated, the supplier address is end-dated, the site is not flagged as a payment site, or the site is not flagged as a purchasing site. This multi-condition logic ensures that suppliers become unavailable in BirchStreet as soon as Oracle records indicate they should no longer receive new business.

The deactivation flag flows to BirchStreet as a data element in the supplier feed, where BirchStreet's intake process marks those vendors unavailable for selection by procurement users. This automated availability management prevents procurement exceptions from attempting to use suppliers that Oracle has marked inactive.

### Multi-Organization Mapping

The solution leverages Oracle Flex Value Sets to map procurement business units to BirchStreet organization identifiers. A configuration lookup (WMI_BIRCHSTREET_ORG_MAP) defines the mapping between Oracle business unit names and corresponding BirchStreet "inn codes," numeric identifiers that BirchStreet uses to segregate suppliers by operating entity. This externalized configuration enables the integration to support multiple business units without code changes as the organization structure evolves.

Each supplier site record includes the appropriate inn code based on its procurement business unit assignment, ensuring BirchStreet associates suppliers with the correct organizational contexts. This mapping maintains proper approval workflows and reporting segregation in BirchStreet while leveraging Oracle's native multi-org architecture.

### SFTP Delivery with Bursting

BI Publisher's bursting capability delivers the supplier file to multiple SFTP directories simultaneously—the outbound folder where BirchStreet retrieves files for processing and an archive folder that maintains a complete history of transmitted data. The file naming convention includes timestamps (bss_vendors_YYYYMMDDHHMMSS.txt) to prevent filename collisions and enable chronological sorting of historical transmissions.

Separate SFTP accounts for development, test, and production environments ensure proper change control and testing isolation. The integration uses BI Publisher's native SFTP delivery configuration, eliminating the need for additional middleware or file transfer utilities.

## Technical Highlights

**Complex SQL Data Integration:** The BI Publisher data model executes sophisticated SQL queries that join supplier tables (POZ_SUPPLIERS_V), address tables (POZ_SUPPLIER_ADDRESS_V), site tables (POZ_SUPPLIER_SITES_V, POZ_SUPPLIER_SITES_ALL_M), business unit tables (FUN_ALL_BUSINESS_UNITS_V), and site assignment tables (POZ_SITE_ASSIGNMENTS_ALL_M) to assemble complete supplier records. The query implements careful filtering logic to select only records meeting data quality standards and modification time windows, using NOT EXISTS clauses and inline views to express complex business rules efficiently.

**Geographic Reference Data Navigation:** The state and province code derivation demonstrates deep understanding of Oracle's geography and tax region data models. For US suppliers, the solution queries AP_INCOME_TAX_REGIONS to match state names against both short and long region names, using FETCH FIRST 1 ROWS ONLY to handle potential duplicates. For Canadian suppliers, it navigates HZ_GEOGRAPHY_IDENTIFIERS_VL and HZ_GEOGRAPHIES tables to extract province codes, filtering on primary flag settings and geography element codes. These reference table queries handle the variability in how suppliers enter state/province information while producing standardized two-character codes.

**Change Detection with Temporal Windows:** The WHERE clause combines multiple temporal conditions with OR logic to capture all relevant supplier changes: supplier creation dates, supplier last update dates, address creation dates, address last update dates, and supplier end dates all compared against a configurable hours-back parameter. This comprehensive temporal filtering ensures the integration captures modifications regardless of which table changed, while the parameter-driven lookback window provides operational flexibility to adjust sensitivity if needed.

**Data Quality Enforcement:** The integration implements validation rules directly in SQL WHERE clauses rather than attempting to filter or transform bad data in output processing. Required field checks (country IS NOT NULL, address1 IS NOT NULL) combine with conditional validations (state IS NOT NULL OR country NOT IN ('CA','US')) to express context-dependent requirements. This approach ensures only clean, complete records reach BirchStreet while maintaining query performance through early filtering.

**Dynamic Organization Mapping:** The solution uses a subquery against FND_FLEX_VALUES_VL and FND_FLEX_VALUE_SETS to dynamically map business units to inn codes, pulling from the WMI_BIRCHSTREET_ORG_MAP flex value set. This externalized configuration pattern allows business users with appropriate security to update org mappings through Oracle's standard value set maintenance screens without requiring developer intervention or code deployment.

**Text Template Generation:** The BI Publisher layout uses an RTF template with embedded eText formatting to generate the pipe-delimited text output that BirchStreet requires. The template references data model fields directly, performing string concatenation and null handling to produce properly formatted records. This declarative approach to file generation eliminates the need for custom PL/SQL formatting logic while leveraging BI Publisher's robust text output capabilities.

**Deactivation Status Calculation:** The deactivation flag derives from a complex CASE expression that evaluates multiple conditions: supplier end_date_active IS NOT NULL, pay_site_flag = 'N', address inactive_date IS NOT NULL, or site inactive_date IS NOT NULL. The expression returns 'Y' when any deactivation condition is met, and NULL (effectively empty string in output) when the supplier is fully active. This logic mirrors Oracle's own availability rules, ensuring consistent supplier status between systems.

**Remittance Email Hierarchy:** The integration implements intelligent email selection that prioritizes supplier site-level remittance email addresses over supplier profile-level email addresses, mirroring how Oracle Payments determines where to send remittance advice. This hierarchy ensures payment-related communications use the most specific contact information available, improving payment processing efficiency and supplier satisfaction.

**Scheduled Automation with BI Publisher:** The solution leverages BI Publisher's native scheduling capabilities rather than Oracle Concurrent Programs, simplifying deployment and eliminating dependencies on EBS-specific infrastructure. The report executes under a service account with Financial Integration Specialist role authorization, maintaining proper security segregation while enabling automated execution. Schedule frequency and execution parameters are configurable through BI Publisher's scheduling interface without requiring code changes.

## Results & Impact

**Procurement Efficiency:** Eliminated manual supplier data entry and reconciliation between Oracle and BirchStreet, freeing procurement team resources for strategic sourcing activities. Procurement users access current supplier information in BirchStreet immediately after Oracle updates, with typical propagation delays under two hours. The automated availability management prevents purchase order exceptions from targeting inactive suppliers, reducing procurement workflow disruptions.

**AP Automation Success:** Ensured 100% vendor code accuracy flowing from BirchStreet vouchers back to Oracle for payment processing. The maintained Oracle-to-BirchStreet identifier cross-reference enables seamless payment automation without manual code mapping or reconciliation. AP teams process invoice vouchers from BirchStreet knowing that vendor codes will match Oracle supplier records, eliminating payment posting failures that require research and correction.

**Data Quality Improvement:** The integration's validation rules surfaced incomplete supplier records in Oracle that would have created BirchStreet processing issues. Finance teams proactively remediated data quality gaps—adding missing phone numbers, email addresses, and properly formatted addresses—improving overall supplier master data hygiene. The enforced data completeness standards prevent future incomplete records from flowing to downstream systems.

**Operational Scalability:** The hourly automated synchronization scales effortlessly as the supplier base grows, with no incremental labor required regardless of supplier volume. New suppliers added to Oracle appear available in BirchStreet for procurement without manual setup or intervention. The solution handles hundreds of supplier updates per day during onboarding periods without performance degradation or operational impact.

**Geographic Flexibility:** Successfully addressed the complexity of multi-country address formatting, correctly handling United States state codes, Canadian province codes, and international address formats. Procurement users in BirchStreet receive properly formatted supplier addresses that support purchase order transmission and receiving documentation regardless of supplier geography.

**Technical Architecture Success:** The BI Publisher-based approach delivered a maintainable, supportable integration that IT teams can monitor and troubleshoot using standard Oracle tooling. The solution operates reliably in production without requiring custom code deployment, complex middleware, or specialized integration platforms. SFTP file delivery with automatic archiving provides complete audit trails and enables historical analysis of supplier data changes.

## Deliverables

- **BI Publisher Report and Data Model**: Complete supplier extract report (WMI BirchStreet Supplier with Curr Extract) with underlying data model (WMI BirchStreet Supplier with Curr DM) implementing complex SQL queries and validation logic
- **RTF Layout Template**: Text generation template (WMI Text Rows UTF8 V1.0.rtf) producing pipe-delimited output conforming to BirchStreet file format specifications
- **Bursting Configuration**: SFTP delivery configuration with dual-directory deployment (outbound for BirchStreet consumption, archive for audit history) and timestamped file naming
- **Flex Value Set Mapping**: Organization mapping configuration (WMI_BIRCHSTREET_ORG_MAP) enabling business-maintained mappings between Oracle procurement business units and BirchStreet inn codes
- **Schedule Configuration**: Hourly automated execution schedule with appropriate security settings and error notification handling
- **Technical Documentation**: Integration design document specifying file formats, data mappings, validation rules, SFTP directories, and operational procedures
- **Data Quality Standards**: Documented requirements for supplier site completeness ensuring Oracle records meet BirchStreet operational needs before synchronization

## Why This Matters

This integration demonstrates JMJ Cloud's ability to bridge Oracle ERP with specialized procurement platforms through robust, production-grade data synchronization solutions that address the real-world complexities of enterprise supplier master data management.

**Procurement Platform Integration Expertise:** Modern procurement transformations increasingly involve best-of-breed specialized platforms like BirchStreet that must integrate deeply with ERP supplier master data. Success requires understanding both the source system's data model complexity and the target platform's operational requirements. This integration showcases expertise in navigating Oracle Fusion's supplier, site, and address table relationships while meeting BirchStreet's specific format and data quality needs.

**Data Quality as Integration Discipline:** The solution demonstrates that effective integration goes beyond moving data—it requires enforcing data quality standards that ensure downstream systems receive operationally useful information. The validation framework prevents bad data propagation while surfacing data quality issues that require source system remediation. This discipline protects the integrity of both systems and builds confidence in automated workflows.

**Geographic and Regulatory Intelligence:** Address formatting requirements vary significantly across countries and systems, creating subtle integration challenges that simple field mapping approaches cannot address. The state and province code transformation logic shows deep understanding of Oracle's geography reference data and the intelligence to navigate complex lookup hierarchies. Organizations operating internationally need integration solutions that respect these complexities rather than imposing rigid formatting that loses data fidelity.

**Supplier Lifecycle Management:** The deactivation logic demonstrates that supplier synchronization encompasses more than just adding new vendors—it requires managing the complete supplier lifecycle including status changes that affect procurement availability. Automated deactivation prevents procurement exceptions and ensures both systems reflect consistent supplier availability, critical for organizations with robust supplier management policies and compliance requirements.

**BI Publisher as Integration Platform:** While often thought of only as a reporting tool, BI Publisher provides powerful capabilities for batch data extraction and file generation that make it an effective integration platform for scheduled data exports. This implementation proves that Oracle Cloud customers can leverage native tooling for many integration scenarios without requiring specialized middleware or integration-platform-as-a-service subscriptions, reducing licensing costs and architectural complexity.

**Operational Maintainability:** The solution prioritizes operational supportability through standard Oracle tooling, externalized configuration, and comprehensive documentation. IT teams can monitor execution through BI Publisher's job history, business users can update organization mappings through flex value set maintenance, and SFTP file archives provide complete audit trails. This operational maturity differentiates production-ready integrations from proof-of-concept implementations.

For hospitality organizations and other industries implementing BirchStreet or similar procurement platforms alongside Oracle ERP, this case study illustrates how thoughtful integration design addresses data quality, geographic complexity, and supplier lifecycle management requirements that determine whether procurement automation delivers its promised value or creates new operational burdens.
