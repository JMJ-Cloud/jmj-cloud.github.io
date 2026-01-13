---
title: "PPM Cloud REST API - Assigning Team Members using cURL"
date: 2017-06-15
author: "Jon Dixon"
tags: ["Oracle Cloud", "PPM", "REST API", "cURL", "Integration"]
summary: "This article demonstrates using the PPM Cloud REST API to automate worker assignments to projects, addressing a common challenge in Oracle PPM systems where manual assignment maintenance becomes burdensome."
---

This article demonstrates using the PPM Cloud REST API to automate worker assignments to projects, addressing a common challenge in Oracle PPM systems where manual assignment maintenance becomes burdensome as organizations scale.

![PPM Cloud REST API](/images/blog/ppm-cloud-rest-api/ppm-cloud-rest-api-min.png)

## The Challenge

Managing project team assignments manually in Oracle PPM Cloud works fine for small organizations, but becomes increasingly difficult as the number of projects and workers grows. Automating these assignments via the REST API provides a scalable solution.

## Prerequisites

To call PPM REST APIs, users need:

- An ERP Cloud account with the "Projects Integration Specialist" role
- Access to the PPM Cloud instance

The base URL format for PPM REST API calls is:

```
https://<pod>.prj.<region>.oraclecloud.com:443
```

## Retrieving Project IDs

The Team Members REST API uses internal Project IDs rather than user-friendly project numbers. Before assigning team members, you need to identify the correct Project ID.

### Option 1: SQL Query via BI Publisher

Query the `pjf_projects_all_v` view to match project numbers with their internal IDs:

```sql
SELECT project_id, segment1 AS project_number, name AS project_name
FROM pjf_projects_all_v
WHERE segment1 = 'YOUR_PROJECT_NUMBER';
```

![Project ID Query](/images/blog/ppm-cloud-rest-api/ppm-bi-query_orig.png)

### Option 2: REST API Call

Use cURL with a GET request to the projects endpoint:

```bash
curl -u username:password \
  -H "Content-Type: application/json" \
  "https://pod.prj.region.oraclecloud.com/ppmProjectPlanningV2/ProjectListResource?q=ProjectNumber=YOUR_PROJECT_NUMBER"
```

![REST API Query](/images/blog/ppm-cloud-rest-api/ppm-rest-query_orig.png)

## Assigning Workers to Projects

The POST request requires an ADF JSON object containing three required fields:

- **PersonEmail**: The unique identifier of the worker (must be unique per worker)
- **ProjectRole**: The role to assign (e.g., "Project Manager", "Team Member")
- **StartDate**: When the assignment begins

### cURL Example

```bash
curl -u username:password \
  -X POST \
  -H "Content-Type: application/vnd.oracle.adf.resourceitem+json" \
  -d '{
    "PersonEmail": "[email protected]",
    "ProjectRole": "Team Member",
    "StartDate": "2017-06-01"
  }' \
  "https://pod.prj.region.oraclecloud.com/ppmProjectPlanningV2/ProjectResource/PROJECT_ID/child/TeamMembersResource"
```

Important: The unique identifier of the worker is the email address. Each worker must have one unique email in the system.

## Managing Team Assignments

### List Team Members

Retrieve current team assignments via GET request:

```bash
curl -u username:password \
  -H "Content-Type: application/json" \
  "https://pod.prj.region.oraclecloud.com/ppmProjectPlanningV2/ProjectResource/PROJECT_ID/child/TeamMembersResource"
```

### Remove Workers

Remove a worker by adding an end-date using the PATCH method:

```bash
curl -u username:password \
  -X PATCH \
  -H "Content-Type: application/vnd.oracle.adf.resourceitem+json" \
  -d '{
    "FinishDate": "2017-06-30"
  }' \
  "https://pod.prj.region.oraclecloud.com/ppmProjectPlanningV2/ProjectResource/PROJECT_ID/child/TeamMembersResource/TEAM_MEMBER_ID"
```

### Update Dates

Note: You're limited to updating the Start Date and Finish Date via PATCH. You cannot modify the assigned role using this method - you would need to end the current assignment and create a new one with the different role.

## Error Handling

The API returns detailed error responses in XML format. Common errors include:

### Duplicate Role Assignment

If you try to assign the same role to a worker during overlapping date ranges:

```xml
<error>
  <message>A team member with the same person, role, and overlapping dates already exists.</message>
</error>
```

### Invalid Email

If the email address doesn't match a worker in the system:

```xml
<error>
  <message>The person email provided is not valid.</message>
</error>
```

## Conclusion

The PPM Cloud REST API provides a powerful way to automate project team management. Key points to remember:

- Use Project ID (not project number) for API calls
- Worker identity is based on email address
- Role changes require end-dating and re-creating assignments
- Proper error handling is essential for robust integrations

This approach scales well for organizations managing hundreds of projects and thousands of worker assignments.

---

Jon Dixon, Co-Founder JMJ Cloud
