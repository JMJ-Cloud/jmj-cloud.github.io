---
title: "APEX Data Parser (Data Load Made Easy)"
date: 2019-08-15
author: "Jon Dixon"
tags: ["APEX", "Data Parser", "CSV", "JSON", "Excel", "XML", "Oracle"]
summary: "The APEX_DATA_PARSER PL/SQL package was introduced in APEX 19.1. It comes from a long line of useful APIs produced by the APEX development team. APEX_DATA_PARSER solves a number of challenges with loading file based data that I have faced throughout my Oracle career."
---

The APEX_DATA_PARSER PL/SQL package was introduced in APEX 19.1. It comes from a long line of useful APIs produced by the APEX development team. APEX_DATA_PARSER solves a number of challenges with loading file based data that I have faced throughout my Oracle career of 25 years. In this post I will explain what problems it solves and how you can use it to make importing data from files much easier.

![APEX Data Parser](/images/blog/apex-data-parser/main-logo-min.png)

## Overview

Almost all projects whether they are custom APEX applications or full-blown ERP implementations require that you import data into a database table from a file. As Oracle developers our peak productivity zone begins when we can handle data using SQL. The quicker we can start handling data using SQL, the quicker development can be completed.

APEX_DATA_PARSER provides APIs to help us to:

- Analyze a file to understand its format and structure.
- Identify the field names and datatypes of fields contained in the file.
- Use a SELECT statement to pull data from a file without having to develop complex parsing logic.

APEX_DATA_PARSER supports the following file formats:

- CSV
- JSON
- Excel (XLSX)
- XML

## Our Options Before APEX_DATA_PARSER

Previously, we have had to employ one of the following methods to get external file data into a database table to start handling the data using SQL:

- Use SQL*Loader to load data into a staging table and then kick off a PL/SQL process to perform transformations.
- Use UTL_FILE within PL/SQL to read data from files on the file system.
- Use 'External Table' functionality within PL/SQL to read data from files as if they were a table.
- Build a custom program using a language like Java to read data from the file, parse it and insert it into a table using JDBC.

All of these methods come with challenges, which include:

- None of them support parsing and loading JSON, Excel or XML files.
- None of these methods easily handle the structure of your file changing.
- All of these methods require that you copy the file to a specific server that the database is able to access.
- SQL*Loader and External Tables require that you manually build a definition file to define the structure of the file you are loading.
- UTL_FILE and External Tables require that you configure database directories to define the location of the external file on the file system.
- UTL_FILE requires that you manually build the parsing logic to split records into fields etc.

## APEX_DATA_PARSER

APEX_DATA_PARSER handles all of the challenges described above (and more). It contains a series of APIs that allow you to discover the structure of a file and then parse the data in the file directly from a SQL statement.

### The File

In order for APEX_DATA_PARSER to act on your file, you first have to get it into a BLOB. You might now be thinking if I have to get the file into a BLOB then this really isn't solving the problem of having to move the file to a location where the database is aware of it. Enter APEX_WEB_SERVICE. You could use APEX_WEB_SERVICE to first get the file BLOB from somewhere like AWS S3 and then consume the response using APEX_DATA_PARSER.

**Code Sample 1 - PARSE with APEX_WEB_SERVICE:**

```sql
SELECT line_number,col001,col002,col003,col004,col005
FROM TABLE(APEX_DATA_PARSER.PARSE
 (p_content => APEX_WEB_SERVICE.MAKE_REST_REQUEST_B
 (p_url => 'http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv',
 p_http_method => 'GET'),
 p_file_name => 'test.csv'));
```

### Discovery

One of the most interesting features is the ability to analyze a file and generate a JSON document containing everything you need to know about the file.

**Code Sample 2 - DISCOVER:**

```sql
SELECT APEX_DATA_PARSER.DISCOVER (
 p_content => APEX_WEB_SERVICE.MAKE_REST_REQUEST_B
 (p_url => 'http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv',
 p_http_method => 'GET'),
 p_file_name=>'test.csv' ) as profile_json
FROM dual;
```

APEX_DATA_PARSER.DISCOVER returns a JSON document with details of the file encoding, delimiters, and the names and data types for each of the fields in the file. This information is extremely useful. For example, you can use it to write code to handle changes to the numbers of columns in files that are uploaded. Today your user uploads a file with 10 columns and tomorrow they add a column. Being able to inspect the format of the file allows you to dynamically handle that 11th column. This is something you could never do with other Oracle loader tools.

To make things even easier, there is a companion API to APEX_DATA_PARSER.DISCOVER called APEX_DATA_PARSER.GET_COLUMNS.

