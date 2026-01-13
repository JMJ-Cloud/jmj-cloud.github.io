---
title: "Oracle ERP Robotic Process Automation (RPA) with APEX"
date: 2020-09-10
author: "Jon Dixon"
tags: ["APEX", "Oracle ERP", "RPA", "Automation", "E-Business Suite", "Integration"]
summary: "By now, most people have heard about Robotic Process Automation (RPA) tools. In this post I will describe a real-world example where APEX automates and orchestrates a repetitive e-Business Suite process, and why APEX may be a better choice than traditional RPA tools."
---

![RPA with APEX](/images/blog/erp-rpa-apex/title-image.png)

By now, most people have heard about Robotic Process Automation (RPA) tools. While these tools come with the glow of the next new thing in technology, in my experience, ERP integration and automated scenarios are complex, and I am not yet convinced RPAs can handle them as well as the latest hype may lead one to think. I am convinced that APEX can and has handled many real-world automation and integration scenarios in the ERP world. In this post I will describe a real-world example where APEX automates and orchestrates a repetitive e-Business Suite process. ERP Cloud examples will be featured in future posts.

## Background

My whole career has been focused on building software to automate manual processes. Most of this automation work has been focused on Oracle's e-Business Suite (EBS) and ERP Cloud. ERP software has a huge amount of functionality, but it is necessarily geared toward the most common business processes. In view of this, common processes like creating items must be broken down into their component steps, e.g., Create Item > Assign Categories to the Item > Choose Catalog Values for the Item > Create Item Cross References. If you are creating hundreds of items a week, this can be a very time-consuming (and error-prone) process. Of course, item creation is just an example. Depending on your business, there may be many opportunities for automating costly manual processes that occur in your ERP software. Given the hype around RPAs, one obvious solution is to deploy an RPA to solve your automation challenges. I am not so sure….

## What is an RPA?

If you have ever used automated testing tools like Selenium or Cypress, then you have a head start in understanding RPA tools. RPAs automate steps that an end user performs via the UI. It repeats steps like button clicks, data entry into fields and page navigation in a web UI.

For example, if you need to onboard one new user, you might perform the following steps:

1. Login to the Application
2. Navigate to the User Entry page
3. Enter information about the new user
4. Click the Create User button
5. Navigate back to the User Entry page

To onboard 100 users you would repeat steps three to five 100 times while reading data from a file. This is where RPA steps in and performs this series of repetitive steps for you. Being able to perform automations at the UI level makes adoption relatively easy. There is no database to connect to, no code to write or APIs to learn. Essentially you don't really need to involve IT!

## RPA Tool Vs Low Code API Automation

In my opinion, RPAs fall short in two important areas when compared to an Low Code API solution like APEX.

### Changing UI

RPAs rely heavily on a consistent UI. They depend on certain HTML tags being present or fields having specific IDs, Labels, etc.

The problem is, modern ERP solutions like ERP Cloud release new functionality on a quarterly basis. Releases often comes with changes to the UI which can break your RPA processes. A low code solution will typically call APIs (e.g. REST services) to perform automations. While APIs are not completely immune to change, there is the assumption of a contract between an API developer and its consumers. Developers break this contract at their peril.

### Performance and Reliability

Because RPAs interact with the UI they rely on the stability and speed of the UI in order to work effectively. What if there is a 5 second delay between clicking the Save button and the next page appearing? While you can accommodate for the delay in an RPA script, it can have a huge impact on how long it takes to load high volumes of data. In addition, if a page fails to load completely, then your RPA script will fail. You are left figuring out where it failed and having to re-start it from the right spot.

APIs are typically more stable and always more performant than the UI they serve. When you call an API to create a record, you get a specific response from the API and can handle what happens next directly in your code. In addition, there are often API options to perform bulk loads of data where you can send thousands of records in one post.

### License and Resource Costs

You should also consider that while it may not always require the specialized skills of a Developer, RPAs do still require skilled functional resources to keep them running smoothly. When comparing to APEX, you also have to consider the additional license costs that come with an RPA solution.

## Considerations for Automation

There are a few things you should consider before diving into any automated solution. The first is cost. You should weight the cost of developing an automated solution vs the cost of not doing it at all. You should also consider your ability to maintain the solution once it has been implemented. If you build automations based on complex integration software that requires highly specialized skills to maintain, it may end up costing you more (in consulting fees and monthly subscriptions) than the manual processes did.

## Enter APEX

