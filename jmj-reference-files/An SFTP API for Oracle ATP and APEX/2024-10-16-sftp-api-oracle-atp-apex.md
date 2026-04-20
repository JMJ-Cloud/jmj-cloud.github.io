---
layout: post
title: "An SFTP API for Oracle ATP and APEX"
date: 2024-10-16
author: Matt Paine
categories: [APEX, Oracle Cloud, Integration]
tags: [orclapex, oracle-erp, sftp, oci-functions, plsql]
description: "Creating a PL/SQL package in your ATP database to execute SFTP operations using OCI Functions — send, receive, and list files on remote SFTP servers directly from Oracle APEX."
image: /assets/images/blog/sftp-api.jpg
---

## Introduction

This article describes creating a PL/SQL package in your ATP database to execute SFTP operations. SFTP (Secure File Transfer Protocol) is a network protocol that provides secure file transfer capabilities. It's built on the SSH (Secure Shell) protocol and offers encrypted command execution and data transfer over a network.

Oracle Integration Cloud supports SFTP to facilitate secure file transfers and automate data workflows, but PL/SQL running in Oracle Autonomous Database can also invoke SFTP via OCI Functions. This Proof of Concept implementation re-uses much of the OCI SFTP function code on the following blog, extending it to be called from the database: [https://blogs.oracle.com/dataintegration/post/data-integration-and-sftp](https://blogs.oracle.com/dataintegration/post/data-integration-and-sftp)

## PL/SQL API Examples

Once the code is installed and configured, you will be able to send, receive, and list files on a remote SFTP server, as shown in the following examples:

### SFTP - GET

This example creates a CLOB from the text content of a file called `MYDEMO_GET.csv` located in the `/home/opc/outbound` directory on a remote SFTP server.

```sql
SET SERVEROUTPUT ON
DECLARE
    l_response CLOB;
    l_content  CLOB;
BEGIN
    jmj_sftp_pkg.sftp_file_to_clob(
        p_sftp_folder   => '/home/opc/outbound',
        p_sftp_filename => 'mytargetdata.csv',
        p_content       => l_content,
        p_response      => l_response
    );
    DBMS_OUTPUT.PUT_LINE(DBMS_LOB.SUBSTR(l_response, 1000, 1));
    DBMS_OUTPUT.PUT_LINE('FILE CONTENT');
    DBMS_OUTPUT.PUT_LINE(DBMS_LOB.SUBSTR(l_content, 1000, 1));
END;
/
```

### SFTP - PUT

This example sends a CLOB text document to a file named `MYDEMO_PUT.csv` in the `/home/opc/inbound` directory on a remote SFTP server.

```sql
SET SERVEROUTPUT ON
DECLARE
    l_response CLOB;
BEGIN
    jmj_sftp_pkg.clob_to_sftp(
        p_content       => q'[MYCLOB ,myclob]',
        p_sftp_folder   => '/home/opc/inbound',
        p_sftp_filename => 'MYDEMO_PUT.csv',
        p_response      => l_response
    );
    DBMS_OUTPUT.PUT_LINE(DBMS_LOB.SUBSTR(l_response, 1000, 1));
END;
/
```

### SFTP - LIST

This example lists the files in the `/home/opc` directory on a remote SFTP server.

```sql
SET SERVEROUTPUT ON
DECLARE
    l_response CLOB;
BEGIN
    jmj_sftp_pkg.list_files(
        p_sftp_folder  => '/home/opc',
        p_sftp_pattern => '*.csv',
        p_response     => l_response
    );
    DBMS_OUTPUT.PUT_LINE(DBMS_LOB.SUBSTR(l_response, 1000, 1));
    
    FOR rec IN (
        SELECT column_value filename 
        FROM TABLE(jmj_sftp_pkg.file_list_as_array(l_response))
    ) LOOP
        DBMS_OUTPUT.PUT_LINE(rec.filename);
    END LOOP;
END;
/
```

## Solution Components

The main components supporting the demo PL/SQL API are:

- **OCI Storage Bucket** — An OCI bucket is used to store inbound and outbound files.
- **OCI Vault** — An OCI vault is configured to store the SSH key used for the SFTP connection as a secret.
- **OCI Function** — The function uses the Paramiko and OCI libraries to execute SFTP using SSH. The OCI bucket is used for file storage, and the SSH key is retrieved from the OCI vault. Paramiko is an open-source Python implementation of the SSHv2 protocol.
- **DBMS_CLOUD and DBMS_CLOUD_CATALOG Packages** — These packages are used to access the OCI function from the ATP database.
- **JMJ_SFTP_PKG** — This custom package is a wrapper around the OCI function to simplify calls from PL/SQL.

## Configuration and Code

### OCI Storage Bucket

Create an OCI storage bucket with inbound and outbound folders. Note your bucket's namespace; this will be used in later steps.

### OCI Vault

The example in this blog assumes your SFTP server is accessed using a passwordless SSH key, so you can access it using the following syntax:

```bash
$ sftp -i $HOME/.ssh/mykey.key myuser@myserver
```

The SSH private key is stored as a secret in an OCI vault. Create a vault, then add the secret using the entire contents of your secret key file including the opening `-----BEGIN RSA PRIVATE KEY-----` and the closing `-----END RSA PRIVATE KEY-----`.

Note the SSH Key Secret OCID; this is used in later steps.

### OCI Function

Creation of an OCI python function requires three files:
- `func.py` (function source code, with an entry point named handler)
- `func.yaml` (function configuration file, including the function name, `fun_jmj_sftp_demo`)
- `requirements.txt` (list of required python libraries, such as oci and paramiko)

The demo code is located here: [https://github.com/greendragoncloud/jmjsftpdemo](https://github.com/greendragoncloud/jmjsftpdemo)

Before you begin, you'll need to gather the following information:
- OCI Region (e.g. us-phoenix-1)
- OCI Compartment ID
- OCI Bucket Namespace
- Your Cloud Infrastructure Registry address (e.g. phx.ocir.io)
- An Auth Token for your OCI user

Under Functions → Applications, create the application that will hold your OCI function. Then, start Cloud Shell and build your function:

```bash
# Set Demo Application Context
fn use context <REGION>
fn update context oracle.compartment-id <COMPARTMENT OCID>
fn update context registry <OCI REGISTRY>/<NAMESPACE>/sftp-demo-app

# Login to Registry using your Auth Token
docker login -u '<your namespace>/<your OCI username>' <OCI REGISTRY>

# Create sftp-demo-app shell
fn init --runtime python sftp-demo-app
cd sftp-demo-app

# Replace code in the following files with the code from GitHub
vi func.py
vi func.yaml
vi requirements.txt

# Deploy application function (this takes a while to run - like 10min)
fn -v deploy --app sftp-demo-app
```

### Add Function Catalog to Database

In OCI, create an OCI API Key and note the resulting User OCID, Fingerprint, Tenancy OCID, OCI Region, and API Private Key Content.

Create a DBMS_CLOUD credential using these values:

```sql
BEGIN
    DBMS_CLOUD.CREATE_CREDENTIAL(
        credential_name => 'OCI_KEY_CRED',
        user_ocid       => '<USER OCID>',
        tenancy_ocid    => '<TENANCY OCID>',
        private_key     => 'MIIEvgIBADANBgk...API KEY CONTENT...',
        fingerprint     => '<API KEY FINGERPRINT>'
    );
END;
/
```

Create the function catalog from OCI:

```sql
BEGIN
    DBMS_CLOUD_FUNCTION.CREATE_CATALOG(
        credential_name  => 'OCI_KEY_CRED',
        catalog_name     => 'OCI_DEMO_CATALOG',
        service_provider => 'OCI',
        cloud_params     => '{"region_id":"<API KEY REGION>","compartment_id":"<OCI COMPARTMENT OCID>"}'
    );
END;
/
```

Create PL/SQL functions in the database from the OCI Functions:

```sql
BEGIN
    DBMS_CLOUD_FUNCTION.SYNC_FUNCTIONS(
        catalog_name => 'OCI_DEMO_CATALOG'
    );
END;
/
```

### Compile PL/SQL

The demo PL/SQL package is a basic wrapper around the OCI function call, defaulting to a single target SFTP server. This can be extended/rewritten as needed to allow connections to different SFTP servers with different credentials.

Edit the `jmj_sftp_constants_pkg` package specification to match your test SFTP server:

```sql
CREATE OR REPLACE PACKAGE jmj_sftp_constants_pkg AS
    -- Target SFTP Credentials
    GC_HOSTNAME            CONSTANT VARCHAR2(240)  := '<MY HOST>';
    GC_SFTP_USER           CONSTANT VARCHAR2(100)  := '<MY USER>';
    GC_SFTP_SSH_SECRET_OCID CONSTANT VARCHAR2(1000) := '<MY SECRET OCID>';
    
    -- OCI Storage
    GC_OCI_KEY             CONSTANT VARCHAR2(100)  := 'OCI_KEY_CRED';
    GC_BUCKET              CONSTANT VARCHAR2(1000) := '<MY BUCKET>';
    GC_BUCKET_INBOUND_FOLDER  CONSTANT VARCHAR2(1000) := 'inbound';
    GC_BUCKET_OUTBOUND_FOLDER CONSTANT VARCHAR2(1000) := 'outbound';
    GC_OCI_NAMESPACE       CONSTANT VARCHAR2(100)  := '<MY NAMESPACE>';
    GC_OCI_OBJECT_BASE_URL CONSTANT VARCHAR2(100)  := 'https://objectstorage.<MY REGION>.oraclecloud.com';
END jmj_sftp_constants_pkg;
/
```

**JMJ_SFTP_PKG** has the following subprograms:
- `PROCEDURE oci_file_to_sftp` — Send a file already in an OCI bucket to the SFTP
- `PROCEDURE sftp_file_to_oci` — Pull a file from the SFTP to an OCI bucket
- `PROCEDURE clob_to_sftp` — Create a text file from the CLOB, put it into the OCI bucket and send to the SFTP
- `PROCEDURE sftp_file_to_clob` — Pull a file from the SFTP to an OCI bucket, then return its text content
- `PROCEDURE list_files` — List files on the SFTP folder
- `FUNCTION file_list_as_array` — Pipelined function parsing the response from list_files into a TABLE

## Further Ideas

There are lots of ways the demo code can be extended and improved:
- Add SFTP commands to delete files, create directories etc.
- Include the ability to specify a non-standard SFTP port
- Extend the PL/SQL API to allow the caller to specify the host, port and secret OCID
- Support for PGP encryption/decryption using the pgpy python library
- Improvements for error trapping/logging
- Use of a resource principal to sync the functions down to the Oracle database
- Overload the API to support password-based authentication

## Summary

The proof of concept solution above shows how to use SFTP within Oracle Autonomous Database and Oracle APEX.

APEX is a powerhouse integration and extension tool for Oracle ERP Cloud. It can connect to ERP Cloud REST APIs, store data, display data with and without synchronization, call SOAP and REST web services, host REST web services, zip and unzip files, run background jobs, process approvals via workflow and create embedded page extensions in ERP Cloud.

A missing element was the ability to send and receive files using SFTP. While SFTP can be seen as an older style of integration, it is often required in banking and payroll environments, or any third party that doesn't support alternatives such as REST web services.

The solution above fixes this gap. The OCI python function allows SFTP to be used without needing Oracle Integration Cloud. If SFTP is your main reason for adding Oracle Integration Cloud to your Oracle footprint … it could be that you don't need Oracle Integration Cloud in your implementation.

---

*This is my #JoelKallmanDay contribution.*
