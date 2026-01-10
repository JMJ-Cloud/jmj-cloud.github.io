---
title: "Automated Customer Feedback System with SurveyMonkey Integration"
status: "Active"
year: 2024
summary: "Built seamless REST API integration between Oracle APEX and SurveyMonkey to automate customer satisfaction tracking, NPS scoring, and feedback collection across 40+ galvanizing plants."
technologies:
  - "Oracle APEX"
  - "SurveyMonkey API"
  - "PL/SQL"
  - "REST APIs"
  - "APEX Automations"
  - "Oracle E-Business Suite"
  - "Multi-Org Security"
industry: "Manufacturing"
metrics:
  - "Automated survey delivery to customers after job completion"
  - "Real-time NPS score tracking across all facilities"
  - "Zero manual survey administration overhead"
  - "40+ plants unified on single feedback platform"
  - "500+ API calls per day with intelligent rate limiting"
featured: true
order: 4
---

## Project Overview

A multi-plant galvanizing company needed systematic customer feedback to measure satisfaction, identify service issues, and track performance across their 40+ facilities. Their existing approach relied on sporadic phone calls and informal conversations—providing no quantifiable metrics, no trending data, and no early warning system for customer dissatisfaction. Management had no visibility into customer sentiment, and service problems often went undetected until customers reduced orders or switched providers.

We built a comprehensive SurveyMonkey integration that automatically sends satisfaction surveys to customers after job completion, collects responses in real-time, calculates Net Promoter Scores, and provides detailed analytics on customer feedback trends. The solution seamlessly integrates with the Digital Galvanizing System and Oracle E-Business Suite, triggering surveys based on actual order completion events and enriching customer profiles with satisfaction data.

The platform now captures structured feedback from customers across all facilities, enabling data-driven service improvements and proactive issue resolution. Operations managers track NPS scores by plant, customer segment, and time period—transforming customer feedback from anecdotal impressions into actionable business intelligence.

## Business Challenge

Without systematic customer feedback collection, the organization operated blind to customer satisfaction levels and service quality trends:

**No Quantifiable Satisfaction Metrics** — Management had no objective way to measure customer satisfaction or compare performance across different plants. Service quality discussions relied on anecdotal feedback from sales representatives or reactive responses to complaints, making it impossible to identify systemic issues or track improvement initiatives.

**Reactive Problem Detection** — Customer service problems surfaced only when customers complained directly or reduced their order volume. By that point, relationships were already damaged and recovery efforts became defensive rather than proactive. The company needed early warning indicators that customers were dissatisfied before business was lost.

**Manual Survey Administration Overhead** — Attempting to collect feedback manually would require sales representatives to remember to send surveys, track responses, compile results, and analyze trends. This administrative burden made consistent feedback collection impractical across a geographically distributed customer base.

**No Performance Benchmarking** — Without systematic data collection, the company couldn't compare customer satisfaction across different plants, identify best practices from high-performing facilities, or hold underperforming locations accountable for service quality improvements.

**Limited Actionability** — Even when feedback was collected, it existed in email threads or spreadsheets without connection to specific jobs, plants, or customer characteristics. This fragmentation made it difficult to identify patterns, prioritize improvement initiatives, or measure the impact of service changes.

**Multi-Language Complexity** — Operating across the United States and Canada introduced language considerations. Canadian customers in French-speaking regions required surveys in their native language, adding complexity to survey administration and response collection.

## Solution Architecture

A fully automated REST API integration between Oracle APEX, SurveyMonkey, and Oracle E-Business Suite that transforms customer feedback from ad-hoc conversations into systematic data collection and analysis.

### Automated Survey Delivery

The system monitors job completion events in the Digital Galvanizing System and automatically triggers survey invitations to customers. When a job completes and ships, the platform identifies the appropriate contact at the customer organization, selects the correct survey template based on plant and customer characteristics, and submits the invitation through SurveyMonkey's REST API. Customers receive professional survey emails directly from SurveyMonkey with the company's branding, asking about their experience with specific completed orders.

Survey invitations include contextual information linking responses back to specific jobs, plants, and customer contacts. This granular association enables detailed analysis connecting satisfaction scores to operational characteristics like turnaround time, coating quality, or service responsiveness. The system tracks invitation status—delivered, bounced, or opted out—ensuring accurate response rate calculations and identifying delivery issues that require attention.

### Real-Time Response Collection

