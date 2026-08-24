# Greenwood Heights | Enterprise Society Maintenance & Facility Risk Operations Platform

A production-grade Facility Operations and Maintenance Management System engineered for **Unthinkable Solutions (Pune)** enterprise benchmarks. The platform provides real-time dynamic risk-scoring with mathematical exponential half-life decay, an intelligent **Operations AI Copilot**, append-only Finite State Machine (FSM) complaint audit logs, a Transactional Outbox Pattern for decoupled event-driven notifications, and a clean, high-contrast UI.

---

## 1. Architecture & Engineering Highlights

```
                                  +-----------------------------+
                                  |   React 18 + Vite (SPA)     |
                                  | Clean Enterprise UI + Sliders|
                                  +--------------+--------------+
                                                 | REST / Multipart API
                                                 v
                                  +-----------------------------+
                                  |   Express.js Application    |
                                  |  (Auth / RBAC / AI Copilot) |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                         |                         |
                       v                         v                         v
         +---------------------------+ +-------------------+ +---------------------------+
         | Complaint / Risk Service  | | AI Copilot Engine | |  Transactional Outbox     |
         | (Exp Decay & Aggregation) | | (Telemetry Query) | |  (Active Probe & Fallback)|
         +-------------+-------------+ +---------+---------+ +-------------+-------------+
                       |                         |                         |
                       v                         v                         v
         +-------------------------------------------------------------------------------+
         |                       MongoDB In-Memory / Replica-Set Engine                  |
         |                         Status FSM + Settings + Outbox Events                 |
         +-------------------------------------------------------------------------------+
```

### Key Architectural Pillars
1. **Controller-Service-Repository Pattern**: Clean decoupling of transport protocols (HTTP), domain business rules, and persistence layer logic.
2. **Operations AI Copilot**: Context-aware telemetry assistant that analyzes high-risk clusters, highlights overdue SLA escalations, and drafts resident maintenance circulars.
3. **Dynamic Risk-Scoring Engine**: MongoDB Aggregation Pipeline computing exponential half-life decay on-read without stale caches:
   $$S(t) = \text{SeverityWeight} \times e^{-0.0231 \times t}$$
4. **Finite State Machine (FSM) Lifecycle**: Strict status transition graph (`Open` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`) enforced at the Mongoose pre-save model layer with immutable audit histories.
5. **Resilient Transactional Outbox Pattern**: Runtime active probe detects replica-set ACID multi-document transaction capability with a transparent standalone fallback mechanism.
6. **Interactive Range Sliders**: Real-time adjustment of lookback windows ($15-180\text{d}$), risk thresholds ($1.0-8.0\text{ pts}$), decay half-lives ($10-60\text{d}$), and category SLAs ($1-72\text{h}$).

---

## 2. Quick Start & Unified Single Link

### Live URL
👉 **[http://localhost:3000](http://localhost:3000)** *(or [http://localhost:5000](http://localhost:5000))*

### Demo Accounts & Persona Switcher
The navigation bar contains a **1-Click Persona Switcher** allowing instant inspection across all three roles:
- **Admin**: `admin@greenwood.com` | `Password123!`
- **Staff**: `staff@greenwood.com` | `Password123!`
- **Resident**: `resident@greenwood.com` | `Password123!`

### Running Tests
```bash
cd backend
npm test
```
*(All 14 unit test specifications pass in under 2 seconds.)*
