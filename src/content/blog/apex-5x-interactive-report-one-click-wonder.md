---
title: "APEX 5.X Interactive Report One Click Wonder"
date: 2017-02-20
author: "Jon Dixon"
tags: ["APEX", "Interactive Report", "JavaScript", "UI", "Dynamic Action"]
summary: "This post describes a technique for implementing single-click actions on Oracle APEX 5.X interactive reports. Users can now take an action on a report via a popup and still maintain the context of the report."
---

This post describes a technique for implementing single-click actions on Oracle APEX 5.X interactive reports. Users can now take an action on a report via a popup and still maintain the context of the report in the underlying window.

![Interactive Report One Click](/images/blog/ir-one-click-wonder/ir-one-click-min.png)

## The Use Case

We recently completed a replacement for a Microsoft-based dashboarding solution. The original technology handled user authorization, and we needed to replicate that functionality in APEX 5. The admin needs a way to quickly de-authorize users - ideally with a single click that doesn't disrupt their workflow.

The solution involves displaying a trash icon on report rows that triggers immediate deletion without modal popups.

![One Click Example](/images/blog/ir-one-click-wonder/oneclick-1_orig.png)

## Technical Implementation

The approach involves three main components:

### 1. JavaScript Function

A page-level function captures clicks and updates a page item with the record ID:

```javascript
function setDeleteId(authId) {
    $s('P65_AUTH_ID_TO_DELETE', authId);
}
```

### 2. Page Item

Create a hidden page item `P65_AUTH_ID_TO_DELETE` to store the selected record's identifier. This acts as a bridge between the JavaScript click handler and the Dynamic Action.

### 3. The Interactive Report Query

The SQL query selects from the authorization table and includes a link column:

```sql
SELECT
    AUTH_ID,
    USER_NAME,
    SECURITY_GROUP_ID,
    LAST_UPDATE_DATE,
    LAST_UPDATED_BY,
    '<span class="fa fa-trash-o delete-icon" onclick="setDeleteId(' || AUTH_ID || ')"></span>' AS DELETE_AUTH
FROM XX_APXDB_SECURITY_AUTH
ORDER BY USER_NAME
```

![Report Query Setup](/images/blog/ir-one-click-wonder/oneclick-3_orig.png)

The DELETE_AUTH column displays a Font Awesome trash icon that calls our JavaScript function when clicked.

### 4. Column Configuration

Configure the DELETE_AUTH column:

- **Display As**: Standard Report Column (to render HTML)
- **Escape Special Characters**: No (to allow HTML rendering)
- **Column Alignment**: Center

![Column Settings](/images/blog/ir-one-click-wonder/oneclick-4_orig.png)

### 5. Dynamic Action

Create a Dynamic Action to process the deletion:

**Event**: Change
**Selection Type**: Item(s)
**Item(s)**: P65_AUTH_ID_TO_DELETE

![Dynamic Action Setup](/images/blog/ir-one-click-wonder/oneclick-5_orig.png)

**True Action 1**: Execute PL/SQL Code

```sql
DELETE FROM XX_APXDB_SECURITY_AUTH
WHERE AUTH_ID = :P65_AUTH_ID_TO_DELETE;
```

**Items to Submit**: P65_AUTH_ID_TO_DELETE

![PL/SQL Action](/images/blog/ir-one-click-wonder/oneclick-6_orig.png)

**True Action 2**: Refresh Region (your Interactive Report region)

![Refresh Region](/images/blog/ir-one-click-wonder/oneclick-7_orig.png)

## Important Technical Notes

One issue we encountered: in APEX 5.0.4 using `#AUTH_ID#` worked for substitution strings, but in 5.1 only `&AUTH_ID.` appears to work.

Additionally, consider clearing the page item value after processing to prevent issues if the same ID is used subsequently. You can add a third True Action that executes JavaScript:

```javascript
$s('P65_AUTH_ID_TO_DELETE', '');
```

## Broader Applications

This technique isn't limited to deletions. Similar approaches could facilitate:

- Approving or rejecting inbox records
- Marking items as read/unread
- Closing service requests
- Toggling status flags
- Any workflow requiring repetitive single-action decisions across multiple records

![Final Result](/images/blog/ir-one-click-wonder/oneclick-8_orig.png)

## Conclusion

The one-click wonder pattern provides a clean, efficient way to let users take immediate actions on Interactive Report rows. By combining a JavaScript function, a hidden page item, and a Dynamic Action, you create a responsive interface that doesn't disrupt the user's context.

This approach is particularly valuable for admin screens where users need to process many records quickly without the overhead of navigating to detail pages or confirming every action.

---

Jon Dixon, Co-Founder JMJ Cloud