APEX is a Low Code development platform that, assuming you have an Oracle database, requires no additional software licenses. If you are running EBS you can install APEX on your EBS database. If you are running ERP Cloud, you can stand up a PaaS AWS RDS Oracle instance with APEX for as little as $100/month.

We have already blogged that APEX is an ideal partner for both EBS and ERP Cloud. On EBS, APEX lives in the same database as EBS and can easily call EBS public APIs to automate EBS activities. In the cloud, APEX comes complete with numerous utilities to make calling web services easier (web source modules, credential stores, APEX_WEB_SERVICE APIs with automated token renewal, etc.). Used in conjunction with Oracle REST Data Services (ORDS), you can also create Webhooks to handle events from your ERP systems.

## An Example Automation for EBS

Now that we have decided on APEX to build your automation vs using an RPA, what might an APEX centric-solution look like? Let's use the item creation example I mentioned at the start of this post to illustrate what is possible. In this use case, the goal is for a user to be able to create inventory items in EBS with as few manual steps as possible.

The manual steps required by a user to create an item include:

1. Login to EBS
2. Launch EBS java forms
3. Choose an Inventory Organization
4. Navigate to the Item Entry form
5. Find the item you want to copy from
6. Create a new Item as a copy of the item
7. Update the item number and description of the new item
8. Navigate to the item category form
9. Assign the correct item category to the item
10. Navigate to the Item Catalog form
11. Enter up to 5 catalog name catalog value combinations
12. Navigate to the Item Cross references form
13. Create an item cross reference for the new item
14. Repeat steps 4-13 X times

Here is what it looks like when we merge steps 4-13 into one APEX page.

### APEX Automation Use Case

When users first navigate to the APEX page, they choose an inventory organization to copy items from and optionally enter an item prefix to filter source items they can choose from.

![APEX Item Copy - Select Source Items](/images/blog/erp-rpa-apex/apex-app-picture1_orig.png)

The user then adds source items to an interactive grid. Source items are items that already exist in EBS and used as the basis for creating new items in this example.

The target values are handled as follows:

- **Item Number** - Users can manually enter a target item number or click 'Generate Item Numbers' to automatically number the new items using an EBS Document Sequence.
- **Item Template** – Next the user chooses and item template. Items in EBS have hundreds of attributes. An item template allows you to use the template attributes to set the attributes of newly created items.
- **Item Long Description** – The user optionally enters a description of the item.
- **Catalog Values** – Catalogs allow you to assign sets of attributes to an item. The catalog attributes of the source item are brought in automatically and the just must update values for the new item.
- **Cross Reference** – Cross references allow you to cross reference your items to other entities e.g. Supplier Item Numbers. Finally, the user selects a cross reference type and enters a value.

![APEX Item Copy - Configure Target Items](/images/blog/erp-rpa-apex/apex-app-picture2_orig.png)

**Note**: While this looks like a lot, all but two of the above fields are optional. There is even an option for users to upload items Via Excel to perform bulk loads.

An APEX collection is used to store the user entered data until the user is ready to initiate the copy process by clicking 'Copy Items'.

The actual process automation i.e. copying the items, category assignments, catalog elements and cross references is performed by a PL/SQL package called from APEX. The PL/SQL package calls the related EBS Public APIs in sequence utilizing the data from the APEX collection for the required parameters.

EBS Public APIs used by this process:

- Item (ego_item_pub.process_items)
- Category (inv_item_category_pub.create_category_assignment)
- Catalogs (inv_item_catalog_elem_pub.process_item_descr_elements)
- Cross References (mtl_cross_references_pub.process_xref)

When the copy is complete the user is presented with the results of the copy. An added benefit of using APEX is that users can easily see which steps completed successfully and which ones failed.

![APEX Item Copy - Results](/images/blog/erp-rpa-apex/apex-app-picture3_orig.png)

## Conclusion

There is a place for RPAs in performing repetitive tasks on moderate amounts of data on simple UIs that do not regularly change. ERPs rarely fit this mold. Data volumes are usually too high to justify a RPA versus an API due to an RPA's slow performance compared to an API. Additionally, change is built-in and assumed in the cloud. Inconsistent performance is not an option.

APEX answers many questions in the ERP world. In this post we have learned in this post that APEX can also be called on to build complex orchestrated automations both inside and outside of your firewall.

Watch this space for future posts geared towards automating manual processes in ERP Cloud using APEX.

---

Jon Dixon, Co-Founder JMJ Cloud
