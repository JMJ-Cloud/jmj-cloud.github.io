---
title: "Automated Tax Certificate Data Extraction with Azure AI"
status: "Active"
year: 2024
summary: "Built an intelligent document processing solution using Azure Content Understanding API and Oracle EBS integration to automatically extract tax exemption data from thousands of PDFs, eliminating manual data entry and reducing processing time from hours to seconds."
technologies:
  - "Azure Content Understanding API"
  - "Oracle E-Business Suite R12.2"
  - "PL/SQL"
  - "Oracle APEX"
  - "REST APIs"
  - "JSON Processing"
industry: "Manufacturing"
metrics:
  - "5,700+ tax certificates processed automatically"
  - "95-99% extraction confidence scores"
  - "15-second average processing time per document"
  - "Eliminated hundreds of hours of manual data entry"
featured: true
order: 1
---

## Project Overview

A manufacturing company faced a significant operational challenge: thousands of tax exemption certificates stored as PDF files needed their data manually extracted and entered into Oracle E-Business Suite for compliance and financial processing. This labor-intensive process was error-prone, time-consuming, and created a backlog that delayed order processing.

I designed and implemented an automated solution that leverages Azure's Content Understanding API to intelligently extract structured data from tax certificate PDFs and seamlessly integrates with the client's Oracle EBS environment. The solution processes documents in batch, validates extracted data, and stores results in Oracle database tables for immediate use by downstream financial systems.

The system is now processing the company's existing backlog of 5,700+ certificates while also handling new uploads, delivering consistent 95-99% accuracy and reducing per-document processing from manual hours to automated seconds.

## Business Challenge

The business urgently needed to eliminate manual processing of tax exemption certificates that was creating several critical problems:

- **Manual Data Entry Backlog**: Finance team had to manually open each PDF certificate and transcribe purchaser information, certificate numbers, and expiration dates into Oracle EBS
- **Processing Delays**: Manual extraction was creating bottlenecks in order fulfillment, as tax exemption validation had to be completed before processing orders
- **Error Risk**: Manual transcription introduced data quality issues that could result in compliance problems or incorrect tax treatment
- **Scalability**: As the business grew, the volume of certificates increased but staffing couldn't scale proportionally
- **No Audit Trail**: Lack of automated tracking made it difficult to know which certificates had been processed or identify data quality issues
- **Expiration Management**: No automated way to flag expiring certificates, risking use of invalid exemptions

The business needed an automated solution that could process their existing backlog of thousands of PDFs while handling new certificates as they arrived, all while maintaining data quality and integration with existing Oracle EBS workflows.

## Solution Architecture

**Core Technologies:**

The solution leverages Azure Content Understanding API's pre-trained tax certificate analyzer, which uses advanced AI models specifically designed to understand tax document layouts and extract relevant fields. I chose this over building a custom machine learning model because it delivered production-ready accuracy immediately without requiring training data or model maintenance.

Oracle E-Business Suite R12.2 with Edition-Based Redefinition (EBR) provides the enterprise data foundation, ensuring extracted data integrates seamlessly with existing financial processes. PL/SQL packages handle the orchestration, API integration, and data validation, while Oracle APEX provides the web service client capabilities needed to communicate with Azure's REST endpoints.

### Document Processing Pipeline

The system follows an asynchronous processing pattern:

- **PDF Submission**: PL/SQL package accepts BLOB data from Oracle tables and submits to Azure via HTTPS POST
- **Async Polling**: System polls Azure API endpoint (max 30 attempts, 2-second intervals) until document analysis completes
- **Result Processing**: JSON response parsed to extract purchaser details, certificate numbers, issue/expiration dates, and confidence scores
- **Data Storage**: Structured data inserted into Oracle tables with full audit trail and linkage to source documents

### Batch Processing & Queue Management

- Intelligent skip logic prevents reprocessing of already-analyzed certificates
- Batch processor handles up to 5 documents per execution, suitable for scheduled job automation
- Built-in error handling captures API failures for review without halting entire batch
- Unprocessed document counter helps operations team monitor backlog reduction

### Data Quality & Validation

- Confidence scores stored alongside extracted data to flag low-quality extractions for review
- Complete JSON response preserved in CLOB columns for future reprocessing if needed
- Indexed foreign keys link extractions back to source upload records
- Extraction metadata tracks processing time, API result IDs, and creation timestamps

## Technical Highlights

**API Integration Architecture:**
- Used Oracle APEX_WEB_SERVICE package for REST API calls instead of UTL_HTTP to leverage existing Oracle APEX SSL certificate infrastructure
- Implemented proper Azure cognitive services endpoint discovery (corrected from generic services.ai.azure.com to cognitiveservices.azure.com domain)
- Built header debugging capabilities to troubleshoot API authentication and content-type issues
- Handled Azure's async operation pattern with Operation-Location header parsing and result polling

