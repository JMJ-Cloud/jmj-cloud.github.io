---
title: "Eating Your Own Dog Food is Easy with APEX"
date: 2020-04-23
author: "Jon Dixon"
tags: ["APEX", "Oracle", "Business Applications", "Case Study", "Integration"]
summary: "Since the weekend we started our business (when we built our time sheet application in APEX) through to our most recent push to replace Jira Service Desk with an APEX App, we have been using APEX to solve our own business problems as well as our customer's."
---

![Quality Dog Food](/images/blog/eating-dog-food/quality-dog-food.png)

I worked for Oracle Consulting for nearly 18 years. During that time Oracle steadfastly stuck to their mantra of using their own products wherever possible (eating their own dog food). Trust me Oracle's home-grown email client in 1998 was not pretty. This approach did give Oracle the chance to showcase and improve their products (especially the customer facing ones).

This approach stuck with me when my partners and I started JMJ Cloud. Since the weekend we started our business (when we built our time sheet application in APEX) through to our most recent push to replace Jira Service Desk with an APEX App, we have been using APEX to solve our own business problems as well as our customer's. In this post I will review the building blocks of the integrated APEX portal we built to help us run our business and interact with our customers.

## The Platform

There was never any doubt that we would choose APEX to build our platform. In addition, we did not want to be managing servers ourselves so the first thing we did was find a Cloud Provider to host us. We started with the old Schema as a Service then moved to Exadata Express and most recently Amazon RDS. Building and running our platform on these solutions has allowed us to provide real world expertise to our customers running APEX in the cloud. At less than $100 / month for our current AWS setup, our costs are very reasonable too. See our post on why we moved to AWS. We are still looking forward to moving back to an Oracle platform (when the price is right).

## Authentication (Social Sign On)

