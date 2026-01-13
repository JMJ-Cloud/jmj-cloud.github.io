---
title: "Oracle Cloud Infrastructure Events with APEX and ORDS"
date: 2020-10-01
author: "Jon Dixon"
tags: ["APEX", "ORDS", "OCI", "Oracle Cloud", "Events", "Integration"]
summary: "Learn how to integrate Oracle Cloud Infrastructure (OCI) Events with Oracle APEX and ORDS to build event-driven architectures that respond to cloud resource changes."
---

## Introduction

Oracle Cloud Infrastructure (OCI) Events enables you to create automation based on state changes of resources in your tenancy. Combined with Oracle APEX and ORDS, you can build powerful event-driven applications that respond to cloud infrastructure events in real-time.

## What are OCI Events?

OCI Events service tracks resource changes in your tenancy. When a resource changes state (e.g., a compute instance is created, an object is uploaded to Object Storage), OCI Events captures this change and can trigger actions in response.

## Architecture Overview

The integration flow typically works as follows:

1. **Resource Change** - Something happens in OCI (instance created, file uploaded, etc.)
2. **Event Generated** - OCI Events captures the change
3. **Rule Triggered** - An event rule matches the change
4. **Action Executed** - The rule triggers an action (notification, function, streaming)
5. **ORDS Webhook** - Use OCI Functions to call an ORDS endpoint
6. **APEX Processing** - APEX processes the event and takes action

## Setting Up the Integration

### Step 1: Create an ORDS Endpoint

Create an ORDS REST service that will receive event notifications:

```sql
BEGIN
  ORDS.DEFINE_SERVICE(
    p_module_name    => 'oci_events',
    p_base_path      => '/events/',
    p_pattern        => 'process',
    p_method         => 'POST',
    p_source_type    => 'plsql/block',
    p_source         => 'BEGIN process_oci_event(:body); END;'
  );
  COMMIT;
END;
```

### Step 2: Create an OCI Function

Create a function that calls your ORDS endpoint when triggered:

```python
import io
import json
import requests
from fdk import response

def handler(ctx, data: io.BytesIO = None):
    body = json.loads(data.getvalue())

    # Call ORDS endpoint
    ords_url = "https://your-apex-instance/ords/schema/events/process"
    response = requests.post(ords_url, json=body)

    return response(ctx, response_data=json.dumps({"status": "processed"}))
```

### Step 3: Create an Event Rule

In the OCI Console, create an event rule that:
- Matches the events you're interested in
- Triggers your OCI Function

## Use Cases

- **Audit Logging**: Track all resource changes in your tenancy
- **Auto-Remediation**: Automatically fix non-compliant resources
- **Notifications**: Alert teams when critical resources change
- **Integration**: Sync OCI events with on-premises systems

## Conclusion

Combining OCI Events with APEX and ORDS opens up powerful possibilities for building responsive, event-driven applications in the Oracle Cloud ecosystem.

## Author

Jon Dixon, Co-Founder JMJ Cloud
