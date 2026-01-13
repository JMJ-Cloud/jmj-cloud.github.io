---
title: "Oracle APEX Instant Modal"
date: 2017-01-28
author: "Jon Dixon"
tags: ["APEX", "JavaScript", "Modal", "UI", "Performance"]
summary: "A technical guide explaining how to create an instant modal dialog in Oracle APEX 5 that displays additional information without extra database round trips."
---

This post explains how to create an instant modal dialog in Oracle APEX 5 that displays additional information without extra database round trips. Users can now take an action on a report via a popup and still maintain the context of the report in the underlying window.

![APEX Instant Modal](/images/blog/apex-instant-modal/apex-instant-modal-min.png)

## Modal Dialog Options in APEX

APEX provides several ways to display modal dialogs. The most common approach involves navigating to a modal dialog page, which requires a round trip to the server to fetch the page content. While this works well for complex interactions, it adds latency for simple information display.

The instant modal technique pre-loads the data needed for the modal into the report itself, allowing immediate display without server communication.

## The Finished Product

When clicking on a row in the report, a modal instantly appears with details about that record. The modal content comes from JSON data embedded in the report row itself.

![Instant Modal Example](/images/blog/apex-instant-modal/example-instant-modal_orig.png)

## Page Structure

The implementation requires three main components:

1. **DB Tables Report Region**: A report displaying database table information
2. **Record Detail Inline Dialog Region**: The modal container that displays details
3. **Dynamic Action**: JavaScript code that triggers on row click

### Component 1: The Report Query

The SQL query builds JSON data for each table row:

```sql
SELECT
    table_name,
    num_rows,
    last_analyzed,
    -- Build JSON containing all detail fields
    '{"tableName":"' || table_name ||
    '","numRows":"' || NVL(TO_CHAR(num_rows), 'N/A') ||
    '","lastAnalyzed":"' || NVL(TO_CHAR(last_analyzed, 'DD-MON-YYYY'), 'Never') ||
    '"}' AS json_data
FROM user_tables
ORDER BY table_name
```

The JSON column is hidden from display but included in the report output.

### Component 2: The Inline Dialog Region

Create an inline dialog region with static content or items to display the detail information. Mark the region as an inline dialog in the region attributes.

The dialog should include:

- Display-only items for each field you want to show
- Appropriate styling using Universal Theme classes
- A close button or standard dialog controls

### Component 3: The Dynamic Action

Create a dynamic action that fires on click of report rows:

**Event**: Click
**Selection Type**: jQuery Selector
**jQuery Selector**: `#report_static_id td`

The JavaScript true action parses the JSON and populates the modal:

```javascript
// Get the JSON data from the clicked row
var rowData = $(this.triggeringElement).closest('tr').find('.json-data').text();
var jsonObj = JSON.parse(rowData);

// Populate the modal items
$s('P1_TABLE_NAME', jsonObj.tableName);
$s('P1_NUM_ROWS', jsonObj.numRows);
$s('P1_LAST_ANALYZED', jsonObj.lastAnalyzed);

// Open the inline dialog
apex.theme.openRegion('detail_dialog');
```

## Technical Notes

A few important considerations:

- In APEX 5.0.4, using `#AUTH_ID#` worked for substitution strings, but in 5.1 only `&AUTH_ID.` appears to work consistently
- Consider clearing page item values after closing the modal to prevent stale data
- Test with various data types to ensure JSON encoding handles special characters

## Use Cases

This technique works well for:

- Quick record previews without full page loads
- Displaying additional details on hover or click
- Confirmation dialogs with context
- Any scenario where you want to show extra information instantly

The key benefit is performance - no server round trips means instant responsiveness for your users.

## Conclusion

The instant modal technique provides a smooth user experience by eliminating the delay of server communication. By embedding the necessary data as JSON in your report rows, you can display modals instantly while maintaining the simplicity of declarative APEX development.

---

Jon Dixon, Co-Founder JMJ Cloud