**PL/SQL Package Design:**
- Separated concerns across multiple procedures: PDF submission, result polling, JSON parsing, and error handling
- Implemented package constants for API configuration (base URL, version, subscription key, polling parameters)
- Built reusable CALCULATE_CONFIDENCE function that extracts and averages word-level confidence scores from Azure response
- Designed for testability with standalone test scripts that exercise full end-to-end workflow

**Oracle EBS Integration:**
- Followed Oracle EBS 12.2 Edition-Based Redefinition standards with three-tier schema architecture
- Created edition views with proper AD_ZD_UPGRADE procedures for online patching compatibility
- Implemented standard EBS audit columns (CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY) with trigger automation
- Built indexed foreign key relationship to upload table (TC_UPLOAD_ID) for join query performance

**Data Model Design:**
- Identity column (GENERATED BY DEFAULT ON NULL AS IDENTITY) for primary key ensures unique extraction IDs
- Separate columns for all key tax certificate fields (purchaser info, certificate details, dates) enable SQL queries without JSON parsing
- Dual storage strategy: structured columns for queries plus complete RAW_JSON_RESPONSE CLOB for flexibility
- Comprehensive indexing strategy on TAX_CERTIFICATE_ID, PURCHASER_LEGAL_NAME, CERT_EXPIRATION_DATE, API_STATUS, and TC_UPLOAD_ID

**JSON Processing:**
- Used Oracle's JSON_VALUE function with literal path expressions to extract nested fields from Azure response
- Calculated average document confidence from words array using JSON_TABLE for array iteration
- Handled date conversions from ISO 8601 format strings to Oracle DATE columns
- Preserved markdown content extraction alongside structured field data

## Results & Impact

**Processing Efficiency:**
- Reduced per-certificate processing from 5-10 minutes of manual work to 15 seconds of automated processing
- Eliminated estimated 500+ hours of manual data entry work from existing backlog
- Enabled continuous processing of new certificates as they arrive without staffing increases

**Data Quality:**
- Achieved 95-99% extraction confidence scores across diverse certificate formats
- Automated validation flags low-confidence extractions for review before use
- Complete audit trail tracks when each certificate was processed and by which API call

**Business Value:**
- Removed order processing bottleneck caused by tax certificate validation delays
- Reduced compliance risk through consistent, accurate data extraction
- Freed finance team to focus on exception handling rather than routine data entry
- Enabled proactive expiration monitoring through queryable database fields

**Technical Success:**
- Successfully deployed to production Oracle EBS environment with zero downtime using edition views
- Integration tested with 12 diverse certificate formats from multiple states
- Batch processing successfully handles files ranging from 200KB to 1.2MB
- System scales to handle 5,700+ document backlog without performance degradation

## Deliverables

- **Oracle Database Objects**: Table definitions, edition views, indexes, triggers, and grants following EBS standards
- **PL/SQL Package**: Complete specification and body with API integration, JSON parsing, and error handling
- **Test Scripts**: Comprehensive test harness for unit testing API calls, batch processing, and data validation
- **Deployment Guide**: Step-by-step deployment documentation for DBA team including prerequisites, verification queries, and troubleshooting
- **SQL Query Library**: Pre-built queries for operations team to monitor processing status, view extracted data, and identify errors
- **Network Configuration**: ACL setup scripts for Oracle database to Azure API connectivity
- **Technical Documentation**: Architecture diagrams, data model documentation, and API integration specifications

## Why This Matters

This project demonstrates several key capabilities that are valuable across enterprise integration challenges:

**Enterprise AI Integration** - Successfully integrated cutting-edge Azure AI services with legacy Oracle E-Business Suite infrastructure, proving that established ERP systems can leverage modern cloud AI without costly platform migrations.

**Document Intelligence** - Delivered production-ready intelligent document processing that handles real-world variability in tax certificate formats, demonstrating expertise in AI-powered automation for structured data extraction.

**Oracle EBS Expertise** - Followed Oracle's Edition-Based Redefinition standards, proper schema architecture, and patching compatibility requirements, showing deep understanding of enterprise Oracle development best practices.

**API Architecture** - Designed robust async API integration with proper error handling, retry logic, and debugging capabilities, applicable to any REST API integration project.

**Data Modeling** - Created flexible dual-storage strategy (structured columns plus JSON) that balances query performance with future adaptability, a pattern useful for many integration scenarios.

**Process Automation** - Built batch processing logic with intelligent skip/resume capability and progress tracking, demonstrating ability to automate repetitive business processes at scale.
