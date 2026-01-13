---
title: "How Oracle ORDS RESTful Services are Structured"
date: 2016-10-06
author: "Jon Dixon"
tags: ["ORDS", "REST", "Architecture", "Oracle", "API Design"]
summary: "Oracle REST Data Services implements REST-based services through four primary structures: schema, module, template, and handler. This post explains how they work together."
---

Oracle REST Data Services (ORDS) implements REST-based services through four primary structures: schema, module, template, and handler. Understanding this hierarchy is essential for designing well-organized APIs.

![ORDS Logo](/images/blog/ords-restful-structure/ordslogo.png)

## The Four Levels

![ORDS REST Structure](/images/blog/ords-restful-structure/ords-rest-structure.png)

ORDS organizes REST services in a hierarchical structure:

1. **Schema** - The top-level container
2. **Module** - Groups related services
3. **Template** - Represents a resource
4. **Handler** - Contains the service logic

## Schema Level

The schema represents the highest level container. When enabled for ORDS using `ORDS.ENABLE_SCHEMA`, you specify the schema name and a URL pattern:

```sql
BEGIN
  ORDS.ENABLE_SCHEMA(
    p_enabled             => TRUE,
    p_schema              => 'XXEBSREST',
    p_url_mapping_type    => 'BASE_PATH',
    p_url_mapping_pattern => 'ebs',
    p_auto_rest_auth      => FALSE
  );
  COMMIT;
END;
/
```

This routes all requests containing "/ebs" to that schema's handlers.

**Design tip:** Just because you named your schema xxr2d2 because of some internal standard does not mean you have to use this in the URL mapping. Choose a meaningful, user-friendly URL pattern.

## Module Level

Modules group related services within a schema. They appear in the URL path, so naming requires careful consideration:

```sql
BEGIN
  ORDS.DEFINE_MODULE(
    p_module_name    => 'v1',
    p_base_path      => '/v1/',
    p_items_per_page => 25,
    p_status         => 'PUBLISHED'
  );
  COMMIT;
END;
/
```

### Versioning Strategy

I recommend using modules for API versioning. This allows v1 and v2 consumers to coexist, enabling graceful migration without disrupting existing users:

```
https://server/ords/ebs/v1/customers  -- Original version
https://server/ords/ebs/v2/customers  -- New version with breaking changes
```

## Template Level

Templates represent REST resources (customer, order, etc.). They form the final URL segment:

```sql
BEGIN
  ORDS.DEFINE_TEMPLATE(
    p_module_name    => 'v1',
    p_pattern        => 'customer',
    p_priority       => 0,
    p_etag_type      => 'HASH',
    p_etag_query     => NULL
  );
  COMMIT;
END;
/
```

Following REST principles, resource names should be **nouns** rather than verbs:

| Good | Bad |
|------|-----|
| /customer | /getCustomer |
| /order | /updateOrder |
| /invoice | /deleteInvoice |

Example URLs following this pattern:

```
http://example.com/ords/ebs/v2/customer
http://example.com/ords/ebs/v2/order
http://example.com/ords/ebs/v2/invoice
```

## Handler Level

Handlers contain the actual service logic, mapping to HTTP verbs:

| HTTP Method | Operation | Database Action |
|-------------|-----------|-----------------|
| GET | Read | SELECT |
| POST | Create | INSERT |
| PUT | Update | UPDATE |
| DELETE | Remove | DELETE/UPDATE |

```sql
BEGIN
  ORDS.DEFINE_HANDLER(
    p_module_name    => 'v1',
    p_pattern        => 'customer',
    p_method         => 'GET',
    p_source_type    => 'json/collection',
    p_source         => 'SELECT customer_id, name, email FROM customers'
  );
  COMMIT;
END;
/
```

Multiple handlers can exist for the same template, one for each HTTP method:

```sql
-- GET handler for reading
ORDS.DEFINE_HANDLER(
  p_module_name => 'v1',
  p_pattern     => 'customer/:id',
  p_method      => 'GET',
  p_source_type => 'json/item',
  p_source      => 'SELECT * FROM customers WHERE customer_id = :id'
);

-- PUT handler for updating
ORDS.DEFINE_HANDLER(
  p_module_name => 'v1',
  p_pattern     => 'customer/:id',
  p_method      => 'PUT',
  p_source_type => 'plsql/block',
  p_source      => 'BEGIN update_customer(:id, :name, :email); END;'
);

-- DELETE handler for removing
ORDS.DEFINE_HANDLER(
  p_module_name => 'v1',
  p_pattern     => 'customer/:id',
  p_method      => 'DELETE',
  p_source_type => 'plsql/block',
  p_source      => 'BEGIN delete_customer(:id); END;'
);
```

## Putting It All Together

The complete URL structure follows this pattern:

```
https://server/ords/{schema-alias}/{module}/{template}
```

For example:
- `https://api.example.com/ords/ebs/v2/customer` - List all customers
- `https://api.example.com/ords/ebs/v2/customer/123` - Get customer 123
- `https://api.example.com/ords/ebs/v2/order` - List all orders

## Conclusion

Understanding the four-level ORDS structure - schema, module, template, handler - is fundamental to building well-organized REST APIs. Use schemas for isolation, modules for versioning, templates for resources, and handlers for operations.

---

Jon Dixon, Co-Founder JMJ Cloud