APEX Automations poll the SurveyMonkey API regularly to retrieve completed survey responses, parsing response data and storing it in custom Oracle database tables integrated with the Customer Service Hub. Each response includes the customer's NPS rating, open-ended feedback comments, and metadata linking the response to the originating job and plant. This real-time collection ensures customer feedback is available immediately for review by plant managers and customer service representatives.

The automation handles SurveyMonkey's response data structure, extracting answers to specific questions and normalizing them into queryable database columns. Free-text comments are preserved in their entirety while standardized ratings are converted to numeric scores for trending analysis. The system maintains complete response history, enabling longitudinal analysis of customer satisfaction over time.

### NPS Score Analytics

The platform calculates Net Promoter Scores at multiple levels—enterprise-wide, by plant, by customer segment, and by time period. NPS reporting replicates SurveyMonkey's visualization format with pie charts showing the distribution of Promoters (9-10 ratings), Passives (7-8 ratings), and Detractors (0-6 ratings). Color-coded displays make it immediately apparent whether customer sentiment is trending positive or negative.

Interactive reports allow managers to drill down from enterprise-level NPS to specific plants, then to individual customer responses and the jobs that generated those responses. This analytical depth enables root cause analysis when satisfaction drops—identifying whether issues are isolated incidents or systemic problems requiring operational changes. Trend charts show NPS trajectories over months and quarters, supporting continuous improvement initiatives and executive performance reviews.

### Customer Reconciliation and Data Quality

The system maintains customer name consistency between survey invitations and Oracle E-Business Suite customer master data. When customers are submitted for surveys, the platform captures the exact customer name as it exists in the ERP system, preventing discrepancies from name changes or updates that occur after invitation submission. This reconciliation ensures survey responses can always be matched to the correct customer record regardless of subsequent data changes.

The integration validates customer contact information before submitting survey invitations, checking email address formats and preventing duplicate invitations within configurable time windows. This data quality enforcement improves response rates by ensuring surveys reach valid email addresses and prevents survey fatigue from excessive invitation frequency.

### Multi-Language Support

For Canadian operations serving French-speaking customers, the system supports French-language survey deployment through SurveyMonkey's translation capabilities. Survey templates exist in both English and French, with the platform selecting the appropriate language version based on customer location and language preference settings in Oracle EBS. This localization ensures customers receive surveys in their preferred language, improving response rates and the quality of feedback from bilingual markets.

## Technical Highlights

**REST API Integration Architecture:** The solution uses Oracle APEX's APEX_WEB_SERVICE package to make REST API calls to SurveyMonkey's v3 API endpoints. Authentication uses long-lived OAuth tokens stored in Oracle EBS lookup values (AZZ_SURVEY_MONKEY_CONFIGS) rather than APEX web credentials, enabling token rotation without APEX application changes. API requests include proper headers for content type, authentication bearer tokens, and SurveyMonkey-specific parameters. The integration handles SurveyMonkey's response formats, parsing JSON structures for survey metadata, invitation status, and response data.

**Rate Limiting and Quota Management:** SurveyMonkey imposes API rate limits—500 calls per day with allowances up to 750 calls twice within 30-day periods. The platform implements intelligent rate limiting logic that tracks daily API call consumption, queues requests when approaching limits, and prioritizes critical operations like response collection over routine status checks. An API limiter module monitors usage against quotas and generates alerts when consumption patterns risk exceeding available capacity. This proactive management prevents service disruptions while maximizing the value extracted from available API capacity.

**APEX Automations for Background Processing:** Survey invitation submission and response collection execute via APEX Automations rather than Oracle Concurrent Programs. This architectural choice leverages APEX's native scheduling capabilities and eliminates dependencies on Oracle EBS concurrent manager configuration. Automations run on configurable schedules—response collection occurs every few hours to maintain near-real-time feedback visibility, while invitation submission processes batches of completed jobs overnight. The automation framework includes error handling, logging, and retry logic for transient failures.

**Custom Database Tables:** The solution uses purpose-built tables (XXAZZ_CSH_SM_INVITATIONS and XXAZZ_CSH_SM_RESPONSES) rather than generic survey tracking structures. The invitation table stores complete submission context including customer names, email addresses, survey types, plant identifiers, and job references—ensuring survey context never becomes disconnected from operational data. The response table captures detailed answer data with separate columns for NPS scores, comment text, and response timestamps. Both tables include extensive indexing on foreign keys, status flags, and date columns to support fast querying across large response datasets.

