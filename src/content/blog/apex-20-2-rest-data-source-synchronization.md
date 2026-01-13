---
title: "APEX 20.2 - First Look at REST Data Source Synchronization"
date: 2020-10-11
author: "Matt Paine"
tags: ["APEX", "REST", "Data Synchronization", "Oracle", "APEX 20.2", "ERP Cloud"]
summary: "The Pre-Production Release of APEX 20.2 is now available on apex.oracle.com! In this article, we'll have a look at the new REST Data Source Synchronization feature which will be super handy when using APEX to extend ERP Cloud."
---

The Pre-Production Release of APEX 20.2 is now available on apex.oracle.com! There are lots of new and useful features that we can't wait to start using. In this article, we'll have a look at the new REST Data Source Synchronization feature will be super handy when using APEX to extend ERP Cloud. We gave this a runout on apex.oracle.com, using it to pull down ERP Cloud Organizations into an APEX table on a set schedule.

## Step 1 - Configure the REST Data Source

We configured the REST Data Source as below, using APEX Web Credentials to connect to the Vision Demo ZRNS environment, configuring the organizations HCM rest service to return the following fields for all active departments: OrganizationId, Name and Active.

![REST Data Source Configuration](/images/blog/rest-data-sync/1-rest-data-source-configuration_orig.png)

Query String variables are used to configure the selection criteria and data returned.

![REST Source GET Operation](/images/blog/rest-data-sync/2-rest-source-get-operation_orig.png)

Before attempting synchronization, we test the web service call to make sure it is functioning correctly.

![REST Data Source GET Response](/images/blog/rest-data-sync/3-rest-data-source-get-response_orig.png)

We can check this for accuracy against the source data in ERP Cloud.

![Fusion Data for Verification](/images/blog/rest-data-sync/12-fusion-data_orig.png)

Note, Vision is shown below with the Redwood theme; we're looking forward to trying out the new APEX 20.2 Redwood Light Theme for our ERP Cloud Integrations.

An important step is to identify the Primary Key of the returned data; this is used if you're Merging the data every time it is synchronized.

![REST Data Source Data Profile Primary Key](/images/blog/rest-data-sync/4b-rest-data-source-data-profile-pk_orig.png)

## Step 2 - Configure Synchronization

We clicked on the new Manage Synchronization link to start the configuration process.

![Manage Synchronization Link](/images/blog/rest-data-sync/5-manage-synchronization_orig.png)

Here we choose a target table.

![Choose Target Table](/images/blog/rest-data-sync/6-choose-target-table_orig.png)

If none exists, APEX will create a new table for you with columns matching your REST Data Source.

![Create Table Option](/images/blog/rest-data-sync/7-create-table_orig.png)

Note, If your REST Data Source changes at a later time, for example if columns are added or renamed, APEX can generate and apply the DDL required to bring the table in line.

In the next step, we have to choose the Synchronization Type:

- **Append** - rows are added to the end of the table.
- **Merge** - rows are merged using the primary key defined earlier.
- **Replace** - the table is truncated (or deleted) before rows are inserted.

The Synchronization Schedule is expressed using same syntax as DBMS_SCHEDULER, so tables can be synchronized every 15 mins, 2 hours, day etc.

![Choose Schedule](/images/blog/rest-data-sync/8-choose-schedule_orig.png)

All done - now we can save the Schedule and we're told when this will run.

![Save and Run](/images/blog/rest-data-sync/9-all-done-time-to-run_orig.png)

We can also run it On Demand using the Save and Run button.

Looking at the new APEX_REST_SOURCE_SYNC package, we should also be able to start synchronization programmatically using a PL/SQL procedure call.

![Synchronization APIs](/images/blog/rest-data-sync/15-synchronization-apis_orig.png)

## Step 3 - Synchronization Results

Once Synchronization has run, the log entries give us rowcounts, message sizes, and execution times.

![Review Logs Link](/images/blog/rest-data-sync/9a-review-logs_orig.png)

![Review Log Details](/images/blog/rest-data-sync/10-review-log-v2_orig.png)

Data is now available in our custom table. We used the APEX 20.2 Declarative Cards layout to show the data.

![Card Report Display](/images/blog/rest-data-sync/11-card-report_orig.png)

And just for fun, this is what it looks like with the Redwood theme:

![Redwood Theme Display](/images/blog/rest-data-sync/snip20201011-126_orig.png)

We can also use the new APEX 20.2 Excel downloads to get our newly synchronized data:

![Download to Excel](/images/blog/rest-data-sync/17-download-ir-to-excel-clean.png)

Behind the scenes, the JMJ_ERP_CLOUD_DEPARTMENTS table contains the columns we requested, along with a couple that APEX uses to keep track of synchronization.

![Base Table Fields](/images/blog/rest-data-sync/16-base-table-fields_orig.png)

## Conclusion

This was our first look at this new feature in APEX 20.2 and in about 15 minutes we were able to create a new workspace, ERP Cloud data source, and synchronize data into a custom table.

We didn't have to write a single line of code to call web services, map returned data into tables, or record web service calls and responses.

This is fantastic functionality, and we look forward it using it in our work using APEX to extend and integrate with ERP Cloud. We hope ERP Cloud follows the industry and continues to migrate old SOAP services to REST. This will make integrations like this much simpler and help customers gain the maximum benefit from their ERP Cloud Investment.

This is yet another example of expectations being exceeded by the APEX Development Team! Thanks to all those who worked hard behind the scenes to make this happen.

---

Matt Paine, Co-Founder JMJ Cloud
