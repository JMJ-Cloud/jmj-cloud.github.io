---
title: "Enterprise New Product Introduction Tracking System"
status: "Active"
year: 2024-2026
summary: "Comprehensive Oracle APEX application streamlining new product development workflows from concept through launch, managing cross-functional teams across R&D, regulatory, marketing, and manufacturing departments."
technologies:
  - "Oracle APEX"
  - "PL/SQL"
  - "Oracle E-Business Suite"
  - "Interactive Grids"
  - "RESTful APIs"
  - "JavaScript"
  - "Dynamic Actions"
  - "Edition-Based Redefinition"
industry: "Manufacturing (Cosmetics/CPG)"
metrics:
  - "54+ feature releases delivered across 25 sprints"
  - "Multiple project types supported (NPI, BOM Changes, Homologation)"
  - "Cross-functional workspace management for 7+ departments"
  - "Automated timeline generation with 100+ action item templates"
  - "Real-time sales order impact analysis for BOM changes"
featured: true
order: 1
---

## Project Overview

A leading cosmetics manufacturer faced significant operational challenges managing their new product introduction (NPI) process across multiple departments, locations, and regulatory requirements. Their existing manual processes for tracking product development—from initial concept through manufacturing launch—created bottlenecks, communication gaps, and compliance risks. Cross-functional teams struggled to coordinate activities, track dependencies, and maintain visibility into project status across R&D, regulatory affairs, marketing, purchasing, and manufacturing.

JMJ Cloud designed and implemented a comprehensive Oracle APEX application that serves as the centralized system of record for new product development. The solution orchestrates complex workflows involving formula development, regulatory compliance, packaging design, supplier qualification, and manufacturing readiness—all integrated with the client's Oracle E-Business Suite environment. The application manages multiple project types including new product introductions, bill of materials changes, and raw material homologation processes.

The system has become mission-critical for the client's product development operations, supporting continuous enhancement through an agile delivery model with 25+ sprints delivering 54+ major feature releases. The platform enables teams to collaborate effectively across global manufacturing sites in the US, Poland, and Dominican Republic, while maintaining compliance with regional regulatory requirements and managing customer-specific formulation needs.

## Business Challenge

The client's product development process suffered from systemic issues that impacted time-to-market and operational efficiency:

**Fragmented Project Visibility:** Product development projects involved 7+ cross-functional departments with no unified view of project status, dependencies, or timelines. Teams relied on email, spreadsheets, and tribal knowledge to coordinate activities, leading to missed deadlines and duplicated efforts.

**Manual Timeline Management:** Project managers manually tracked 100+ potential action items per project across formula development, regulatory submissions, packaging design, and manufacturing setup. Dependencies between activities were difficult to manage, and changes to project scope required time-consuming manual updates across multiple tracking systems.

**Complex Multi-Location Coordination:** Projects involving different manufacturing sites (US, Poland, Dominican Republic), packaging configurations (CSC/DB primary/secondary), and R&D requirements followed different workflows. The existing process couldn't adapt to these variations without manual intervention.

**Regulatory Compliance Risk:** Tracking regulatory submissions, formula approvals, and documentation requirements across different product types and markets was error-prone. Missing or delayed regulatory approvals could halt entire projects with significant financial impact.

**Bill of Materials Change Impact:** When formulas or packaging components changed, teams struggled to identify all affected sales orders and communicate impacts to customers. This lack of visibility created customer service issues and potential supply chain disruptions.

**Raw Material Sourcing Complexity:** The homologation process for qualifying new raw material sources or suppliers involved multiple departments and required tracking action items, ASL updates, and formula testing results. Without structured workflows, these processes extended procurement lead times.

## Solution Architecture

JMJ Cloud developed a sophisticated Oracle APEX application architecture that provides comprehensive project management capabilities while integrating seamlessly with the client's Oracle E-Business Suite environment.

### Core Project Management Framework