**Email Status Tracking:** The platform monitors email delivery status for survey invitations, distinguishing between successfully delivered invitations, bounced emails, and opt-out requests. When SurveyMonkey reports delivery failures, the system updates invitation records with appropriate status codes ("Bounced or Opted Out") and prevents future survey attempts to invalid addresses. This email status tracking maintains accurate response rate calculations by excluding undeliverable invitations from the denominator and flags contact data quality issues requiring customer service follow-up to update email addresses.

**Survey Configuration Management:** Survey templates, API tokens, and operational parameters are managed through EBS lookup codes and database views rather than hard-coded values. The XXAZZ_CSH_SM_SURVEYS_V view provides centralized survey configuration, mapping survey names to SurveyMonkey survey IDs, defining eligible customer segments, and specifying language preferences. This externalized configuration enables adding new survey types, updating API credentials, or adjusting survey logic without application code changes—supporting operational flexibility and simplified deployment across environments.

**Integration with Customer Service Hub:** Survey responses feed into the Customer Service Hub, enriching customer profiles with satisfaction data. Sales representatives access survey results when reviewing customer accounts, seeing recent NPS scores and feedback comments alongside order history and AR aging. This integration ensures customer satisfaction data influences sales and service decisions—representatives can proactively reach out to detractors to address concerns or thank promoters for positive feedback. The unified view eliminates the need to log into SurveyMonkey separately, keeping all customer intelligence in a single interface.

**Error Handling and Recovery:** The integration implements comprehensive error handling for API failures, network timeouts, and malformed response data. When invitation submissions fail, the system logs detailed error information including API response codes and messages, marking invitation records with error status for manual review. Automation retry logic attempts failed operations on subsequent execution cycles, recovering automatically from transient issues. For persistent failures, email alerts notify administrators of problems requiring intervention. This robust error handling ensures survey operations continue even when individual API calls fail.

## Results & Impact

**Operational Efficiency:** Eliminated manual survey administration overhead that would have required sales representatives to remember to send surveys, track responses, and compile results. The automated workflow processes hundreds of surveys monthly without human intervention, ensuring consistent feedback collection across all facilities regardless of individual sales rep diligence. Plant managers and executives access real-time satisfaction data without waiting for manual reports.

**Customer Insight Quality:** Captured structured, quantifiable feedback replacing anecdotal impressions and selective recall. NPS scores provide objective performance metrics enabling fair comparisons across plants and time periods. The correlation between survey responses and specific jobs enables root cause analysis—when satisfaction drops, operations teams can identify whether issues relate to coating quality, turnaround time, communication, or other service factors.

**Proactive Issue Detection:** Survey responses flag customer dissatisfaction before relationships deteriorate. Customer service representatives monitoring NPS trends can reach out to detractors immediately, addressing concerns while issues are fresh and demonstrating responsive service. This proactive approach transforms how the company manages customer relationships—from reactive complaint handling to predictive satisfaction management.

**Data-Driven Decisions:** Management gained quantifiable metrics for evaluating service quality improvements, comparing plant performance, and setting customer satisfaction targets. Executive dashboards showing enterprise-wide NPS trends inform strategic decisions about service investments and operational priorities. The ability to segment satisfaction data by customer type, plant location, or service characteristics enables targeted improvement initiatives addressing specific pain points.

**Technical Architecture Success:** The REST API integration demonstrates Oracle APEX's capabilities for connecting with modern SaaS platforms. SurveyMonkey provides professional survey delivery and design tools while APEX manages the operational workflow and data integration with ERP systems. This hybrid approach leverages each platform's strengths—SurveyMonkey's survey expertise and APEX's business process orchestration—creating a solution superior to either platform alone.

**Scalability and Maintainability:** The externalized configuration through EBS lookups and database views enables adding new survey types, updating credentials, or adjusting logic without code deployment cycles. Rate limiting management ensures the solution operates reliably within SurveyMonkey's API constraints while maximizing feedback collection. The architecture scales to support growing survey volumes as the business adds plants or increases customer base without requiring architectural changes.

## Deliverables

