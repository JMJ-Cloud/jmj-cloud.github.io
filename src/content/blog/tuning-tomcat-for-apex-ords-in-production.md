---
title: "Tuning Tomcat for APEX/ORDS in Production"
date: 2017-01-15
author: "Jon Dixon"
tags: ["APEX", "ORDS", "Tomcat", "Performance", "Production"]
summary: "This post addresses configuring Apache Tomcat for production use with Oracle APEX and ORDS. Out of the box, Tomcat comes configured for use in a development environment with several limitations."
---

This post addresses configuring Apache Tomcat for production use with Oracle APEX and ORDS. Out of the box, Tomcat comes configured for use in a development environment with several limitations including development mode overhead, single-CPU utilization, limited RAM allocation (512MB default), verbose logging, and file upload timeout risks.

![Tuning Tomcat for APEX/ORDS](/images/blog/tuning-tomcat-apex-ords/tuning-tomcat-ords-apex-min.png)

## Scenario

For this post, I'm assuming a production system with the following characteristics:

- 250 total users
- 50 peak concurrent sessions
- 20 normal concurrent users
- Dedicated 4GB RAM server with one quad-core CPU
- Running Tomcat 8.5.6

## Key Configuration Areas

### Logging

Change FINE and INFO levels to SEVERE in `$CATALINA_HOME/conf/logging.properties` to reduce logging overhead. Excessive logging in production can significantly impact performance.

```properties
# Example logging.properties changes
.level = SEVERE
java.util.logging.ConsoleHandler.level = SEVERE
org.apache.catalina.core.ContainerBase.[Catalina].[localhost].level = SEVERE
```

### JVM Memory

Create `$CATALINA_HOME/bin/setenv.sh` with heap settings:

```bash
#!/bin/bash
export JAVA_OPTS="-Xms1536m -Xmx1536m -server"
```

Key settings:

- **-Xms1536m**: Initial heap size (set equal to max for consistent memory allocation)
- **-Xmx1536m**: Maximum heap size
- **-server**: Production mode flag for JVM optimizations

Note: PermSize/MaxPermSize settings are only applicable for Java 7. Java 8 and later use Metaspace instead.

### Tomcat Connector Settings

Configure the following settings in `server.xml`:

```xml
<Connector port="8080" protocol="HTTP/1.1"
           acceptorThreadCount="2"
           maxThreads="200"
           minSpareThreads="10"
           connectionTimeout="30000"
           connectionUploadTimeout="300000"
           disableUploadTimeout="false"
           redirectPort="8443" />
```

#### Setting Explanations

- **acceptorThreadCount**: Number of threads accepting connections. Increase for multi-core systems. Set to 2 for a quad-core CPU.

- **maxThreads**: Maximum simultaneous requests (default 200). This determines how many concurrent requests your server can handle.

- **minSpareThreads**: Threads kept running when idle (default 10). These are ready to handle incoming requests immediately.

- **connectionTimeout**: Time in milliseconds to wait for a request (default 30000ms / 30 seconds).

- **connectionUploadTimeout**: Time in milliseconds for file uploads (default 300000ms / 5 minutes). Essential for large file uploads.

- **disableUploadTimeout**: Set to false to enable the upload timeout setting above.

## Important Notes

These settings represent guidelines and starting points. Every environment is different, and you should:

1. Load test your specific configuration
2. Monitor performance metrics
3. Adjust settings based on observed behavior
4. Consider your specific infrastructure and user patterns

What works for one deployment may not be optimal for another. The key is to understand what each setting does and tune accordingly.

## Conclusion

Proper Tomcat configuration for APEX/ORDS production environments can significantly improve performance and stability. The default development settings are not suitable for production workloads, and taking time to tune these parameters will benefit your users and reduce operational issues.

---

Jon Dixon, Co-Founder JMJ Cloud
