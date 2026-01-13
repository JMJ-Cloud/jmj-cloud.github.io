---
title: "Tomcat Vs GlassFish (Which is faster for APEX and ORDS)"
date: 2016-11-03
author: "Jon Dixon"
tags: ["APEX", "ORDS", "Tomcat", "GlassFish", "Performance"]
summary: "Running ORDS in standalone mode is not supported for production. This post compares Tomcat and GlassFish performance for APEX and ORDS workloads."
---

Running ORDS in standalone mode is not supported for production environments. This means you need to run ORDS in a J2EE Web Server. At time of writing, the three supported J2EE web servers are Weblogic, Tomcat and GlassFish. Of these, only Tomcat and GlassFish are Open Source (read free).

![Tomcat](/images/blog/tomcat-vs-glassfish/tomcat.jpeg) ![GlassFish](/images/blog/tomcat-vs-glassfish/glassfish.jpeg)

## Background

Oracle's view on support is that it supports running ORDS on these web servers but does not support the web servers themselves. This means that if you have issues with ORDS on these servers you will have to prove ORDS is causing the issue and not the web server.

Having said that, both Tomcat and GlassFish are capable web servers and I have a number of customers that have been running ORDS on them in production for many years, without any issues. When choosing between these web servers, I typically recommend GlassFish unless the client has a preference for Tomcat. This is based on my personal preference and ease of use as opposed to empirical evidence. I decided it was time to run a performance test to see if one performed significantly better than the other.

## Tests Performed

The goal of the speed comparison is to compare the two web servers under moderate loads. The tests are not overly complex or load intensive. The load will be generated from number of simultaneous 'users' and repetitions.

### Test 1: APEX Page Render

![APEX Page](/images/blog/tomcat-vs-glassfish/apex-page.png)

A basic APEX public page with three regions: a classic report, a region with 5 form fields, and a static text region. This test is aimed squarely at how the web server handles APEX page requests.

```bash
siege -c 25 -r 10 -d 0.1 -m "ApexDynamicPage" -f /home/ec2-user/siege/ApexDynamicPageURL.txt
```

25 concurrent threads, repeated 10 times = 250 transactions.

### Test 2: ORDS REST Get Service

A basic GET service with the following SELECT (no OAuth security enabled):

```sql
SELECT owner, object_name
FROM all_objects
WHERE object_type = 'SEQUENCE'
AND owner = 'MDSYS'
```

Under ORDS 3.X calling a REST service does not rely on APEX at all. This test is focused purely on throughput from a REST perspective.

```bash
siege -c 25 -r 10 -d 0.1 -m "ORDSRESTGet" -f /home/ec2-user/siege/ORDSRESTGet.txt
```

### Test 3: Minified CSS File

The minified version of the APEX UI CSS 'apex_ui.min.css' (108,694 bytes) located in the APEX images folder.

```bash
siege -c 100 -r 5 -d 0 -m "ApexStaticCSS" -f /home/ec2-user/siege/ApexStaticCSSURL.txt
```

100 concurrent threads, repeated 5 times = 500 transactions.

### Test 4: Static HTML File

A small static HTML file (3,711 bytes) placed in the root of the web server. This tests raw throughput without APEX or ORDS involvement.

```bash
siege -c 100 -r 5 -d 0 -m "StaticHTML" -f /home/ec2-user/siege/StaticHTMLURL.txt
```

## Test Environment

### Servers (AWS)

- **DB Server**: t2.large (2 CPU, 8GB RAM) - OEL
- **App Server**: t2.small (1 CPU, 2GB RAM) - Amazon Linux
- **Test Server**: t2.small (1 CPU, 2GB RAM) - Amazon Linux

### Software Versions

- Database 12c (12.1.0.2.0)
- ORDS 3.0.8
- APEX 5.0.4
- JDK8 (1.8.0_111)
- GlassFish Server (Web Profile) V 4.1.1
- Tomcat 8.56

### Key Configurations

**ORDS:**
- jdbc.InitialLimit = 25
- jdbc.MinLimit = 25
- jdbc.MaxLimit = 25

**GlassFish:**
- Logging level: WARNING
- JVM Xms and Xmx = 1024MB
- JVM -server option
- Caching Off, Compression Off
- Thread Pool Size = 100
- max-connections = 100

**Tomcat:**
- Logging level: WARNING
- JVM Xms and Xmx = 1024MB
- JVM -server option
- Caching Off, Compression Off
- Thread Pool Size = 100

### Test Method

1. Start GlassFish
2. Run warmup tests (discard results)
3. Wait 1 minute
4. Run tests twice, average results
5. Stop GlassFish
6. Repeat for Tomcat

## The Results

### APEX Page Results

![APEX Results](/images/blog/tomcat-vs-glassfish/apex-results.png)

Generally Tomcat seems to be about 3% faster than GlassFish except for in the area of concurrency where the difference was only 1.45%.

### REST Service Results

![REST Results](/images/blog/tomcat-vs-glassfish/rest-results.png)

Again Tomcat is the victor, this time by a larger margin of around 7% for response time, elapsed time and transaction rate. The two are almost exactly matched for throughput (MB) and concurrency.

### Compressed CSS Results

![CSS Results](/images/blog/tomcat-vs-glassfish/css-results.png)

GlassFish fights back here with a significant win over Tomcat of between 12% and 15%. This shows that GlassFish is much better at serving larger files (the CSS file is about 100KB).

### HTML File Results

![HTML Results](/images/blog/tomcat-vs-glassfish/html-results.png)

Once again Tomcat wins by around 3% except for the area of concurrency where they are again almost exactly matched.

### Overall Results

![Overall Results](/images/blog/tomcat-vs-glassfish/overall-results.png)

## Analysis

One deduction from the above is that the two are very well matched except that Tomcat seems to be better at thread handling. It is getting through the volume of transactions and switching between them faster. But, when there is more work to do (in the case of the larger CSS file) GlassFish is performing better.

## Conclusion

So which web server should you choose? Based on the results of my testing, while Tomcat seems to be generally slightly faster, there is really not much in it.

While not having a clear winner seems like a bit of a let down (it was for me), all is not lost. It does mean that I can now provide my 'client preference' advice with some empirical evidence to back it up.

Both servers are production-ready choices for APEX and ORDS deployments.

---

Jon Dixon, Co-Founder JMJ Cloud