We did not want to be in the business of managing passwords, so we utilized a custom authentication scheme using APEX Social Sign on. This allows our customers and consultants to login to the platform using their own Microsoft (Office or Personal) credentials. Not only is this safer for us (we don't have to store or manage passwords) it is also much more convenient for our users.

**Tip**: If all you do is create an authentication scheme for Microsoft Social Sign On, then you have just given everyone with a Microsoft account access to your applications. You must follow it up with a default Authorization scheme that verifies the authenticated user has access to your portal.

## Authorization (Who has Access to What)

Authorization Schemes in APEX offer a flexible way to validate user access. An authorization scheme allows you to test a condition and return a TRUE or FALSE. The condition could be a simple comparison of application items all the way to hundreds of lines of PL/SQL which results in a TRUE or FALSE. Once you have an authorization scheme, you can then associate it to just about any APEX object (Menu Option, List Item, Page, Region, Page Item, Button, Report Column etc. etc.). You can even test authorization schemes in your PL/SQL code using APEX_AUTHORIZATION.IS_AUTHORIZED.

Of course, your authorization scheme must be based on some data. We decided on a simple role-based model with the following entities:

- Users
- Applications
- Application Roles (User, Admin, Project Manager etc.)
- User > Application > Roles

For most applications, a role-based model will work just fine. The main drawback of this approach, however, is that it does not allow you to be very granular. Sometimes you need to explode this model and include privileges that give users access to specific actions.

**Tip**: Whenever possible set the 'Evaluation Point' of your Authorization Schemes to 'Once per session'. This ensures that APEX only checks the Authorization Scheme at the time of login as opposed to every time a page (or component) is rendered. This is especially important if your authorization scheme contains a lot of code (or even calls to web services). This may seem like a small thing but poor performance in APEX comes about incrementally. Two tenths of a second for two authorization scheme calls, a tenth of a second for a sentry function call and two tenths for a before page process and your user has just waited half a second and the page hasn't even rendered yet.

## Portal (Multiple Applications)

We have several applications available to our consultants and our customers. We needed a secure and easy way for users to switch between these applications. After reading Scott Wesley's blog, we decided on Application Session Sharing. This allows us to easily share sessions across all applications in a workspace. Session Sharing is configured in the Session Sharing section of your Authentication Scheme.

## External Integrations

The APEX team continues to make it easier to interact with other systems via REST services. We utilize several third-party services to provide additional functionality to our users.

- SMS Messages Via Twillio (time entry reminders, important notifications)
- File Object store via Amazon S3
- SMTP email via AWS Simple Email Service (SES)

**Tip**: When integrating with external web services you need to become familiar with installing SSL certificates in your database wallet. I suggest creating a single wallet (with auto login) that can be referenced in your APEX environment settings (via the INTERNAL Workspace) so that native APEX components (e.g. Social Sign on, APEX_WEB_SERVICE etc.) can utilize this wallet when making calls to external services. If you are using a completely managed service like Oracle Autonomous ATP then this has been done for you.

## Email

Email notifications are a critical component of many applications. We use Amazon Simple Email Service (SES) to host an SMTP server. This allows us to configure our APEX environment (via the INTERNAL Workspace) to send all emails via the APEX_MAIL PL/SQL API. Used in conjunction with APEX Email Templates you have all you need to send professional looking emails that won't end up in the recipients spam folder.

## The Applications

In this section I am going to touch on a few of the applications in our portal. The goal here is to give a flavor of what is possible with APEX.

### Time Entry Application

![Time Entry Application](/images/blog/eating-dog-food/apex-dog-food-picture1_orig.png)

Time entry is the lifeblood of a consulting company. Even a small consulting company will get mired in spreadsheets without a system for their consultants to enter their time. As I mentioned, we built our current time-entry APEX application the weekend before we officially started our business. Fifteen thousand time entries later and the application is still going strong. Not only does it make time entry more accurate it helps us to generate our monthly invoices in minutes instead of hours.

### e-Business Suite (EBS) Code Deployment Application

![EBS Code Deployment Application](/images/blog/eating-dog-food/apex-dog-food-picture2_orig.png)

I have been building EBS extensions for nearly 20 years. A constant challenge has been to consistently and accurately deploy code between EBS instances. In days gone by, we achieved this by hand crafting shell scripts to deploy the code and handing these off with the source code to a DBA as attachments to an email. This approach is fraught with errors and inconsistencies.

In view of this challenge, we built an APEX application where developers can upload their source scripts for a deployment and the application automatically generates a shell script to install them. The application is aware of all the types of objects you can deploy in an EBS environment and builds the shell script appropriately. These object types include standard database objects (APEX applications, tables, views, PL/SQL packages etc.) as well as EBS specific objects (Menus, Responsibilities, Lookups, Forms, Reports BI Publisher Templates etc.). Once the developer has submitted their deployment, it goes through an approval and eventually a notification is sent to the DBA. The DBA can then download a single zip file and run the deployment on the EBS server. Once a deployment is complete in a TEST environment, it can then be copied to create a PROD deployment (with no manual intervention). This approach improves consistency, accuracy and audit traceability which are all key in an any ERP environment.

### Service Request Tracking Application

When we started out, we used Jira Service Desk (for managing tickets with customers), Jira Software for managing projects and Jira Confluence for documentation. We loved these products but felt that Jira Service Desk was a little much (functionality wise and cost wise) for our needs. Three weeks ago, we introduced our replacement for Jira Service desk developed in APEX. The key to ticket management for us is to be able to have our customers create and update tickets as well as our consultants.

As we already had the portal framework in place (with Microsoft login, authorization management, email and object store capabilities) we were able to build the SR application in matter of weeks.

**Tip**: Our SR system allows users to add attachments. I believe file attachments do not belong in the database. They take up a lot of space on relatively expensive storage. We keep attachments out of the database using AWS S3. You can store a hundred GB worth of files in services like S3 or Oracle's object store for less than $5 per month.

## Customer Engagement

APEX has provided us the ability to build a suite of applications that automate many of the manual tasks involved in running our business and in performing our day to day development activities. Just as importantly, it provides us another way to engage with our customers and offer them unique products which add real value.

## Conclusion

I do not typically advocate building a solution where there is already an off the shelf solution. There are times, however, when being able to quickly build a suite of unique products with a low code development platform such as APEX can add real value to your business. APEX provides us the flexibility to build these solutions using a combination of low code and high code wrapped in a framework which is easy to maintain and upgrade.

---

Jon Dixon, Co-Founder JMJ Cloud
