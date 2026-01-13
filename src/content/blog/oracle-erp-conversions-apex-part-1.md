---
title: "Oracle ERP Conversions Made Easy with APEX (Part 1)"
date: 2020-05-07
author: "Jon Dixon"
tags: ["APEX", "Oracle ERP", "E-Business Suite", "Data Conversion", "APEX_DATA_PARSER"]
summary: "This is the first in a two-part post on how to use APEX to facilitate data conversions (and data uploads) into Oracle e-Business Suite (EBS) and Oracle ERP Cloud. In this first post, we will focus on Oracle e-Business Suite (EBS)."
---

![ERP Conversions Icon](/images/blog/erp-conversions-part1/main-blog-image.png)

This is the first in a two-part post on how to use APEX to facilitate data conversions (and data uploads) into Oracle e-Business Suite (EBS) and Oracle ERP Cloud.

ERP systems are data hungry beasts that require constant feeding. The task of converting and loading data using existing tools are both time consuming and error prone.

In these posts we will cover the benefits of using APEX for data upload and describe several examples where APEX has been used to make the task of bulk loading data into EBS and ERP Cloud more user friendly and more accurate than traditional methods.

In this first post, we will focus on Oracle e-Business Suite (EBS).

## Background

You may think that conversions are only required during the initial implementation of an ERP. Organizations carrying out acquisitions, however, can mean data conversions are being conducted several times a year. There are also many scenarios where companies need to regularly upload data from other systems into their ERP. The standard tools for uploading data into EBS are not user-friendly and require a significant investment in time from IT (or consultants). If the upload and validation of data could be put directly in the hands of end users, it would reduce costs and increase data accuracy.

## Legacy Tools

In the olden days, the business and IT had to perform the following complicated dance in order to load data into EBS:

1. IT receives a copy of the data file from the end user.
2. IT copies the file to the application file server.
3. IT runs a SQL*Loader script to load the table to a custom staging table.
4. IT runs a concurrent program to validate the staged data and sends a report to the end user to review.
5. The end user corrects errors in the data and sends a new file to IT to repeat steps 1-4.
6. Once all data has been validated, IT will run another concurrent program to move the data to the Open Interface table and launch the Open Interface concurrent program.
7. IT sends the report output from the Open Interface to the end user.
8. End user reviews results and potentially sends a revised file with fixes to any failed records.

## Requirements for a Better Solution

Any solution we provide using APEX must meet the following criteria:

- Must be user friendly so that occasional business users can easily preform uploads.
- Must clearly show end users what data is valid and what is invalid.
- Must utilize standard EBS mechanisms to perform the final data load (e.g. EBS Open Interface Tables, EBS Public APIs etc.).
- Must prevent duplicate and or bad data from being loaded into the system.

## A Better Solution Using APEX

There are two supported approaches to loading data into EBS. Using the 'Open Interface Tables' or using 'Public EBS PL/SQL APIs'. Using these methods ensures that you do not violate your support agreement and ensures EBS has performed final validations on your data before loading it into its base tables.

![APEX ERP Conversions Process Flow](/images/blog/erp-conversions-part1/erp-conversions-with-apex_orig.png)

As you can see from the design pattern above, using APEX, we have reduced the number of steps from 8 to 4 and put the entire process in the hands of the end user.

### 1. Data Parsing and Initial Validation

The File item type in APEX allows users to drag and drop (or select a file) from their file system onto an APEX page. You can then process that file as a BLOB within PL/SQL. Once you have the BLOB you can hand over the heavy lifting of parsing the file to APEX_DATA_PARSER. APEX_DATA_PARSER (available since APEX 19.1) does the heavy lifting of parsing the BLOB and giving you the results so you can consume them in a SELECT statement.

Example SQL Parsing a BLOB:

```sql
SELECT line_number
 , col001 org_code
 , col002 item_number
 , col003 list_price
 , col004 blanket_number
 , col005 bpa_price
 FROM TABLE(APEX_DATA_PARSER.PARSE(
 p_content => p_file_blob,
 p_skip_rows => gc_skip_rows,
 p_file_name => p_file_name,
 p_detect_data_types => 'N'))
 WHERE col001 IS NOT NULL;
```

Now that the data is parsed you can loop through it performing your own pre-validations. It is a good idea to perform pre-validations on user-provided data so that you can intercept 95% of errors before records make it to the EBS Open Interface tables. It is much harder to clear records and re-try failed records once they are in the Open Interface tables. As the records are validated, we add them to an APEX Collection. Collections are possibly the most useful tool in your APEX toolbox. They provide a temporary storage area for data that is contained within your specific APEX session.

### 2. Review Validation Results

