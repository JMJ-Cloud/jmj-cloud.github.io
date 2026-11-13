---
title: "Mobile Inspection App with Bluetooth Gauges - Native iPad Rebuild on Oracle REST Services"
status: "Active"
date: 2026-10-22
year: 2026
summary: "Rebuilding a plant-floor inspection iPad app for a multi-plant metals manufacturer in SwiftUI, with live coating thickness readings from Bluetooth gauges, a Swift package wrapping the gauge vendor's SDK, and Oracle ORDS REST services behind it."
technologies:
  - "Swift"
  - "SwiftUI"
  - "Swift Concurrency"
  - "Core Bluetooth"
  - "External Accessory"
  - "Swift Package Manager"
  - "Swift Testing"
  - "XCTest"
  - "Oracle ORDS"
  - "OAuth 2.0"
  - "Firebase"
industry: "Manufacturing"
metrics:
  - "205 Swift Testing unit tests across 47 suites in the app"
  - "12 XCTest UI tests covering onboarding, the job dashboard and the gauge card"
  - "14 further tests in the gauge package, run against the vendor's real SDK"
  - "3 Bluetooth connection types across two gauge families behind one interface"
  - "No concurrency escape hatches in app or package source under strict concurrency checking"
featured: false
order: 22
---

## Project Overview

A multi-plant metals manufacturer runs an iPad app on the floor of its galvanizing plants. Inspectors use it to work the queue of jobs waiting for inspection and to take coating thickness readings with handheld Bluetooth gauges. The existing app was written in UIKit. Its replacement is a clean, modern build that keeps the Oracle REST contract behind it exactly as it is.

We are rebuilding the app from the ground up in SwiftUI, one module at a time. The work started with a proof of concept scoped to a single screen (plant selection) to test the modern stack (client certificate, OAuth 2.0 and one REST call), then moved into the full build: onboarding, the job dashboard and live gauge connectivity, with a separate Swift package wrapping the gauge vendor's SDK.

## Business Challenge

An inspector on the plant floor needs the right job in front of them and a gauge that connects without a fight. The rebuild had to deliver that while respecting several constraints:

**An Aging App Worth Replacing, Not Patching:** The existing UIKit app remains the source of truth for the API contract (endpoints, headers and JSON keys), but its structure was not worth carrying forward.

**More Than One Kind of Gauge:** Plants use industry-standard coating thickness gauges from two families. The first connects through its vendor's SDK over Bluetooth Low Energy or Bluetooth Classic. The second speaks its own Bluetooth Low Energy protocol. That makes three connection types to support.

**Many Gauges in Range:** Several gauges can be within range at a plant, and gauges of one family all advertise the same name. An inspector has to be able to tell which one is theirs.

**A Vendor SDK from Another Era:** The gauge vendor ships a native Objective-C SDK that calls back on arbitrary threads. It had to work inside an app held to strict Swift concurrency checking.

**No Backend Changes:** The new app had to call the same Oracle ORDS services, with the same client certificate and OAuth 2.0 security, as the app it replaces.

## Solution Architecture

A native iPad app with a feature-per-folder structure, plus a standalone Swift package for gauge communication.

### Onboarding and Session

The inspector picks a plant, a language and their own name from lists served by the backend. The three choices form a session that is stored on the device, so the app opens straight to the dashboard next time. Switching plant ends the session and returns to onboarding.

### Job Dashboard

The dashboard lists the plant's jobs as cards in a grid that adapts to the iPad's width. Each card shows the job number, customer, priority, piece count, promised and received dates, and the status of the two inspection activities: the QC checklist and thickness readings. Inspectors narrow the list with a quick filter, an advanced filter form, a multi-field sort and a four-digit job number search. Filter and sort choices are remembered between launches.

### Gauge Connectivity

A gauge card on the dashboard connects and disconnects a gauge, shows the latest reading in mils, counts readings received, and warns when a reading is above the plant's configured threshold. For the gauge family that needs one, the inspector enters the probe serial number once, and readings are refused until it is on file. For the family where every gauge advertises the same name, the app shows its own chooser that labels each gauge by probe model and serial number, shows signal strength and marks the nearest.

### Gauge SDK Package

