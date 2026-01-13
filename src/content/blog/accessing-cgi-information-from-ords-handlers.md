---
title: "Accessing CGI Information from ORDS Handlers"
date: 2016-09-01
author: "Jon Dixon"
tags: ["ORDS", "CGI", "PL/SQL", "REST", "OWA_UTIL"]
summary: "OWA_UTIL is a database package that provides access to PL/SQL Common Gateway Interface (CGI) variables. This post explains how to use it in ORDS handlers."
---

OWA_UTIL is a database package that provides access to PL/SQL Common Gateway Interface (CGI) variables. This functionality is available for POST, PUT, and DELETE services - not for Collection or Query GET handlers.

## Background

When building ORDS REST services, you often need access to information about the incoming request beyond just the body parameters. CGI (Common Gateway Interface) variables provide metadata about the request, including headers, server information, and request details.

## Viewing All Available CGI Variables

You can use `owa_util.print_cgi_env` to display all available CGI variables. This is useful during development to understand what information is available:

```sql
BEGIN
  owa_util.print_cgi_env;
END;
```

This will output variables including:

- **REQUEST_METHOD**: GET, POST, PUT, DELETE
- **PATH_INFO**: The resource path
- **SCRIPT_NAME**: The ORDS module path
- **SERVER_NAME**: The server hostname
- **REQUEST_PROTOCOL**: HTTP version
- **QUERY_STRING**: URL parameters
- **CONTENT_TYPE**: Request body format
- **HTTP_***: All HTTP headers

## Practical Applications

There are several practical use cases for CGI information in ORDS handlers:

### 1. Creating Generic Logging APIs

Build a logging service that captures all details about incoming web service calls:

```sql
DECLARE
  l_method    VARCHAR2(100);
  l_path      VARCHAR2(500);
  l_client_ip VARCHAR2(50);
BEGIN
  l_method    := owa_util.get_cgi_env('REQUEST_METHOD');
  l_path      := owa_util.get_cgi_env('PATH_INFO');
  l_client_ip := owa_util.get_cgi_env('REMOTE_ADDR');

  INSERT INTO api_log (method, path, client_ip, log_time)
  VALUES (l_method, l_path, l_client_ip, SYSDATE);
END;
```

### 2. Honoring HTTP Header Values

Respect client preferences for response formatting:

```sql
DECLARE
  l_accept VARCHAR2(200);
BEGIN
  l_accept := owa_util.get_cgi_env('HTTP_ACCEPT');

  IF INSTR(l_accept, 'application/xml') > 0 THEN
    -- Return XML format
    NULL;
  ELSE
    -- Default to JSON
    NULL;
  END IF;
END;
```

### 3. Identifying ORDS Version Information

Access server and ORDS version details:

```sql
DECLARE
  l_server_software VARCHAR2(200);
BEGIN
  l_server_software := owa_util.get_cgi_env('SERVER_SOFTWARE');
  -- Returns something like: ORDS/3.0.7
END;
```

## Accessing Individual Values

Rather than parsing all variables, use `owa_util.get_cgi_env` to retrieve specific values:

```sql
DECLARE
  l_request_url VARCHAR2(1000);
BEGIN
  -- Reconstruct the complete request URL
  l_request_url :=
    owa_util.get_cgi_env('REQUEST_PROTOCOL') || '://' ||
    owa_util.get_cgi_env('SERVER_NAME') ||
    owa_util.get_cgi_env('SCRIPT_NAME') ||
    owa_util.get_cgi_env('PATH_INFO');

  IF owa_util.get_cgi_env('QUERY_STRING') IS NOT NULL THEN
    l_request_url := l_request_url || '?' ||
                     owa_util.get_cgi_env('QUERY_STRING');
  END IF;

  DBMS_OUTPUT.PUT_LINE('Full URL: ' || l_request_url);
END;
```

## Common CGI Variables

Here are the most commonly used CGI variables in ORDS handlers:

| Variable | Description |
|----------|-------------|
| REQUEST_METHOD | HTTP method (GET, POST, PUT, DELETE) |
| PATH_INFO | Resource path after the module |
| QUERY_STRING | URL query parameters |
| CONTENT_TYPE | MIME type of request body |
| CONTENT_LENGTH | Size of request body |
| SERVER_NAME | Hostname of the server |
| SERVER_PORT | Port number |
| REMOTE_ADDR | Client IP address |
| HTTP_AUTHORIZATION | Authorization header value |
| HTTP_* | Any HTTP header (prefixed with HTTP_) |

## Conclusion

CGI information provides valuable context about incoming requests that goes beyond the request body. By leveraging OWA_UTIL in your ORDS handlers, you can build more sophisticated services that log requests, honor client preferences, and access any HTTP header.

---

Jon Dixon, Co-Founder JMJ Cloud
