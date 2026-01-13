---
title: "Retire Your E-Business Suite Data in Style with APEX"
date: 2017-07-20
author: "Jon Dixon"
tags: ["APEX", "EBS", "Oracle", "Data Archiving", "Migration"]
summary: "This post discusses what to do with years of accumulated EBS data when migrating to newer systems. APEX provides an elegant solution for retiring legacy data while maintaining access."
---

I've been implementing Oracle E-Business Suite since 1994. While EBS was and is valuable, organizations eventually need to migrate to newer systems like Oracle ERP Cloud. This post addresses a common challenge: what to do with years of accumulated EBS data?

![Retire EBS Data with APEX](/images/blog/retire-ebs-apex/retire-ebs-apex-min.png)

## The Problem

Legal and compliance requirements often mandate retaining ERP data for extended periods. Some industries, like nuclear energy, may need to keep records for up to 100 years. When migrating away from EBS, organizations face difficult choices:

- **Maintain legacy EBS in read-only mode**: Expensive - requires ongoing hardware, patching, and licensing
- **Convert all historical data to new ERP**: Costly for large datasets, especially complex transactional history
- **Keep the old environment running**: Delays the inevitable and adds to technical debt

The more years of data you have and the more complex the data you are migrating, the bigger the bill. Converting unnecessary historical data into your new ERP significantly increases implementation costs.

![EBS Data Challenge](/images/blog/retire-ebs-apex/ebs-data-challenge_orig.png)

## The Solution: APEX

JMJ Cloud proposed an alternative approach for a client inheriting an EBS R11.5.10 database: migrate the database to a smaller Linux server and build an APEX frontend for read-only access.

![APEX Solution](/images/blog/retire-ebs-apex/apex-solution_orig.png)

This approach offers significant advantages:

- **Reduced infrastructure**: No need for full EBS application tier
- **Lower maintenance**: Just the database and ORDS/Tomcat
- **Modern interface**: Clean, user-friendly UI instead of Forms
- **Cloud potential**: Could host on services like Exadata Express ($175/month for 20GB)

## Why APEX?

APEX is the ideal technology for this scenario:

### Runs on Oracle Database

APEX is included with your Oracle Database license at no additional cost. Since you're already maintaining the database for historical data, APEX adds no licensing overhead.

### Minimal Infrastructure

With ORDS and a lightweight application server, you have everything needed to serve APEX applications. No middleware, no complex deployments.

![Architecture Simplicity](/images/blog/retire-ebs-apex/architecture-simple_orig.png)

### Cloud Migration Path

The APEX application can easily move to Oracle Cloud when you're ready. Exadata Express, Database Cloud Service, or Autonomous Database all support APEX.

### Powerful Reporting

APEX Interactive Reports provide filtering, sorting, charting, and export capabilities out of the box. Users can create their own saved reports for recurring queries.

![Interactive Reports](/images/blog/retire-ebs-apex/interactive-reports_orig.png)

### Integrated Security

APEX supports multiple authentication schemes including Active Directory integration. You can control who sees what data using APEX's built-in authorization framework.

## Implementation Approach

The implementation follows these steps:

1. **Clone the EBS database** to a smaller server (or cloud instance)
2. **Remove EBS application tier** - it's no longer needed
3. **Install APEX and ORDS** on the database server
4. **Build APEX pages** against EBS tables and views
5. **Implement security** based on client requirements

![Implementation Steps](/images/blog/retire-ebs-apex/implementation-steps_orig.png)

## Sample Application

The resulting application handles various EBS organizational constructs including:

- General Ledger balances and journals
- Accounts Payable invoices and payments
- Accounts Receivable transactions
- Inventory on-hand quantities
- Purchase orders and receipts

![Sample Application](/images/blog/retire-ebs-apex/sample-app_orig.png)

Each module presents data in clean, searchable Interactive Reports. Users can drill down to document details, export data to Excel, and create custom views.

## Cost Comparison

Consider the cost differential:

**Full EBS Maintenance**:
- Application server infrastructure
- Database server (sized for EBS)
- EBS patches and updates
- DBA time for maintenance
- Potential Oracle support costs

**APEX Archive**:
- Single database server (can be much smaller)
- Minimal APEX/ORDS maintenance
- No ongoing EBS patching
- Significantly reduced DBA overhead

The savings can be substantial, especially for organizations maintaining legacy EBS instances purely for historical data access.

## Conclusion

When migrating from Oracle E-Business Suite, don't assume you need to either convert all historical data or maintain a full legacy environment. APEX provides an elegant middle ground: retire the EBS application while preserving easy access to historical data.

This approach is:

- **Cost-effective**: Dramatically reduces infrastructure and maintenance costs
- **User-friendly**: Modern interface instead of legacy Forms
- **Compliant**: Data remains accessible for audit and legal requirements
- **Future-proof**: Easy path to cloud hosting when ready

---

Jon Dixon, Co-Founder JMJ Cloud