- **REST API Integration Layer**: PL/SQL packages implementing SurveyMonkey v3 API calls for invitation submission, response collection, and status monitoring with OAuth authentication and error handling
- **APEX Automations**: Scheduled background jobs for survey invitation processing and response collection with configurable execution frequencies and retry logic
- **Custom Database Tables**: XXAZZ_CSH_SM_INVITATIONS and XXAZZ_CSH_SM_RESPONSES tables with supporting indexes, foreign keys, and audit columns integrated with Customer Service Hub data model
- **NPS Reporting Dashboards**: Interactive APEX reports replicating SurveyMonkey visualizations with drill-down capabilities showing Promoter/Passive/Detractor distributions, trend analysis, and response detail views
- **Rate Limiting Framework**: API quota monitoring and throttling logic preventing SurveyMonkey rate limit violations while maximizing survey throughput
- **Survey Configuration Management**: EBS lookup codes storing API tokens across environments (DEV/TEST/PROD) and survey configuration views mapping business processes to SurveyMonkey surveys
- **Email Status Tracking**: Delivery status monitoring identifying bounced emails and opt-outs with automated invitation record updates and contact data quality reporting
- **Customer Service Hub Integration**: Survey response display within customer profiles and sales activity dashboards providing immediate satisfaction visibility during customer interactions
- **Technical Documentation**: API integration specifications, data model documentation, automation job configurations, and operational procedures for survey administration

## Why This Matters

This project demonstrates how modern Oracle APEX applications can integrate seamlessly with best-of-breed SaaS platforms through REST APIs—creating solutions that leverage specialized cloud services while maintaining unified data environments and business process control. Organizations often face a false choice between all-cloud SaaS architectures and traditional on-premises ERP systems. This integration proves that hybrid approaches deliver superior outcomes by combining SaaS innovation with ERP data integration depth.

**SaaS Integration Expertise:** The SurveyMonkey integration showcases technical capabilities increasingly critical for enterprise IT organizations. Modern business processes span multiple systems—ERP for transactions, specialized SaaS for specific functions, and custom applications for unique workflows. Success requires architects who understand REST API patterns, authentication protocols, rate limiting strategies, and error handling best practices. This project demonstrates proficiency in connecting Oracle environments with cloud services through production-grade integrations that handle edge cases, maintain data quality, and operate reliably at scale.

**Customer-Centric Operations:** Manufacturing companies traditionally focus inward—optimizing production processes, managing costs, and meeting delivery commitments. Systematic customer feedback collection shifts attention outward, making customer satisfaction a measurable operational metric alongside efficiency and quality metrics. This cultural shift from assuming customer satisfaction to actively measuring it enables data-driven service improvements and competitive differentiation. Companies that treat customer feedback as optional will lose business to competitors who make satisfaction measurement central to operations.

**Rapid Value Delivery:** Building this integration within Oracle APEX rather than deploying separate survey administration systems delivered value quickly without introducing operational complexity. Users access survey data in the same Customer Service Hub they already use for AR aging, order status, and sales activity tracking. This unified interface accelerates adoption compared to forcing users to log into separate SurveyMonkey accounts, improving engagement and ensuring satisfaction data influences daily decisions. The development approach—leveraging APEX Automations, REST APIs, and custom tables—proves that sophisticated SaaS integrations don't require middleware platforms or complex integration-as-a-service subscriptions.

**Oracle APEX Versatility:** This project expands perceptions of what Oracle APEX can accomplish. Many organizations view APEX as an internal forms-over-data tool for replacing legacy client-server applications. The SurveyMonkey integration demonstrates APEX functioning as an integration platform—orchestrating workflows across SaaS services, ERP systems, and custom applications. APEX's REST API capabilities, scheduling framework, and data management features make it a compelling alternative to specialized integration platforms for scenarios where workflow logic and data transformation requirements align well with database-centric development.

**Strategic Architecture Patterns:** The design principles applied here—externalized configuration, comprehensive error handling, rate limiting, and unified data models—apply broadly to enterprise integration challenges. Organizations building connections between Oracle environments and cloud services will encounter similar technical requirements regardless of the specific SaaS platforms involved. This case study provides a proven pattern for thinking about API integration architecture, data synchronization strategies, and operational monitoring that transfers to countless integration scenarios beyond customer feedback collection.

For manufacturers seeking to improve customer satisfaction measurement, demonstrate service quality differentiation, or build data-driven customer success capabilities, this integration illustrates how Oracle APEX delivers business value by connecting ERP foundations with modern cloud services. The approach proves economically viable—leveraging existing Oracle Database infrastructure and APEX development productivity rather than requiring expensive middleware or integration platforms—while maintaining enterprise-grade reliability and operational control.
