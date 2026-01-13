---
title: "Using Oracle Storage Cloud Service for APEX BLOBs"
date: 2017-02-01
author: "Jon Dixon"
tags: ["APEX", "Oracle Cloud", "Storage", "BLOBs", "REST"]
summary: "This post addresses storing Binary Large Objects (BLOBs) in Oracle's Storage Cloud Service rather than database columns, offering a practical alternative to traditional database storage."
---

This post addresses storing Binary Large Objects (BLOBs) in Oracle's Storage Cloud Service rather than database columns, offering a practical alternative to traditional database storage.

![Oracle Storage Cloud for APEX](/images/blog/oracle-storage-cloud-apex/storagecloudimage-min.png)

## Problems with Database BLOBs

Storing BLOBs directly in Oracle database columns has several disadvantages:

1. **Database Size**: They increase the size of your database considerably. This makes backing up and restoring your database a more time-consuming process.

2. **Cost**: Larger databases mean higher storage costs, especially in cloud environments where you pay per GB.

3. **Performance**: Retrieving BLOBs increases database and ORDS load, potentially impacting other users and operations.

## The Alternative: Cloud Storage

Instead of storing files in the database, we can store them in Oracle Storage Cloud Service (or other cloud storage services like AWS S3 or Google Drive) and keep only metadata and references in the database.

![Storage Cloud Architecture](/images/blog/oracle-storage-cloud-apex/storagecloudarchitecture-min_orig.png)

## Implementation Overview

### File Details Table

Create a local table to track cloud-stored files:

```sql
CREATE TABLE file_details (
    file_id         NUMBER GENERATED ALWAYS AS IDENTITY,
    visible_name    VARCHAR2(255),
    storage_name    VARCHAR2(255),
    mime_type       VARCHAR2(100),
    file_size       NUMBER,
    storage_endpoint VARCHAR2(500),
    created_date    DATE DEFAULT SYSDATE,
    CONSTRAINT file_details_pk PRIMARY KEY (file_id)
);
```

This approach applies to any cloud storage service - the principles remain the same.

## Technical Implementation

### Authentication

Oracle Storage Cloud Service uses token-based authentication. First, obtain a token from Oracle's auth service (tokens are valid for 30 minutes):

```sql
DECLARE
    l_token VARCHAR2(4000);
    l_url   VARCHAR2(500) := 'https://identity-domain.storage.oraclecloud.com/auth/v1.0';
BEGIN
    apex_web_service.g_request_headers.DELETE;
    apex_web_service.g_request_headers(1).name := 'X-Storage-User';
    apex_web_service.g_request_headers(1).value := 'Storage-myidentitydomain:myuser';
    apex_web_service.g_request_headers(2).name := 'X-Storage-Pass';
    apex_web_service.g_request_headers(2).value := 'mypassword';

    l_token := apex_web_service.make_rest_request(
        p_url         => l_url,
        p_http_method => 'GET'
    );

    -- Token returned in X-Auth-Token response header
    FOR i IN 1..apex_web_service.g_headers.COUNT LOOP
        IF apex_web_service.g_headers(i).name = 'X-Auth-Token' THEN
            l_token := apex_web_service.g_headers(i).value;
        END IF;
    END LOOP;
END;
```

### File Upload

Use the PUT REST API to store files in containers:

```sql
DECLARE
    l_response CLOB;
    l_blob     BLOB;
    l_url      VARCHAR2(500);
BEGIN
    -- Get the file from APEX file browse item
    SELECT blob_content INTO l_blob
    FROM apex_application_temp_files
    WHERE name = :P1_FILE;

    l_url := 'https://identity-domain.storage.oraclecloud.com/v1/Storage-myidentitydomain/mycontainer/filename.pdf';

    apex_web_service.g_request_headers.DELETE;
    apex_web_service.g_request_headers(1).name := 'X-Auth-Token';
    apex_web_service.g_request_headers(1).value := l_token;
    apex_web_service.g_request_headers(2).name := 'Content-Type';
    apex_web_service.g_request_headers(2).value := 'application/pdf';

    l_response := apex_web_service.make_rest_request_b(
        p_url         => l_url,
        p_http_method => 'PUT',
        p_body_blob   => l_blob
    );
END;
```

### File Listing

Retrieve JSON-formatted file lists and populate APEX collections:

```sql
DECLARE
    l_response CLOB;
    l_json     apex_json.t_values;
BEGIN
    apex_web_service.g_request_headers.DELETE;
    apex_web_service.g_request_headers(1).name := 'X-Auth-Token';
    apex_web_service.g_request_headers(1).value := l_token;
    apex_web_service.g_request_headers(2).name := 'Accept';
    apex_web_service.g_request_headers(2).value := 'application/json';

    l_response := apex_web_service.make_rest_request(
        p_url         => l_url || '?format=json',
        p_http_method => 'GET'
    );

    apex_json.parse(l_json, l_response);

    -- Process JSON response
    FOR i IN 1..apex_json.get_count(p_path => '.', p_values => l_json) LOOP
        -- Extract file details and store in collection
        NULL;
    END LOOP;
END;
```

### Certificate Management

For HTTPS calls, you'll need to import SSL certificates into database wallets. This is a one-time setup task for each cloud service endpoint.

![Certificate Setup](/images/blog/oracle-storage-cloud-apex/storagecloudcertificate_orig.png)

## Practical Considerations

When implementing cloud storage for BLOBs:

- **Limit file sizes**: Set reasonable maximum file sizes for uploads
- **Consider compression**: Compress files before upload where appropriate
- **Public URLs**: For frequently-used assets, consider making them publicly accessible to avoid database round trips
- **Cleanup**: Implement processes to remove orphaned files from cloud storage

## Conclusion

Moving BLOB storage to Oracle Storage Cloud Service (or any cloud storage) can significantly reduce database size and improve performance. The approach requires more code than simple database storage, but the benefits in scalability and cost make it worthwhile for applications handling significant file volumes.

The general pattern - store files externally, keep metadata locally - applies regardless of which cloud storage provider you choose.

---

Jon Dixon, Co-Founder JMJ Cloud
