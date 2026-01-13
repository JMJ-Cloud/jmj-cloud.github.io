---
title: "SMS Messaging from Oracle ERP with ORDS and Twilio"
date: 2018-09-06
author: "Jon Dixon"
tags: ["ORDS", "Twilio", "SMS", "Oracle", "EBS", "Integration"]
summary: "This post discusses integrating Twilio SMS messaging with Oracle e-Business Suite using ORDS to notify employees about expiring certifications, including architecture and best practices."
---

In this post, I'll discuss integrating Twilio SMS messaging with Oracle e-Business Suite using ORDS (Oracle REST Data Services) to notify employees about expiring certifications.

![SMS ORDS Logo](/images/blog/sms-twilio-ords/sms-logo-min.png)

## The Requirement

Our customer needed to alert employees via SMS when their certifications were approaching expiration dates. The solution required building generic outbound/inbound queuing to support multiple internal systems beyond just certification reminders.

## About Twilio

![Twilio Logo](/images/blog/sms-twilio-ords/twilio-logo-min.png)

"Twilio is a developer platform for communications. Software teams use Twilio APIs to add capabilities like voice, video, and messaging to their applications."

The platform powers over 40,000 businesses globally and provides a robust, well-documented API for SMS communications.

### Setup Requirements

Getting started with Twilio involves:

1. **Account signup**: Create a Twilio account at twilio.com
2. **Phone number**: Purchase an outbound phone number ($1-thousands/month depending on features)
3. **Webhooks**: Configure webhooks for handling SMS responses

## Architecture

### Outbound Flow

![SMS Architecture](/images/blog/sms-twilio-ords/sending-sms-messages-min_orig.png)

The outbound message flow works as follows:

1. HR system queues SMS messages to a database table
2. Hourly concurrent program processes the queue and calls Twilio API
3. Message status is tracked in the database
4. Errors are logged and administrators are notified via email

### Inbound Flow

![Sweep](/images/blog/sms-twilio-ords/sweep_orig.png)

When employees respond to SMS messages:

1. Twilio POSTs the response to an ORDS service
2. Responses queue in a staging table (we used Exadata Express)
3. Concurrent programs process responses and update HR records
4. Managers receive email digests of responses

## Key Considerations

### Data Cleansing

![Chat](/images/blog/sms-twilio-ords/chat.png)

Before sending SMS messages, ensure phone numbers are standardized:

- Include international dialing codes (e.g., +1 for US)
- Remove formatting characters (parentheses, dashes)
- Validate numbers are mobile, not landlines
- Handle multiple phone numbers per employee

### Conversation Threading

![Angry Emoji](/images/blog/sms-twilio-ords/angryemoji-min.png)

SMS conversations lack thread identifiers like email. When an employee replies, you need to:

- Parse the message for keywords or context
- Match the response to the original outbound message
- Handle ambiguous responses gracefully

Consider using keywords in your outbound messages that employees can include in their replies.

### Multiple Phone Numbers

Different use cases may warrant different outbound numbers:

- HR notifications from one number
- IT alerts from another
- Customer service from a third

This helps recipients understand the context before reading the message.

### Timing

![Opt Out](/images/blog/sms-twilio-ords/optouticon.jpeg)

Respect your employees' personal time:

- Avoid sending SMS during night hours
- Consider time zones for distributed workforces
- Batch non-urgent messages for business hours

### Opt-Out Compliance

Include clear opt-out instructions in your messages. Regulatory requirements vary by jurisdiction, but best practice includes:

- How to stop receiving messages
- Who to contact with questions
- Respecting opt-out requests immediately

## Conclusion

Integrating Twilio with Oracle ERP via ORDS provides a powerful notification channel. SMS has higher open rates than email and reaches employees who may not check email regularly.

Key success factors:

- Clean, standardized phone data
- Robust queuing and error handling
- Clear message threading strategy
- Compliance with timing and opt-out requirements

The combination of ORDS for API hosting and Twilio for SMS delivery provides a reliable, scalable solution for enterprise messaging needs.

---

Jon Dixon, Co-Founder JMJ Cloud
