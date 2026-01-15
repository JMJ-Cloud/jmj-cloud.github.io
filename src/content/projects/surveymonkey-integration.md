---
title: "Automated Customer Feedback System with SurveyMonkey Integration"
status: "Active"
date: 2024-11-15
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
  - "Automated survey delivery after job completion"
  - "Real-time NPS score tracking across all facilities"
  - "Zero manual survey administration overhead"
  - "40+ plants unified on single feedback platform"
featured: true
order: 4
---

## Project Overview

A multi-plant galvanizing company needed systematic customer feedback to measure satisfaction, identify service issues, and track performance across their 40+ facilities. Their existing approach relied on sporadic phone calls and informal conversations—providing no quantifiable metrics, no trending data, and no early warning system for customer dissatisfaction. Management had no visibility into customer sentiment, and service problems often went undetected until customers reduced orders or switched providers.

We built a comprehensive SurveyMonkey integration that automatically sends satisfaction surveys to customers after job completion, collects responses in real-time, calculates Net Promoter Scores, and provides detailed analytics on customer feedback trends. The solution seamlessly integrates with the Digital Galvanizing System and Oracle E-Business Suite, triggering surveys based on actual order completion events and enriching customer profiles with satisfaction data.

The platform now captures structured feedback from customers across all facilities, enabling data-driven service improvements and proactive issue resolution. Operations managers track NPS scores by plant, customer segment, and time period—transforming customer feedback from anecdotal impressions into actionable business intelligence.

## Business Challenge

Without systematic customer feedback collection, the organization operated blind to customer satisfaction levels and service quality trends:

**No Quantifiable Satisfaction Metrics** — Management had no objective way to measure customer satisfaction or compare performance across different plants. Service quality discussions relied on anecdotal feedback from sales representatives or reactive responses to complaints.

**Reactive Problem Detection** — Customer service problems surfaced only when customers complained directly or reduced their order volume. By that point, relationships were already damaged and recovery efforts became defensive rather than proactive.

**Manual Survey Administration Overhead** — Attempting to collect feedback manually would require sales representatives to remember to send surveys, track responses, compile results, and analyze trends. This administrative burden made consistent feedback collection impractical.

**No Performance Benchmarking** — Without systematic data collection, the company couldn't compare customer satisfaction across different plants, identify best practices from high-performing facilities, or hold underperforming locations accountable.

**Multi-Language Complexity** — Operating across the United States and Canada introduced language considerations. Canadian customers in French-speaking regions required surveys in their native language.

## Solution Architecture

A fully automated REST API integration between Oracle APEX, SurveyMonkey, and Oracle E-Business Suite that transforms customer feedback from ad-hoc conversations into systematic data collection and analysis.

### Automated Survey Delivery

The system monitors job completion events in the Digital Galvanizing System and automatically triggers survey invitations to customers. When a job completes and ships, the platform identifies the appropriate contact at the customer organization, selects the correct survey template based on plant and customer characteristics, and submits the invitation through SurveyMonkey's REST API.

Survey invitations include contextual information linking responses back to specific jobs, plants, and customer contacts. This granular association enables detailed analysis connecting satisfaction scores to operational characteristics like turnaround time, coating quality, or service responsiveness.

### Real-Time Response Collection

APEX Automations poll the SurveyMonkey API regularly to retrieve completed survey responses, parsing response data and storing it in custom Oracle database tables integrated with the Customer Service Hub. Each response includes the customer's NPS rating, open-ended feedback comments, and metadata linking the response to the originating job and plant.

The automation handles SurveyMonkey's response data structure, extracting answers to specific questions and normalizing them into queryable database columns. The system maintains complete response history, enabling longitudinal analysis of customer satisfaction over time.

### NPS Score Analytics

The platform calculates Net Promoter Scores at multiple levels—enterprise-wide, by plant, by customer segment, and by time period. NPS reporting replicates SurveyMonkey's visualization format with pie charts showing the distribution of Promoters (9-10 ratings), Passives (7-8 ratings), and Detractors (0-6 ratings).

Interactive reports allow managers to drill down from enterprise-level NPS to specific plants, then to individual customer responses and the jobs that generated those responses. Trend charts show NPS trajectories over months and quarters, supporting continuous improvement initiatives.

### Customer Service Hub Integration

Survey responses feed into the Customer Service Hub, enriching customer profiles with satisfaction data. Sales representatives access survey results when reviewing customer accounts, seeing recent NPS scores and feedback comments alongside order history and AR aging. Representatives can proactively reach out to detractors to address concerns or thank promoters for positive feedback.

