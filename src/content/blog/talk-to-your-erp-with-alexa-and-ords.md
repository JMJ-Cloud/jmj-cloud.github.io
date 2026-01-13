---
title: "Talk to Your ERP with Alexa and ORDS"
date: 2017-09-28
author: "Jon Dixon"
tags: ["ORDS", "Alexa", "Voice", "AI", "Oracle", "EBS", "Integration"]
summary: "This post explores how ORDS can be leveraged for artificial intelligence applications, specifically building Alexa skills based on ERP data such as Oracle e-Business Suite and ERP Cloud."
---

Oracle REST Data Services (ORDS) is a no-cost Oracle Database option enabling secure exposure of database data via REST web services. Available both on-premise and in cloud offerings like Exadata Express and Database Schema Service, ORDS has been used for years to integrate on-premise and cloud-based ERP systems.

This post explores how ORDS can be leveraged for artificial intelligence applications, specifically building Alexa skills based on ERP data such as Oracle e-Business Suite and ERP Cloud.

![Alexa and ORDS](/images/blog/alexa-ords-erp/alexa-ords-erp-min.png)

## An Alexa Interaction

Understanding the interaction flow is key to building effective Alexa skills:

1. The Alexa device listens for wake words ("Alexa", "Echo", or "Computer")
2. Speech is passed to Alexa Voice Service in the cloud
3. Amazon converts speech to text and identifies the skill by invocation name
4. A structured JSON request is sent to your ORDS REST endpoint
5. Your ORDS handler performs PL/SQL logic and returns a JSON response
6. Amazon converts the response to speech for the user

![Alexa Flow](/images/blog/alexa-ords-erp/alexa-flow_orig.png)

All of this processing occurs within approximately one second.

## Anatomy of an Alexa Skill

Building an Alexa skill requires several components:

### Invocation Name

The phrase that identifies your skill. For example, "EBS" would be invoked with "Alexa, ask EBS..."

### Intent Schema

A set of intents representing user actions. Each intent maps to a specific function in your application:

```json
{
  "intents": [
    {
      "intent": "getDatabaseSessions",
      "slots": [
        {
          "name": "sessionStatus",
          "type": "SESSION_STATUS"
        }
      ]
    },
    {
      "intent": "getFinancialSummary"
    }
  ]
}
```

### Custom Slots

Variables injected into intents. These are like parameters that capture specific values from the user's speech:

```json
{
  "types": [
    {
      "name": "SESSION_STATUS",
      "values": ["active", "inactive", "all"]
    }
  ]
}
```

### Utterances

Phrases users speak to execute intents. Provide variations for natural language recognition:

```
getDatabaseSessions how many {sessionStatus} sessions are there
getDatabaseSessions tell me about {sessionStatus} sessions
getDatabaseSessions count the {sessionStatus} database sessions
getFinancialSummary give me a financial summary
getFinancialSummary what are today's financials
```

![Alexa Configuration](/images/blog/alexa-ords-erp/alexa-config_orig.png)

## Other Considerations

### Testing

Amazon provides several testing options:

- **Online simulator**: Test voice interactions in the browser
- **Device testing**: Use your own Echo device during development
- **Developer account sharing**: Share with team members for internal testing
- **Beta testing**: Distribute to up to 2,000 users before publication

### Security

Two key security considerations:

1. **Skill ID verification**: Verify the unique Skill ID in JSON payloads to ensure requests come from your skill
2. **Account Linking**: Use OAuth authentication to connect Alexa users to their ERP identities

![Security Configuration](/images/blog/alexa-ords-erp/alexa-security_orig.png)

### Publishing

You have two options:

- **Submit for certification**: Make your skill publicly available in the Alexa Skills store
- **Beta testing mode**: Maintain the skill for corporate users without public publication

### SSL Requirements

ORDS endpoints must have valid SSL certificates:

- Self-signed certificates work during development
- Trusted authority certificates are required for beta testing and production
- Let's Encrypt provides free SSL certificates compatible with AWS

## It's Time to Talk ORDS

Amazon requires a POST service to receive the JSON payload. Your ORDS implementation needs:

### Module and Template

Create an ORDS module with a template for the Alexa endpoint:

```sql
BEGIN
  ORDS.define_module(
    p_module_name    => 'alexa',
    p_base_path      => '/alexa/',
    p_items_per_page => 0
  );

  ORDS.define_template(
    p_module_name    => 'alexa',
    p_pattern        => 'skill'
  );
END;
```

### POST Handler

The handler must:

1. Parse the JSON payload from Amazon
2. Verify the caller using the application ID
3. Determine intent and custom slot values
4. Execute PL/SQL logic fulfilling the user's intent
5. Build JSON response for Amazon

```sql
DECLARE
  l_json_body    CLOB := :body;
  l_intent       VARCHAR2(100);
  l_response     VARCHAR2(4000);
BEGIN
  -- Parse incoming JSON
  apex_json.parse(l_json_body);

  -- Verify application ID
  IF apex_json.get_varchar2('session.application.applicationId') != 'amzn1.ask.skill.xxx' THEN
    -- Return error
    RETURN;
  END IF;

  -- Get the intent name
  l_intent := apex_json.get_varchar2('request.intent.name');

  -- Process based on intent
  CASE l_intent
    WHEN 'getFinancialSummary' THEN
      -- Query financial data and build response
      l_response := get_financial_summary();
    WHEN 'getDatabaseSessions' THEN
      l_response := get_session_count(
        apex_json.get_varchar2('request.intent.slots.sessionStatus.value')
      );
  END CASE;

  -- Return Alexa-formatted response
  apex_json.open_object;
  apex_json.write('version', '1.0');
  apex_json.open_object('response');
  apex_json.open_object('outputSpeech');
  apex_json.write('type', 'PlainText');
  apex_json.write('text', l_response);
  apex_json.close_all;
END;
```

## Voice Enable Your ERP

JMJ Cloud brings together AI and voice services with ERP systems. With Oracle EBS and an Oracle database already in place, organizations have the infrastructure to host REST services for Alexa Skills.

### Example Use Case

"Alexa, ask EBS for my daily financial briefing" could provide:

- Total revenue for yesterday
- Current cash on hand
- Current open receivables

The data already exists in your ERP - ORDS and Alexa make it accessible through natural voice commands.

## Don't Stop There

Using the APEX_WEB_SERVICE API, developers can call REST and SOAP web services, accessing any data exposed through web services. This enables consolidated briefings from multiple sources.

### Example: Corporate Briefing

"Alexa, ask HQ for my daily corporate briefing" could consolidate:

- Current headcount from ERP Cloud HR
- Open quotes from Salesforce
- Accident reports from internal safety systems
- Trade deficit data from data.gov
- Social media mentions from Twitter API

Your ORDS handler orchestrates calls to multiple services and delivers a unified voice response.

## Conclusion

The technology is available and functional today. Organizations running Oracle databases—whether on-premise or cloud—can implement voice-enabled ERP access at no additional licensing cost using APEX and ORDS.

The combination of Alexa's natural language processing, Amazon's voice infrastructure, and ORDS' database connectivity opens new possibilities for how users interact with enterprise data.

---

Jon Dixon, Co-Founder JMJ Cloud