The application's foundation is a flexible project framework supporting multiple project types—New Product Introduction (NPI), BOM Changes, Marketing Initiatives, and Homologation—each with customized workflows and data requirements. Projects are identified by unique PDR (Product Development Request) or BC (BOM Change) numbers and maintain complete audit trails from creation through completion. The system implements intelligent timeline generation that creates action item sequences based on project characteristics: product type, manufacturing location, packaging configuration, R&D requirements, and customer specifications. Rules engine evaluates 100+ conditional logic statements to build appropriate timelines automatically.

### Workspace-Based Collaboration

The solution implements seven specialized workspace types—Task Management, Regulatory Affairs, Marketing, R&D, Raw Materials, Homologation, and General—each providing department-specific functionality while maintaining data consistency with the parent project. Workspaces support role-based authorization ensuring teams see only relevant information, attachment management with folder structures for organizing documentation, status tracking with configurable workflows, and email notifications for status changes and assignments. Interactive grids enable rapid data entry and updates with inline editing, drag-and-drop reordering, and Excel-like functionality that users find intuitive.

### Formula and Bill of Materials Management

The application provides comprehensive formula tracking capabilities integrated with the client's Oracle E-Business Suite item master. The Approved Formula grid manages multiple formula variations per project with working shade names, finish specifications, coverage levels, and fragrance profiles. Formula tracker maintains development history through R&D cycles, tracks testing results and regulatory approvals, and links to raw material specifications. The Affected Items functionality for BOM changes identifies all active sales orders impacted by formula or component changes, calculates revenue at risk from potential disruptions, and provides bulk include/exclude capabilities for managing change scope.

### Timeline and Action Item Engine

A sophisticated rules-based timeline engine generates project-specific action item sequences with duration calculations based on project characteristics, predecessor/successor relationships enforcing logical dependencies, and conditional milestone placement adapting to different scenarios. Action items include rich metadata: responsible departments and individuals, planned vs. actual dates for schedule tracking, resolution tracking for audit compliance, and notes and attachment capabilities for documentation. The system supports mass updates for projects requiring timeline adjustments, API-based closures enabling integration with external systems, and cascade logic automatically opening successor items when predecessors complete.

### Sales Order Integration

For BOM change projects, the system provides real-time integration with Oracle EBS Order Management showing all open sales orders containing affected items, displaying request, schedule, and promise ship dates, calculating total revenue and quantity at risk, and enabling drill-down to full order details. Project managers can include or exclude specific orders from the change scope, track customer communication requirements, and monitor manufacturing schedule impacts.

## Technical Highlights

**Complex Timeline Generation Logic:** The rules engine evaluates multiple project attributes simultaneously—including primary/secondary packaging types, assembly locations, R&D requirements, and customer specifications—to generate appropriate action item sequences. For example, projects with CSC primary packaging and specific international assembly locations receive extended 80-day ship durations, while those requiring R&D work trigger additional formula testing milestones with different predecessor relationships. This conditional logic required careful PL/SQL package design to maintain performance while handling dozens of rule variations.

**Role-Based Authorization Architecture:** The application implements granular authorization controls through custom APEX authorization schemes and PL/SQL functions. Users hold combinations of roles (PTRK_USER, PTRK_PM, PTRK_APPROVER_EU, PTRK_TK_COORD, PTRK_PUR) determining what actions they can perform. Department-based filtering ensures task coordinators only see workspaces for their assigned departments. Status transitions enforce approval workflows—for example, only EU approvers can set certain statuses for projects in business unit 301. This authorization framework required extensive session state management and dynamic SQL generation to maintain security without impacting performance.

**Interactive Grid Performance Optimization:** Several features use Oracle APEX Interactive Grids displaying hundreds of records with complex calculations and lookups. The Formula Tracker, Affected Items, and Action Items grids required careful tuning to maintain responsiveness. We implemented pagination with 1000 records per page, optimized underlying view queries with appropriate indexing, used APEX 24.1 performance features including lazy loading, and designed efficient edit processing to handle bulk updates. For the Affected SO grid showing sales orders impacted by BOM changes, we implemented duplicate prevention logic and incremental refresh capabilities to avoid full reloads on every project change.