## Technical Highlights

**REST API Integration Architecture:** The solution uses Oracle APEX's APEX_WEB_SERVICE package to make REST API calls to SurveyMonkey's v3 API endpoints. Authentication uses long-lived OAuth tokens stored in Oracle EBS lookup values, enabling token rotation without APEX application changes. The integration handles SurveyMonkey's response formats, parsing JSON structures for survey metadata, invitation status, and response data.

**Rate Limiting and Quota Management:** SurveyMonkey imposes API rate limits—500 calls per day with allowances up to 750 calls twice within 30-day periods. The platform implements intelligent rate limiting logic that tracks daily API call consumption, queues requests when approaching limits, and prioritizes critical operations. An API limiter module monitors usage against quotas and generates alerts when consumption patterns risk exceeding available capacity.

**APEX Automations for Background Processing:** Survey invitation submission and response collection execute via APEX Automations rather than Oracle Concurrent Programs. This architectural choice leverages APEX's native scheduling capabilities. Automations run on configurable schedules with error handling, logging, and retry logic for transient failures.

**Email Status Tracking:** The platform monitors email delivery status for survey invitations, distinguishing between successfully delivered invitations, bounced emails, and opt-out requests. This tracking maintains accurate response rate calculations and flags contact data quality issues requiring follow-up.

**Survey Configuration Management:** Survey templates, API tokens, and operational parameters are managed through EBS lookup codes and database views rather than hard-coded values. This externalized configuration enables adding new survey types, updating API credentials, or adjusting survey logic without application code changes.

**Error Handling and Recovery:** The integration implements comprehensive error handling for API failures, network timeouts, and malformed response data. Automation retry logic attempts failed operations on subsequent execution cycles, recovering automatically from transient issues.

## Results & Impact

**Operational Efficiency:** Eliminated manual survey administration overhead that would have required sales representatives to remember to send surveys, track responses, and compile results. The automated workflow processes hundreds of surveys monthly without human intervention.

**Customer Insight Quality:** Captured structured, quantifiable feedback replacing anecdotal impressions. NPS scores provide objective performance metrics enabling fair comparisons across plants and time periods. The correlation between survey responses and specific jobs enables root cause analysis.

**Proactive Issue Detection:** Survey responses flag customer dissatisfaction before relationships deteriorate. Customer service representatives monitoring NPS trends can reach out to detractors immediately, addressing concerns while issues are fresh.

**Data-Driven Decisions:** Management gained quantifiable metrics for evaluating service quality improvements, comparing plant performance, and setting customer satisfaction targets. Executive dashboards showing enterprise-wide NPS trends inform strategic decisions.

**Technical Architecture Success:** The REST API integration demonstrates Oracle APEX's capabilities for connecting with modern SaaS platforms. This hybrid approach leverages each platform's strengths—SurveyMonkey's survey expertise and APEX's business process orchestration.

## Deliverables

- **REST API Integration Layer**: PL/SQL packages implementing SurveyMonkey v3 API calls for invitation submission, response collection, and status monitoring with OAuth authentication

- **APEX Automations**: Scheduled background jobs for survey invitation processing and response collection with configurable execution frequencies and retry logic

- **Custom Database Tables**: Invitation and response tables with supporting indexes integrated with Customer Service Hub data model

- **NPS Reporting Dashboards**: Interactive APEX reports with drill-down capabilities showing Promoter/Passive/Detractor distributions, trend analysis, and response details

- **Rate Limiting Framework**: API quota monitoring and throttling logic preventing rate limit violations while maximizing survey throughput

- **Survey Configuration Management**: EBS lookup codes and configuration views mapping business processes to SurveyMonkey surveys

- **Customer Service Hub Integration**: Survey response display within customer profiles providing immediate satisfaction visibility

- **Technical Documentation**: API integration specifications, data model documentation, and operational procedures

## Why Oracle APEX for SaaS Integration?

Oracle APEX was the ideal choice for this SurveyMonkey integration because it:

- **Provides native REST API capabilities** through APEX_WEB_SERVICE—no middleware or integration platforms required
- **Offers built-in scheduling** via APEX Automations for background processing without EBS concurrent manager dependencies
- **Integrates seamlessly** with Oracle EBS data—customer master, order history, and plant configurations
- **Delivers unified user experience** by embedding survey data in the Customer Service Hub users already use daily
- **Enables rapid development** with immediate iteration capability as survey requirements evolved
- **Maintains data control** within the Oracle environment rather than replicating sensitive customer data to external systems
