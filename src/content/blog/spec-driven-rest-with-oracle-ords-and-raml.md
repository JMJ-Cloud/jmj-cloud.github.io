---
title: "Spec Driven REST with Oracle ORDS and RAML"
date: 2016-12-23
author: "Jon Dixon"
tags: ["ORDS", "REST", "RAML", "API Design", "Documentation"]
summary: "Standard REST endpoints can utilize established documentation tools rather than Word or Excel. This post introduces spec-driven development using RAML with Oracle ORDS."
---

Standard REST endpoints can utilize established documentation tools rather than Word or Excel. This post introduces spec-driven development using REST standards like RAML with Oracle ORDS.

![RAML](/images/blog/ords-raml/raml.png)

## The Problem with Traditional Approaches

Traditional design documents led to misalignments between service builders and consumers. Specifications in Word documents or spreadsheets often became outdated, incomplete, or ambiguous.

Spec-driven approaches enable iteration before coding begins. Tools can auto-generate mock endpoints from specifications, allowing real testing without implementation.

## REST API Standards Compared

Three prominent standards exist for REST API specification:

### Swagger (OpenAPI)

![Swagger](/images/blog/ords-raml/swagger.jpeg)

- Wide adoption
- Strong tooling ecosystem
- Oracle is using Swagger based on their API catalog
- JSON or YAML format

### RAML (RESTful API Modeling Language)

![RAML](/images/blog/ords-raml/raml.png)

- Clean, readable syntax
- Strong reusability features
- Backed by MuleSoft
- YAML-based

### API Blueprint

![API Blueprint](/images/blog/ords-raml/api-blueprint.jpeg)

- Markdown-based
- Focus on documentation
- Simple syntax
- Good for getting started

## Why I Chose RAML

After reading "Undisturbed REST" by Michael Stowe, I was drawn to RAML for several reasons:

- **Easy to understand markup** - YAML syntax is clean and readable
- **Generates clean documentation** - Auto-generated docs look professional
- **Auto-generates mock endpoints** - Test APIs before implementation
- **Reusability** - Traits and data types reduce duplication

## RAML Benefits in Detail

### Traits

Define common patterns once and reuse them:

```yaml
traits:
  paginated:
    queryParameters:
      offset:
        description: Number of items to skip
        type: integer
        default: 0
      limit:
        description: Maximum items to return
        type: integer
        default: 25
```

### Data Types

Define schemas once, use everywhere:

```yaml
types:
  Customer:
    properties:
      id: integer
      name: string
      email: string
      created: datetime
```

### Resource Types

Create templates for common resource patterns:

```yaml
resourceTypes:
  collection:
    get:
      description: Get all <<resourcePathName>>
      responses:
        200:
          body:
            application/json:
              type: <<item>>[]
```

## Tools and Resources

### Design Tools

**MuleSoft Anypoint Platform**

![Anypoint Designer](/images/blog/ords-raml/anypoint-designer.png)

![Anypoint Designer 2](/images/blog/ords-raml/anypoint-designer-2.png)

A cloud-based API design platform with RAML editor, mocking service, and developer portal generation.

**API Workbench (Atom Package)**

![Atom Workbench](/images/blog/ords-raml/atom-workbench.png)

A free Atom package for local RAML development with syntax highlighting and validation.

### Developer Portal Generation

![Developer Portal](/images/blog/ords-raml/developer-portal.png)

![Portal Docs](/images/blog/ords-raml/portal-docs.png)

![Portal Docs 2](/images/blog/ords-raml/portal-docs-2.png)

RAML tools can generate interactive documentation where developers can try APIs directly.

### Learning Resources

- **RAML 100 & 200 Tutorials** - Official getting started guides
- **Undisturbed REST Workshop** - 10-part video series by Michael Stowe
- **GitHub RAML APIs Repository** - Example RAML specifications

## Applying RAML to ORDS

While ORDS doesn't natively consume RAML, the spec-driven approach still provides value:

1. **Design first** - Create RAML specification
2. **Generate documentation** - Share with consumers early
3. **Mock endpoints** - Allow consumer testing
4. **Implement in ORDS** - Build handlers matching the spec
5. **Validate** - Ensure implementation matches specification

## Conclusion

Spec-driven development with RAML brings discipline to REST API design. Whether you choose RAML, Swagger, or API Blueprint, the key is designing and documenting APIs before implementation.

---

Jon Dixon, Co-Founder JMJ Cloud
