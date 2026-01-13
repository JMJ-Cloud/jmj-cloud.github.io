---
title: "Create OKTA Users using REST - #JoelKallmanDay"
date: 2021-10-11
author: "Jon Dixon"
tags: ["APEX", "OKTA", "REST", "PL/SQL", "Identity Management", "JoelKallmanDay"]
summary: "Learn how to use Oracle APEX's APEX_WEB_SERVICE package to create and manage OKTA users via REST API, enabling programmatic user provisioning from your APEX applications."
---

Using the Social Signon capabilities in APEX, you can authenticate your users with a wide range of identity providers such as OKTA, Auth0 or Azure/MS365.

But what if you need to maintain those users from APEX - for example, to enroll a new user? That's where Oracle APEX's built-in APEX_WEB_SERVICE package comes in handy. This blog post shows you how to achieve this.

## Step 1 - Get an OKTA account

In order to use the Okta REST API you'll need an Okta account with a given Okta subdomain, eg **"dev-313934"**. You'll also need to create an API token on this account, which is used for authentication with the REST API, eg "00h5I0GvKUa41234234q80JTds6A21342134".

![OKTA API Token](/images/blog/okta-api-token.png)

## Step 2 - Review the OKTA APIs

You can create a user with either one or two REST API calls:

```
https://{okta_domain}.okta.com/api/v1/users?activate=true

https://{okta_domain}.okta.com/api/v1/users?activate=false
https://{okta_domain}.okta.com/api/v1/users/{user_id}/lifecycle/activate?sendEmai=true
```

`{okta_domain}` is your Okta domain and `{user_id}` is the internal user ID of the specific user, returned by the first REST API call.

As other REST API calls depend upon this, you'll need a mapping table between the user ID e-mail address and Okta user ID (see later).

The REST API returns HTTP 200 OK for success, HTTP 400 Bad Request for errors with JSON details about the error.

You cannot delete a given user in one step, the user needs to be deactivated first.

```
https://{okta_domain}.okta.com/api/v1/users/{user_id}/lifecycle/deactivate
https://{okta_domain}.okta.com/api/v1/users/{user_id}?sendEmail=true
```

Once again, `{okta_domain}` is your Okta domain and `{user_id}` is the internal user ID of the specific user, returned by the create user REST API call.

The REST API returns HTTP 200 OK/204 No Content for success, HTTP 400 Bad Request for errors with JSON details about the error.

## Step 3 - Implement in PL/SQL

The REST API calls can then be wrapped up in a PL/SQL package using APEX_WEB_SERVICE.

```sql
CREATE OR REPLACE PACKAGE jmj_okta_user_pkg AS

/**
 * PL/SQL API for Okta REST API for user management.
 */

                                        --- Okta user info.
  TYPE okta_user_rec IS RECORD (
    f_first_name        VARCHAR2(50),
    f_last_name         VARCHAR2(50),
    f_e_mail_address    VARCHAR2(50),
    f_mobile_no         VARCHAR2(20),
    f_password          VARCHAR2(50),
    f_recovery_question VARCHAR2(50),
    f_recovery_answer   VARCHAR2(50)
  );
                                        --- Okta error info.
  TYPE okta_api_error_rec IS RECORD (
    f_code          VARCHAR2(32),
    f_summary       VARCHAR2(100),
    f_link          VARCHAR2(32),
    f_id            VARCHAR2(32),
    f_cause_summary VARCHAR2(1000)
  );

  FUNCTION create_user(
    p_user     IN okta_user_rec,
    p_activate IN BOOLEAN,
    p_error    OUT okta_api_error_rec
  )
  RETURN INTEGER;

  PROCEDURE set_user_id(
    p_e_mail_address IN VARCHAR2,
    p_user_id        IN VARCHAR2
  );
  FUNCTION get_user_id(
    p_e_mail_address IN VARCHAR2
  )
  RETURN VARCHAR2;

END jmj_okta_user_pkg;
/
```

The package body contains the implementation with APEX_WEB_SERVICE handling all the HTTP communication, token management, and error handling. Key features include:

- **HTTP Request Headers**: Setting Content-Type and Authorization headers with the OKTA API token
- **JSON Parsing**: Using Oracle's JSON_OBJECT_T to parse responses and extract user IDs
- **Error Handling**: Converting OKTA error responses to PL/SQL record types
- **User ID Mapping**: Storing the relationship between email addresses and OKTA user IDs in a mapping table

## Step 4 - Test Your Implementation

```sql
DECLARE

  l_okta_user jmj_okta_user_pkg.okta_user_rec;
  l_result    INTEGER;
  l_error     jmj_okta_user_pkg.okta_api_error_rec;

BEGIN

  l_okta_user.f_first_name     := 'Matt';
  l_okta_user.f_last_name      := 'Paine';
  l_okta_user.f_e_mail_address := 'matt.paine@jmjcloud.com';
  l_okta_user.f_mobile_no      := '+15557777777';
  l_okta_user.f_password       := 'InitCIacYoTiOckeRColigASTRUM';

  l_result := jmj_okta_user_pkg.create_user(l_okta_user, TRUE, l_error);

END;
/
```

## Conclusion

APEX_WEB_SERVICE makes it simple to call REST APIs and integrate your APEX apps with third party identity providers.

On #JoelKallmanDay, we remain grateful to Joel Kallman and the APEX team for the amazing Oracle product and community they built.

## Author

Jon Dixon, Co-Founder JMJ Cloud