**EBS Integration Architecture:** The application integrates with Oracle E-Business Suite through database views providing access to Items (formulas, raw materials, packaging), Customers and ship-to locations, Sales Orders with line details and dates, Suppliers and approved supplier lists, and Business Unit hierarchies. We designed these integration points carefully to respect EBS Multi-Org architecture, handle data volume through appropriate filtering, and maintain performance through strategic denormalization where needed. Custom PL/SQL packages handle complex business logic like calculating raw material requirements from formula specifications and launch quantities.

**API Development for External Integration:** To support integration with other manufacturing systems, we developed RESTful APIs using PL/SQL packages. The close_action_item API accepts PDR number, action item code, and resolution text, validates authority to close the item, updates timestamps and completion status, and automatically opens successor action items while respecting already-closed dependencies. This API enables automated workflows where external systems can signal completion of manufacturing setup tasks, quality inspections, or equipment validations without manual APEX interaction.

**Session State and Duplicate Prevention:** Addressing production issues with duplicate record creation, we implemented comprehensive button protection using APEX's built-in debounce functionality and JavaScript disable-on-click patterns. For critical operations like action item creation and project updates, we added server-side duplicate detection in PL/SQL using timestamp validation and unique constraint checking. This eliminated ORA-00060 deadlock issues that occurred when users double-clicked buttons during high-concurrency periods.

**Homologation Workflow Automation:** The raw material homologation process required sophisticated workflow logic with conditional section visibility based on project attributes (existing materials having OTC formulas trigger change control requirements), action item grids prepopulated based on homologation type, ASL and sourcing rules grid enforcing allocation percentage validations, and automatic completion tracking setting "Completed By" and "Completed Date" fields when users mark items complete. The system generates different action item sets based on whether the homologation involves new suppliers, formula changes, or both.

**Advanced Reporting and Dashboards:** The application provides executive dashboards with drill-down capabilities showing projects by status, type, and business unit, open action items grouped by department and priority, past-due activities with responsibility assignment, and workspace completion metrics for performance tracking. Interactive reports use APEX Interactive Reports with saved filter configurations, chart regions showing trends over time, and export capabilities supporting Excel and PDF formats. The dashboard automatically applies security filtering ensuring users see only projects and workspaces they're authorized to access.

## Results & Impact

**Development Velocity:** Delivered 54+ major features across 25 agile sprints over 18 months, maintaining continuous enhancement capability while supporting production operations. The agile delivery model enabled rapid response to changing business requirements as the client's product development processes evolved.

**Process Standardization:** Established consistent workflows for seven different workspace types across global operations, ensuring regulatory compliance and quality standards are met regardless of project location or team composition. The system now serves as the authoritative source for product development methodology.

**Timeline Automation:** Eliminated manual timeline creation and maintenance for 100+ action items per project. The rules-based timeline engine adapts automatically to project characteristics, reducing project setup time from hours to minutes while ensuring logical dependencies are correctly enforced.

**Cross-Functional Collaboration:** Enabled seamless coordination between R&D, regulatory, marketing, purchasing, and manufacturing teams with shared visibility into project status, dependencies, and deliverables. Email notifications and workspace-based updates keep teams informed without requiring constant system checking.

**BOM Change Impact Analysis:** Provided real-time visibility into sales orders affected by formula or component changes, enabling proactive customer communication and minimizing supply chain disruptions. Project managers can now quantify revenue at risk and make informed decisions about change timing and scope.

**Regulatory Compliance:** Structured workflows ensure all required regulatory submissions, formula approvals, and documentation are completed before manufacturing launch. Audit trails track who approved what and when, supporting regulatory inspections and compliance reviews.

