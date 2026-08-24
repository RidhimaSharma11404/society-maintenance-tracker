# Greenwood Heights · Facility Operations & Predictive Maintenance Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://society-maintenance-tracker-five-delta.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org)
[![React 18](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory%20%2F%20Replica--Set-brightgreen?style=flat&logo=mongodb)](https://mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passed-success?style=flat)]()

An enterprise-grade Facility Operations & Predictive Maintenance Platform engineered for **Greenwood Heights Co-operative Housing Society**. Built with an interactive architectural elevation digital twin, mathematical exponential half-life defect decay modeling, multi-tenant RBAC, append-only Finite State Machine (FSM) complaint lifecycle audit logs, and a Transactional Outbox Pattern for decoupled event-driven dispatch.

---

## 🌐 Live Production Application

- **Live URL**: **[https://society-maintenance-tracker-five-delta.vercel.app](https://society-maintenance-tracker-five-delta.vercel.app)**
- **Direct Login**: **[https://society-maintenance-tracker-five-delta.vercel.app/login](https://society-maintenance-tracker-five-delta.vercel.app/login)**
- **Resident Flat Registration**: **[https://society-maintenance-tracker-five-delta.vercel.app/register](https://society-maintenance-tracker-five-delta.vercel.app/register)**

---

## 🔑 1-Click Instant Demo Credentials

The platform features instant 1-click authentication cards on the login screen for testing all 3 user roles:

| Role | Name | Email | Password | Access Scope |
|---|---|---|---|---|
| **🛡️ ADMIN** | Secretary Elena Vance | `admin@greenwood.com` | `Password123!` | Full Operations Console, Architectural Elevation Map, Connected Risk Analytics, Contractor Dispatch, Outbox Event Logs |
| **🔧 STAFF** | Technician Marcus Cole | `staff@greenwood.com` | `Password123!` | Work Orders Timeline, Priority Queue, Status Progression, Maintenance Inspections |
| **🏠 RESIDENT** | Dr. Arthur Pendelton | `resident@greenwood.com` | `Password123!` | Flat 402 Maintenance Dues Ledger, 1-Click Ticket Logging, Society Bulletins & Circulars |

---

## 🏗️ System Architecture & Engineering Design

```
                                  +---------------------------------------+
                                  |   React 18 + Vite (SPA)               |
                                  |  - Living Building Elevation Map      |
                                  |  - Dynamic Risk Simulation Sliders    |
                                  |  - Multi-Tenant Persona Console       |
                                  +-------------------+-------------------+
                                                      | REST / JSON / Multipart
                                                      v
                                  +---------------------------------------+
                                  |   Express.js Application Gateway      |
                                  |  - JWT Authentication & RBAC Policy   |
                                  |  - FSM State Transition Validator     |
                                  |  - Centralized Error Handling         |
                                  +-------------------+-------------------+
                                                      |
                          +---------------------------+---------------------------+
                          |                           |                           |
                          v                           v                           v
          +-------------------------------+ +-------------------+ +-------------------------------+
          | Complaint & Risk Service      | | Telemetry Copilot | | Transactional Outbox Worker   |
          | - Exponential Decay S(t)      | | - Cluster Analysis| | - Multi-Doc ACID Transaction  |
          | - Aggregate Risk Pipeline     | | - SLA Escalations | | - Resilient Polling Dispatch  |
          +---------------+---------------+ +---------+---------+ +---------------+---------------+
                          |                           |                           |
                          v                           v                           v
          +---------------------------------------------------------------------------------------+
          |                       MongoDB In-Memory / Production Replica-Set                      |
          |           Users · Complaints · CategorySettings · Technicians · OutboxEvents          |
          +---------------------------------------------------------------------------------------+
```

---

## 🔬 Core Engineering Pillars

### 1. Living Building Elevation Digital Twin
- Interactive architectural elevation map visualizing **Tower A (Units 101–402)**, **Central Utility Core (Otis Elevator Shafts & Water Pumps)**, and **Tower B (Units 101–402)**.
- Pulse alert keyframes highlighting high-risk and critical units with real-time radial glow telemetry.

### 2. Mathematical Exponential Half-Life Defect Decay Engine
- Spots recurring equipment strain across plumbing, lifts, and electrical systems before catastrophic failure:
  $$S(t) = \text{SeverityWeight} \times e^{-\lambda \times t} \quad \text{where} \quad \lambda = \frac{\ln(2)}{t_{1/2}}$$
- Configurable lookback windows ($15\text{d} - 180\text{d}$), decay half-lives ($10\text{d} - 60\text{d}$), and risk thresholds ($1.0 - 8.0\text{ pts}$) with 1-click operational presets (*Standard*, *High Sensitivity Monsoon*, *Critical Emergencies Only*).

### 3. Strict Finite State Machine (FSM) Complaint Lifecycle
- Compliant with enterprise corporate workflows (`Open` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`).
- Rejects illegal state jumps (e.g. `Open` directly to `Closed`) and enforces an append-only, immutable audit trail for every status update.

### 4. Resilient Transactional Outbox Pattern
- Decouples user transactions from external email/SMS notifications.
- Runtime active probe detects replica-set ACID multi-document transaction capability with a transparent standalone fallback mechanism.

### 5. Resilient Zero-Config Deployment
- Automatically connects to cloud MongoDB instances or boots an embedded in-memory database engine with seed fixtures for zero-friction demonstrations.

---

## 🧪 Automated Unit Test Suite (100% Passing)

```bash
PASS tests/unit/complaintStateMachine.test.js
  Finite State Machine (FSM) Lifecycle Transition Rules
    ✓ Should define allowed transitions according to strict corporate workflow (8 ms)
    ✓ Should allow legal forward progression: Open -> In Progress -> Resolved -> Closed (3 ms)
    ✓ Should reject illegal direct jump from Open to Closed (1 ms)
    ✓ Should reject illegal transition out of terminal Closed state (1 ms)
    ✓ Should allow fallback/re-inspection transitions (In Progress -> Open, Resolved -> In Progress) (1 ms)

PASS tests/unit/authService.test.js
  Authentication & Security Utilities
    ✓ Should generate valid signed JWT with correct payload claims (7 ms)
    ✓ Should securely hash password and verify match with bcrypt (317 ms)

PASS tests/unit/riskScoring.test.js
  Mathematical Risk Scoring Engine - Exponential Decay Verification
    ✓ Should return the full base severity weight at Day 0 (t = 0) (2 ms)
    ✓ Should decay to approximately half (~50%) of severity weight after 30 days (1 ms)
    ✓ Should decay to approximately 25% of severity weight after 60 days (1 ms)
    ✓ Should decay to approximately 12.5% of severity weight after 90 days (2 ms)
    ✓ Should handle edge cases gracefully (negative daysAgo treated as 0) (2 ms)
  SLA Due Date Calculations
    ✓ Should compute accurate due timestamp based on SLA hours (1 ms)
    ✓ Should accurately add fractional or short emergency SLA hours (1 ms)

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total (100% Passing)
```

---

## 💻 Local Development Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/RidhimaSharma11404/society-maintenance-tracker.git
cd society-maintenance-tracker

# 2. Build full-stack dependencies & production bundle
npm run build

# 3. Start unified full-stack application (Runs on Port 5000)
npm start

# 4. Run automated test suite
npm test
```

---

## 📄 License
This project is licensed under the **MIT License**.