A Swift package wrapping the gauge vendor's SDK presents a small Swift API: connect, disconnect, connection state and a stream of readings. The app sees none of the SDK's own types. The second gauge family is handled inside the app with Core Bluetooth, and a routing layer presents both families to the rest of the app as a single gauge.

## Technical Highlights

**Modern Swift Concurrency:**
- The app builds with complete strict concurrency checking and main-actor default isolation
- The gauge package compiles in Swift 6 language mode
- A project rule bans concurrency escape hatches, and none appear in app or package source

**Wrapping a Native SDK Cleanly:**
- The vendor's static library is packaged as a binary framework with a module map, so the app needs no bridging header and contains no Objective-C
- One bridge object converts each SDK callback into a sendable event, and the package consumes those events on the main actor, so no Objective-C object crosses an isolation boundary
- Readings arrive as an async stream, with each subscriber getting an independent subscription

**Clean Architecture in Every Feature:**
- Each feature has Domain, Data, Presentation and dependency injection layers, with dependencies pointing inward
- Filtering, sorting and search live in one pure use case with an injectable clock, so date rules are testable

**Automated Tests:**
- Swift Testing covers domain logic, data mapping, authentication, networking and view models with hand-written mocks
- XCTest UI tests use page objects, and the app swaps in stub repositories and a stub gauge when launched for UI testing
- The gauge package's tests run against the vendor's real SDK on the simulator

**Verified on Real Hardware:**
- Both gauge families were tested on a real iPad with real gauges
- That testing shaped the wrapper: it detects a cancelled gauge picker that the SDK does not report, and it survives a disconnect and reconnect to the same gauge

**Secure Oracle Integration and Observability:**
- Oracle ORDS REST services secured with a client certificate plus OAuth 2.0
- Analytics, crash reporting and performance traces through one telemetry interface, with cancelled requests filtered out of error reports

## Key Features

| Feature | Description |
|---------|-------------|
| Plant, Language and Inspector Setup | Three-step onboarding from backend lists, stored as a session on the device |
| Job Cards | Job number, customer, priority, pieces, dates, QC and readings status, tags, PO and notes |
| Quick Filter | Six views of the plant's jobs, including inspection, cleaned, shipped and all |
| Advanced Filter | Priority, QC and readings status, certification, customer, tags, PO, notes and date ranges |
| Sort and Search | Multi-field sort by job number, promise date, priority or customer, plus job number search |
| Gauge Connection | Connect, cancel and disconnect across three Bluetooth connection types |
| Gauge Chooser | Nearby gauges labelled by probe model and serial, with signal strength and a nearest marker |
| Live Readings | Latest reading in mils with a running count, flagged in red above the plant's configured limit |

## Results & Impact

This is an active build, so we describe what is in place today instead of quoting outcome figures.

**In Place Today:**
- Onboarding, session handling and the job dashboard built on the existing Oracle REST endpoints
- Live readings from both gauge families, checked against the plant's threshold
- The gauge package released as tagged semantic versions and consumed by the app through Swift Package Manager

**Still to Come:**
- Modules of the existing app are ported one at a time, and the QC checklist and saving readings against a job have not been ported yet

**Engineering Quality:**
- 205 unit tests and 12 UI tests in the app, plus 14 in the gauge package
- The same folder layout and rules in every feature, written down in the repository

## Why a Native App on Oracle REST Services?

This approach suits plant-floor inspection because it:

- **Reaches the hardware:** Bluetooth Classic accessories and vendor SDKs need native frameworks, which a native app can use directly
- **Leaves the backend alone:** The new app calls the same ORDS endpoints, with the same headers and JSON keys, as the app it replaces
- **Isolates vendor risk:** The SDK sits behind a small Swift package and a protocol, so a new SDK release or a new gauge family touches one place
- **Stays testable:** Stub repositories and a stub gauge let the whole flow run in automated tests without a plant, a gauge or a network

## Deliverables

- **Inspection App**: Native SwiftUI iPad app with onboarding, job dashboard and gauge connectivity
- **Gauge Package**: A Swift package wrapping the gauge vendor's SDK, with its own tests and versioned releases
- **Second Gauge Integration**: Core Bluetooth implementation for the second gauge family, with an in-app chooser
- **Test Suites**: Swift Testing unit tests and XCTest UI tests with page objects, stubs and per-environment test plans
- **Documentation**: Project README, architecture rules and a lessons log
