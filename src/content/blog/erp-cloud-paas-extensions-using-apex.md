---
title: "ERP Cloud PaaS Extensions using APEX"
date: 2017-09-11
author: "Jon Dixon"
tags: ["APEX", "Oracle Cloud", "ERP Cloud", "PaaS", "Integration"]
summary: "This post discusses extending Oracle ERP Cloud functionality through APEX as a Platform-as-a-Service solution, building custom pages that can be embedded directly into ERP Cloud."
---

Oracle ERP Cloud is a powerful solution, but organizations often need functionality beyond what the standard product provides. Oracle suggests meeting these needs through the use of PaaS (platform-as-a-service) solutions, building custom pages that can be embedded into ERP Cloud.

This post explores how APEX serves as an excellent PaaS option for extending ERP Cloud.

![ERP Cloud PaaS Extensions](/images/blog/erp-cloud-paas-apex/erp-cloud-paas-apex-min.png)

## Architecture Options

When building PaaS extensions, you have two primary approaches:

### Option 1: Java Cloud Service + APEX

Use Java Cloud Service (JCS) alongside APEX, where JCS handles specific compute needs and APEX provides the user interface and data storage.

### Option 2: APEX-Centric

Consolidate development entirely within APEX, avoiding JCS patching downtime in production environments. APEX can handle scheduled jobs, REST integrations, and all UI requirements.

![Architecture Diagram](/images/blog/erp-cloud-paas-apex/architecture-diagram_orig.png)

We typically recommend the APEX-centric approach for simpler deployment and maintenance.

## Integration Method

Pages integrate with ERP Cloud via the Page Integration functionality using JSON Web Tokens (JWT) for security. This allows custom APEX pages to appear seamlessly within the ERP Cloud interface.

![Page Integration](/images/blog/erp-cloud-paas-apex/page-integration_orig.png)

Users navigate to the integrated page from within ERP Cloud, and the APEX page displays within the ERP Cloud frame, maintaining a consistent user experience.

## Use Case 1: Integration Portal

Streamlining File Based Data Import (FBDi) processes is a common requirement. Standard ERP Cloud imports require multiple steps:

1. Prepare spreadsheet template
2. Upload to UCM
3. Run ESS job to import
4. Check for errors
5. Repeat as needed

![Integration Portal](/images/blog/erp-cloud-paas-apex/integration-portal_orig.png)

An APEX Integration Portal can consolidate these steps:

- Single upload interface for journal imports and bank statements
- Automatic UCM upload via REST API
- ESS job submission
- Status monitoring and error display
- Historical tracking of all imports

## Use Case 2: Project Team Management

Managing PPM project team assignments through the standard UI can be cumbersome for bulk updates. An APEX extension provides:

- Shuttle control for adding/removing team members
- REST API integration with PPM Cloud
- Bulk operations in a single transaction
- Visual feedback on current assignments

![Team Management](/images/blog/erp-cloud-paas-apex/team-management_orig.png)

The APEX page calls PPM REST APIs (as discussed in our PPM Cloud REST API post) to manage assignments programmatically.

## Use Case 3: Role and Privilege Analysis

Security analysis in ERP Cloud often requires extracting reports and manually reviewing assignments. An APEX extension can:

- Extract security setup via scheduled jobs
- Store analysis data in APEX tables
- Display user security access in custom UI
- Provide filtering and export capabilities
- Track changes over time

![Security Analysis](/images/blog/erp-cloud-paas-apex/security-analysis_orig.png)

This gives security administrators better visibility than the standard ERP Cloud reports provide.

## Use Case 4: Salesforce Opportunities

Displaying data from external cloud applications within ERP Cloud demonstrates the flexibility of PaaS extensions. An APEX page can:

- Connect to Salesforce REST APIs
- Display opportunities related to ERP Cloud customers
- Show pipeline and forecast data
- Link to Salesforce records for details

![Salesforce Integration](/images/blog/erp-cloud-paas-apex/salesforce-integration_orig.png)

Users see a unified view without switching between applications.

## Technical Considerations

### JWT Authentication

ERP Cloud passes a JWT token when launching integrated pages. Your APEX application should:

1. Validate the JWT signature
2. Extract user identity from claims
3. Apply appropriate authorization

### Database Connectivity

APEX can connect to ERP Cloud data via:

- **REST APIs**: For transactional operations
- **BI Publisher reports**: For bulk data extraction
- **FBDI imports**: For bulk data updates

### Hosting Options

Your APEX instance can run on:

- **Oracle Database Cloud Service**: Managed Oracle database with APEX
- **Autonomous Database**: Fully managed with automatic scaling
- **On-premise**: If you prefer self-managed infrastructure

## Conclusion

JMJ has designed and installed multiple APEX PaaS extensions for ERP Cloud customers. The combination of APEX's rapid development capabilities, ERP Cloud's integration framework, and REST APIs creates powerful opportunities for extending your cloud ERP.

Benefits of this approach:

- **Rapid development**: Build extensions in days, not months
- **Seamless integration**: Pages appear within ERP Cloud
- **Lower cost**: APEX licensing included with database
- **Flexibility**: Connect to any system with REST APIs

If your organization needs functionality beyond standard ERP Cloud, APEX PaaS extensions offer a practical, cost-effective solution.

---

Jon Dixon, Co-Founder JMJ Cloud