**Code Sample 3 - GET_COLUMNS:**

```sql
SELECT *
FROM TABLE(APEX_DATA_PARSER.GET_COLUMNS(
 APEX_DATA_PARSER.DISCOVER(
 p_content => APEX_WEB_SERVICE.MAKE_REST_REQUEST_B
 (p_url => 'http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv',
 p_http_method => 'GET'),
 p_file_name => 'test.csv' )));
```

![GET_COLUMNS Result](/images/blog/apex-data-parser/get-columns-result-min_orig.png)

APEX_DATA_PARSER.GET_COLUMNS produces a PL/SQL array of the columns from the JSON profile.

### Parsing

Now that we know what our file looks like we would like to parse and process the data within the file using SQL. This can be done using APEX_DATA_PARSER.PARSE.

**Code Sample 4 - Full PARSE Example:**

```sql
SELECT line_number,col001,col002,col003,col004,col005,col006,col007,col008
FROM TABLE(APEX_DATA_PARSER.PARSE(
 p_content => APEX_WEB_SERVICE.MAKE_REST_REQUEST_B(
 p_url => 'http://insight.dev.schoolwires.com/HelpAssets/C2Assets/C2Files/C2ImportCalEventSample.csv',
 p_http_method => 'GET'),
 p_file_name => 'test.csv'));
```

![PARSE Result](/images/blog/apex-data-parser/parse-result_orig.png)

APEX_DATA_PARSER.PARSE returns a PL/SQL array with 301 columns, the line_number from the file and up to 300 columns of data from the file.

Although the column names are generic (col001, col002 etc.) we know exactly what is in each column because we have the profile generated earlier.

At every turn, APEX_DATA_PARSER is making it easier for you to deal with information about the file and the file itself using SQL.

## Considerations

There are a few considerations that are worth noting.

### Many More Parameters

There are many more parameters to the APIs described above. The documentation is encouraged for learning about these additional parameters.

### It Supports a Flat File Structure

- Although it supports JSON and XML file types, APEX_DATA_PARSER can only handle data in a flat structure.
- You cannot therefore parse out data from nested objects in JSON or XML.
- During discovery of JSON files, APEX_DATA_PARSER will try and determine the main array and parse the top level of that array only.

### Basic DATE Type Identification

- It seems to rely on clues in the formatting of date fields to identify the format string.
- For example:
  - DD/MM/YYYY is not identified as a DATE while DD.MM.YYYY is.
  - MM/DD/YYYY is identified as a DATE.
- It seems if it tested a number of different date format strings against records in the file, it could improve its success rate in identifying DATE fields.

### Performance

APEX_DATA_PARSER relies on underlying code to handle the actual data parsing. For example, if you are on 11g of the database it uses APEX_JSON to parse JSON. If you are on 18c of the database it will use the native JSON parser. The native JSON parser in 18c is orders of magnitude faster than APEX_JSON. In view of this the parsing speed can vary dramatically depending on the version of the DB you are on.

This is actually very clever. By encapsulating file parsing logic within APEX_DATA_PARSER you will automatically gain performance improvements when you upgrade from 11g to 18c.

## Use Case

We have already used APEX_DATA_PARSER for loading payroll data from external payroll providers into Oracle EBS. These payroll files have a varying number of columns depending on the different pay elements in the payroll file (e.g. gross pay, sick pay, holiday, vacation, etc.). Being able to analyze the profile produced by APEX_DATA_PARSER at run time allowed us to pick up columns added to the file dynamically. As long as these columns matched Oracle payment elements, we could then load them right into Oracle.

Prior to APEX_DATA_PARSER this would have been nearly impossible. At the very least APEX_DATA_PARSER cut the development time in half.

## Conclusion

For on-premise and cloud-based ERP projects, a significant portion of the technical budget is spent converting data (e.g. items, customers, suppliers, orders, invoices etc.) from a legacy system to a new Oracle ERP. APEX_DATA_PARSER can significantly reduce the cost and complexity of these conversions by removing the complexity of getting you to the stage where you can work with the file data in SQL.

There are many more examples where APEX_DATA_PARSER can save you time and allow you to provide real business benefit. For example, you can save users from manual data entry by allowing them to upload data from an Excel spreadsheet. APEX_DATA_PARSER even handles fetching data from a specific tab of a spreadsheet.

Here is the link to the [APEX 19.1 documentation for APEX_DATA_PARSER](https://docs.oracle.com/en/database/oracle/application-express/19.1/aeapi/APEX_DATA_PARSER.html).

---

Jon Dixon, Co-Founder JMJ Cloud
