---
title: "APEX 20.2 - First Look at REST Data Source Synchronization"
date: 2020-10-11
author: "Jon Dixon"
tags: ["APEX", "REST", "Data Synchronization", "Oracle", "APEX 20.2"]
summary: "A first look at the new REST Data Source Synchronization feature in Oracle APEX 20.2, which allows you to cache REST API data locally for improved performance and offline access."
---

## Introduction

Oracle APEX 20.2 introduced a powerful new feature called REST Data Source Synchronization. This feature allows you to synchronize data from REST data sources to local Oracle tables, providing significant performance improvements and enabling scenarios where REST APIs might be temporarily unavailable.

## Why REST Data Source Synchronization?

When working with REST APIs, you often face challenges like:

- **Performance**: Repeated REST API calls can be slow, especially for large datasets
- **Rate Limiting**: Many APIs impose limits on the number of requests
- **Availability**: REST endpoints may experience downtime
- **Cost**: Some APIs charge per request

REST Data Source Synchronization addresses these challenges by caching the REST data locally in your Oracle database.

## How It Works

The synchronization process involves:

1. **Define a REST Data Source** - Configure the REST endpoint, authentication, and response mapping
2. **Enable Synchronization** - Turn on the sync feature and configure the schedule
3. **Create Local Table** - APEX automatically creates a local table to store the data
4. **Run Synchronization** - Data is fetched from the REST API and stored locally

Once synchronized, your APEX components can query the local table instead of making live REST calls.

## Configuration Options

APEX 20.2 provides several synchronization options:

- **Full Sync**: Replace all local data with fresh data from the API
- **Incremental Sync**: Only fetch new or changed records
- **Scheduled Sync**: Automatically sync on a defined schedule
- **Manual Sync**: Trigger synchronization on demand

## Benefits

- **Faster Page Loads**: Local database queries are faster than REST API calls
- **Reduced API Calls**: Minimize requests to external services
- **Offline Capability**: Applications continue working when APIs are unavailable
- **Better User Experience**: Consistent performance regardless of external factors

## Conclusion

REST Data Source Synchronization in APEX 20.2 is a game-changer for applications that rely heavily on external REST APIs. By caching data locally, you get the best of both worlds: the flexibility of REST APIs with the performance of local database queries.

## Author

Jon Dixon, Co-Founder JMJ Cloud
