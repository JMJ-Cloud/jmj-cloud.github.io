---
title: "Oracle ERP Conversions Made Easy with APEX Part 1"
date: 2020-05-07
author: "Jon Dixon"
tags: ["APEX", "Oracle ERP", "ERP Cloud", "Data Conversion", "REST", "FBDI"]
summary: "Part 1 of our series on using Oracle APEX to streamline data conversions for Oracle ERP Cloud, covering the architecture and initial setup."
---

## Introduction

Migrating data to Oracle ERP Cloud is one of the most challenging aspects of any ERP implementation. Whether you're converting from Oracle E-Business Suite, a legacy system, or spreadsheets, Oracle APEX can dramatically simplify the process.

This is Part 1 of a three-part series on ERP conversions with APEX:

- Part 1: Architecture and Setup (this post)
- [Part 2: Data Transformation](/blog/oracle-erp-conversions-apex-part-2)
- [Part 3: Error Handling and Production](/blog/oracle-erp-conversions-apex-part-3)

## Why APEX for ERP Conversions?

Traditional ERP conversion approaches involve:
- Complex spreadsheets with macros
- Custom scripts that are hard to maintain
- Limited visibility into conversion progress
- Manual error handling

APEX addresses these challenges by providing:

1. **User-Friendly Interface**: Business users can review and correct data
2. **Data Validation**: Built-in validation before sending to ERP
3. **Progress Tracking**: Real-time dashboards showing conversion status
4. **Error Management**: Capture and resolve import errors
5. **Audit Trail**: Complete history of all conversion activities

## Architecture Overview

The conversion architecture consists of four layers:

### 1. Source Data Layer
- Staging tables for source data
- Data loading via APEX or SQL*Loader
- Source system extracts

### 2. Transformation Layer
- PL/SQL packages for data transformation
- Lookup mappings (old values to new values)
- Data validation rules

### 3. Integration Layer
- REST API calls to ERP Cloud
- FBDI file generation
- UCM file uploads

### 4. Monitoring Layer
- Conversion dashboards
- Error reports
- Reconciliation reports

## Initial Setup

### Create Staging Tables

Create staging tables to hold source data:

```sql
CREATE TABLE stg_suppliers (
  stg_id          NUMBER GENERATED ALWAYS AS IDENTITY,
  supplier_name   VARCHAR2(240),
  supplier_type   VARCHAR2(30),
  tax_id          VARCHAR2(50),
  status          VARCHAR2(20) DEFAULT 'NEW',
  error_message   VARCHAR2(4000),
  created_date    TIMESTAMP DEFAULT SYSTIMESTAMP
);
```

### Configure Web Credentials

Store ERP Cloud credentials securely:

1. Navigate to Shared Components > Web Credentials
2. Create a new credential
3. Set Authentication Type to "Basic Authentication"
4. Enter ERP Cloud username and password

### Create REST Data Sources

Define REST data sources for ERP Cloud APIs:

1. Navigate to Shared Components > REST Data Sources
2. Create a new data source
3. Configure the ERP Cloud endpoint URL
4. Associate with your Web Credential

## Next Steps

In Part 2, we'll dive into the data transformation process, including validation rules, lookup mappings, and FBDI file generation.

## Author

Jon Dixon, Co-Founder JMJ Cloud
