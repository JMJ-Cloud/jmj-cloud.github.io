---
title: "Oracle ERP Conversions Made Easy with APEX Part 2"
date: 2020-05-13
author: "Jon Dixon"
tags: ["APEX", "Oracle ERP", "ERP Cloud", "Data Conversion", "REST", "FBDI"]
summary: "Part 2 of our series on Oracle ERP conversions with APEX, focusing on data transformation, validation, and the FBDI file generation process."
---

## Introduction

In [Part 1](/blog/oracle-erp-conversions-apex-part-1), we covered the architecture for using APEX to load data into Oracle ERP Cloud. This installment focuses on the critical data transformation and validation steps.

**Series Navigation:**
- [Part 1: Architecture and Setup](/blog/oracle-erp-conversions-apex-part-1)
- Part 2: Data Transformation (this post)
- [Part 3: Error Handling and Production](/blog/oracle-erp-conversions-apex-part-3)

## Data Transformation Process

### Stage 1: Source Data Loading

Load source data into staging tables. APEX makes this easy with the Data Loading wizard:

1. Create a staging table matching your source format
2. Use APEX Data Loading to upload files
3. Validate row counts and basic data types

### Stage 2: Data Validation

Before transformation, validate the source data:

```sql
-- Check for required fields
SELECT *
FROM staging_suppliers
WHERE supplier_name IS NULL
   OR supplier_type IS NULL;

-- Check for valid lookup values
SELECT s.*, 'Invalid Type' as error
FROM staging_suppliers s
WHERE s.supplier_type NOT IN (
  SELECT lookup_code
  FROM fnd_lookups
  WHERE lookup_type = 'SUPPLIER_TYPE'
);
```

### Stage 3: Transformation

Transform source data to match ERP Cloud requirements:

```sql
CREATE OR REPLACE VIEW v_suppliers_transformed AS
SELECT
  s.supplier_id,
  UPPER(TRIM(s.supplier_name)) as supplier_name,
  NVL(s.supplier_type, 'STANDARD') as supplier_type,
  TO_CHAR(SYSDATE, 'YYYY/MM/DD') as start_date_active,
  -- Map source values to ERP Cloud values
  CASE s.payment_terms
    WHEN '30NET' THEN '30 Days Net'
    WHEN '45NET' THEN '45 Days Net'
    ELSE 'Immediate'
  END as payment_terms
FROM staging_suppliers s
WHERE s.validation_status = 'VALID';
```

## Generating FBDI Files

Oracle ERP Cloud uses FBDI (File-Based Data Import) for bulk data loading. APEX can generate these files.

### FBDI File Structure

FBDI files are CSV files with specific column ordering matching the ERP Cloud import template.

### Generate CSV with APEX

```sql
FUNCTION generate_supplier_fbdi RETURN CLOB AS
  l_csv CLOB;
BEGIN
  l_csv := 'SUPPLIER_NAME,SUPPLIER_TYPE,START_DATE_ACTIVE,PAYMENT_TERMS' || CHR(10);

  FOR rec IN (SELECT * FROM v_suppliers_transformed) LOOP
    l_csv := l_csv ||
      '"' || rec.supplier_name || '",' ||
      '"' || rec.supplier_type || '",' ||
      '"' || rec.start_date_active || '",' ||
      '"' || rec.payment_terms || '"' || CHR(10);
  END LOOP;

  RETURN l_csv;
END;
```

## Uploading to ERP Cloud

Once the FBDI file is generated, upload it to ERP Cloud using the UCM (Universal Content Manager) REST API:

```sql
DECLARE
  l_response CLOB;
  l_fbdi_content CLOB;
BEGIN
  l_fbdi_content := generate_supplier_fbdi;

  l_response := apex_web_service.make_rest_request(
    p_url         => 'https://erp-cloud/fscmRestApi/resources/erpintegrations',
    p_http_method => 'POST',
    p_body        => create_import_request(l_fbdi_content),
    p_credential_static_id => 'ERP_CLOUD_CRED'
  );
END;
```

## Conclusion

Data transformation is the heart of any conversion project. APEX provides the tools you need to validate, transform, and generate FBDI files for Oracle ERP Cloud import. In Part 3, we'll cover error handling and production deployment.

## Author

Jon Dixon, Co-Founder JMJ Cloud