Now that we have the valid and invalid records in a collection, we can present these to the user in an Interactive Report (or Grid). The user can review invalid records, correct data in their source file, re-upload and re-iterate until all records pass validation. The ability for the end user to iterate is a key differentiator when using this method over traditional approaches.

### 3. Initiate EBS Open Interface

Once the user is happy with the results of validation, they click a button to insert the valid records into the appropriate Open Interface tables and then the Open Interface Concurrent program is launched using a PL/SQL API.

### 4. Review Final Results

Once the concurrent program is complete, the user can review any failed records in the interface table and see errors from the open interface table's associated error table. For example, the item interface table mtl_system_items_interface populates errors in the table mtl_interface_errors. This is achieved without the user having to leave APEX by providing a 2nd APEX page to review the content of these tables.

## Considerations

Here are some considerations when using APEX to load data:

**APEX Collections:** APEX Collections offer a great deal of flexibility. Because collections are widely used by APEX developers you need to ensure you don't adversely impact performance of other code that uses collections. You can do this by making sure you delete the collection once you are done with it. This is especially important when loading large volumes of data.

**Unique Batch Identifier:** Once you move validated records into the EBS Open Interface table, you need a way to uniquely identify your specific batch of records. Most EBS interfaces have a batch identifier column that you can use for this. For example, the item interface table mtl_system_items_interface has a column batch_id that you can use for this purpose.

**Viewing Results of the EBS Open Interface in APEX:** Once the Open Interface has run you should provide another APEX page to allow users to see records in the interface table and its respective error table, e.g., the item interface table mtl_system_items_interface and its error table mtl_interface_errors. The unique batch identifier described previously helps you query records for a specific interface run.

**Using EBS Public APIs:** Many EBS entities provide a public PL/SQL API as well as an Open Interface. Using a public API gives you immediate feedback (success or error) on whether a record was successfully created in EBS. This does have obvious benefits, but you should use caution when loading large numbers of records. When calling the public API for each record, your user will have to wait until all records are created before they get control back. There is also a risk that the web server will timeout. However, if you submit a concurrent program to load via the Open Interface, you user can go about their work while the load occurs in the background. I typically try to use public APIs for loads of up to 10 thousand records and the Open Interface for larger loads.

**Reduced Custom Objects:** Using APEX, APEX_DATA_PARSER and APEX Collections reduces the number of custom objects you need to deploy to EBS to support your solution. APEX_DATA_PARSER removes the need for SQL*Loader scripts to load data files into a staging table. APEX Collections allow us to store data temporarily while it is being validated, thus, removing the need to create or maintain a set of staging tables.

**More Parsing Options:** APEX_DATA_PARSER allows you to natively parse xlsx, csv, json and xml files whereas SQL*Loader only handles delimited and fixed format files.

**High Volume Uploads:** If you are uploading hundreds of thousands (or even millions of records), then SQL*Loader is probably still the way to go. SQL*Loader offers features such as direct path upload that make writing data to staging tables orders of magnitude faster than standard INSERT statements.

## Example Conversions & Uploads

Here are just a few examples of EBS conversions and data loads we have developed for our customers using the above approach. Hopefully they will give you some ideas.

**Inventory Item Uploads**
Load new inventory items into EBS from an Excel Spreadsheet.

**Inventory Item Category Assignments**
Load item category assignments from an Excel Spreadsheet.

**Inventory Item OnHand and Cost Upload**
When you need to upload items you typically also need to load starting inventory on-hand balances as well as average or standard costs.

**Mass Blanket Agreement Price Updates**
If your organization has hundreds or even thousands of blanket purchase order agreements, applying price updates across these blankets can be a challenge. In this interface we allowed end users to build an Excel file of items with their new prices and apply them to blanket purchase orders using the Purchasing Open Interface.

**Import WIP Labor Hours**
If you use EBS for managing Work in Process (WIP) jobs, you need to capture labor costs to accurately cost these jobs. In this interface users uploaded csv extracts from their time and attendance system into an APEX page which then uploaded the data into EBS using the WIP Cost Transactions Interface.

**Import External Payroll Data**
In this instance the customer used Oracle Payroll but needed to interface additional payroll data from several 3rd party payroll systems. End users export payroll reports from the external payroll systems and then drag and drop these files into an APEX page so they could then be uploaded into Oracle Payroll. This gave the customer the ability to view payroll data across the entire organization.

## Conclusion

You may still be using EBS, but by utilizing APEX, you can introduce significant process efficiencies and UI modernization initiatives to delight your users.

Utilizing APEX along with EBS allows you to introduce process efficiencies and modernize the UI experience to the delight of your users.

---

Jon Dixon, Co-Founder JMJ Cloud