**Technical Architecture Success:** The solution's integration with Oracle E-Business Suite provides single-source-of-truth for item, customer, and order data while maintaining APEX's rapid development advantages. The flexible workspace framework accommodates diverse business processes without requiring separate applications.

**Scalability and Performance:** The system handles hundreds of concurrent users across global time zones with sub-second response times for common operations. Interactive grids manage thousands of records with smooth scrolling and editing, while background processes handle complex calculations without impacting user experience.

## Deliverables

- **Complete Oracle APEX Application:** Full-featured NPI tracking system with 200+ pages covering all aspects of product development workflow
- **Seven Specialized Workspace Types:** Task Management, Regulatory Affairs, Marketing, R&D, Raw Materials, Homologation, and General workspaces each optimized for department-specific processes
- **Rules-Based Timeline Engine:** Automated action item generation with 100+ conditional rules adapting to project characteristics
- **EBS Integration Framework:** Database views and PL/SQL packages providing seamless access to Items, Customers, Sales Orders, and Suppliers from Oracle E-Business Suite
- **Role-Based Security Model:** Comprehensive authorization schemes controlling access to projects, workspaces, and sensitive operations based on user roles and department assignments
- **RESTful API Layer:** PL/SQL packages exposing key operations for integration with external manufacturing and quality systems
- **Executive Dashboards:** Real-time visibility into project portfolio health, resource utilization, and key performance metrics
- **Comprehensive Documentation:** Technical specifications, user guides, and operational procedures supporting ongoing maintenance and enhancement

## Why This Matters

This project demonstrates JMJ Cloud's ability to deliver enterprise-scale Oracle APEX solutions that transform complex business processes while integrating deeply with Oracle E-Business Suite. The success of this implementation showcases several critical capabilities that set us apart:

**Deep Manufacturing Domain Knowledge:** New product introduction in regulated industries like cosmetics requires understanding formula management, regulatory compliance, supplier qualification, and multi-site manufacturing coordination. We designed a solution that reflects real-world product development workflows, not generic project management patterns. The workspace-based architecture adapts to how different departments actually work rather than forcing artificial process standardization.

**Sophisticated APEX Architecture:** This isn't a simple CRUD application—it's a complex workflow orchestration system managing hundreds of rules, supporting multiple project types with different requirements, and providing intuitive interfaces for users with varying technical skills. The interactive grid implementations push APEX's capabilities while maintaining enterprise-grade performance. Our authorization framework demonstrates how to implement granular security controls without resorting to custom user tables.

**Agile Delivery at Scale:** Delivering 54+ features across 25 sprints while maintaining production stability requires rigorous development discipline, comprehensive testing practices, and effective stakeholder communication. We maintained continuous delivery velocity by using Edition-Based Redefinition for zero-downtime deployments, implementing automated testing for critical workflows, and establishing clear sprint planning and review ceremonies that kept business users engaged.

**EBS Integration Expertise:** The solution leverages EBS as the authoritative source for master data while providing APEX's superior user experience for transaction processing. This hybrid architecture—EBS for data integrity and APEX for usability—offers a powerful alternative to expensive middleware or complete EBS replacements. Our integration patterns respect EBS Multi-Org architecture, handle high-volume data access efficiently, and maintain referential integrity across systems.

**API-First Design Thinking:** Building RESTful APIs alongside the user interface enables future integration scenarios—mobile apps, external system workflows, or analytics platforms—without requiring architectural changes. The close_action_item API demonstrates how thoughtful API design can support automation while maintaining business rule enforcement and audit compliance.

For organizations with complex product development processes supported by Oracle E-Business Suite, this case study illustrates how Oracle APEX can deliver transformative business value rapidly and cost-effectively. The combination of APEX's development productivity, EBS's enterprise capabilities, and JMJ Cloud's deep expertise in both platforms provides a proven path to modernizing critical business processes without the risk and expense of wholesale system replacement.
