# Greenwood Heights · Facility Operations & Predictive Maintenance Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://society-maintenance-tracker-five-delta.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org)
[![React 18](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory%20%2F%20Replica--Set-brightgreen?style=flat&logo=mongodb)](https://mongodb.com)
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passed-success?style=flat)]()

An enterprise-grade Facility Operations & Predictive Maintenance Platform engineered for **Greenwood Heights Co-operative Housing Society**. Built with an interactive architectural elevation digital twin, mathematical exponential half-life defect decay modeling, multi-tenant RBAC, append-only Finite State Machine (FSM) complaint lifecycle audit logs, and a Transactional Outbox Pattern for decoupled event-driven dispatch.

---

## 🌐 1. Live Production Application & Demo URLs

- **Live Production App**: **[https://society-maintenance-tracker-five-delta.vercel.app](https://society-maintenance-tracker-five-delta.vercel.app)**
- **Direct Login Screen**: **[https://society-maintenance-tracker-five-delta.vercel.app/login](https://society-maintenance-tracker-five-delta.vercel.app/login)**
- **Resident Flat Registration**: **[https://society-maintenance-tracker-five-delta.vercel.app/register](https://society-maintenance-tracker-five-delta.vercel.app/register)**
- **GitHub Repository**: **[https://github.com/RidhimaSharma11404/society-maintenance-tracker](https://github.com/RidhimaSharma11404/society-maintenance-tracker)**

---

## 🔑 2. 1-Click Instant Demo Credentials

The login page features 1-click access buttons for all three roles:

| Role | Name | Email | Password | Access Scope |
|---|---|---|---|---|
| **🛡️ ADMIN** | Secretary Elena Vance | `admin@greenwood.com` | `Password123!` | Full Operations Console, Architectural Elevation Map, Connected Risk Analytics, Priority Queue, Outbox Dispatch Logs |
| **🔧 STAFF** | Technician Marcus Cole | `staff@greenwood.com` | `Password123!` | Work Orders Timeline, Priority Queue, Status Progression, Maintenance Inspections |
| **🏠 RESIDENT** | Dr. Arthur Pendelton | `resident@greenwood.com` | `Password123!` | Flat 402 Maintenance Dues Ledger, 1-Click Ticket Logging with Photos, Pinned Society Circulars |

---

## 🏗️ 3. System Architecture & Engineering Design

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
                                  |  - Multer Photo Upload Pipeline       |
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

## 📊 4. Database Schema (Mongoose Models)

### `User`
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique, indexed)",
  "password": "String (bcrypt hash, select: false)",
  "role": "enum: ['admin', 'staff', 'resident']",
  "unitNumber": "String (e.g. 'Tower A - 402')",
  "phoneNumber": "String",
  "createdAt": "Date"
}
```

### `Complaint` (with Immutable FSM Audit History)
```json
{
  "_id": "ObjectId",
  "title": "String (required, max 100)",
  "description": "String (required)",
  "category": "String (Plumbing, Electrical, Elevator, Civil, etc.)",
  "priority": "enum: ['Low', 'Medium', 'High']",
  "unitNumber": "String (e.g. 'Tower B - 101')",
  "resident": "ObjectId -> User (ref)",
  "assignedStaff": "ObjectId -> User (ref, optional)",
  "images": ["String (relative upload path)"],
  "currentStatus": "enum: ['Open', 'In Progress', 'Resolved', 'Closed']",
  "dueDate": "Date (computed from SLA hours)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "statusHistory": [
    {
      "status": "enum: ['Open', 'In Progress', 'Resolved', 'Closed']",
      "changedBy": "ObjectId -> User (ref)",
      "comment": "String (optional note)",
      "timestamp": "Date (default: now)"
    }
  ]
}
```

### `Notice` (Notice Board with Pinned Alerts)
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "content": "String (required)",
  "category": "enum: ['Maintenance', 'Safety', 'Billing', 'General']",
  "priority": "enum: ['General', 'High', 'Urgent']",
  "isImportant": "Boolean (pinned to top when true)",
  "issuedBy": "ObjectId -> User (ref)",
  "createdAt": "Date"
}
```

### `CategorySetting` (Configurable SLA & Severity Weights)
```json
{
  "_id": "ObjectId",
  "category": "String (unique)",
  "severityWeight": "Number (1 - 5)",
  "slaHours": "Number (1 - 72)",
  "description": "String"
}
```

### `NotificationOutbox` (Transactional Outbox Events)
```json
{
  "_id": "ObjectId",
  "eventType": "enum: ['COMPLAINT_STATUS_CHANGED', 'IMPORTANT_NOTICE_POSTED', 'SLA_BREACH_ALERT']",
  "payload": "Object",
  "recipient": "String (email/phone)",
  "channel": "enum: ['EMAIL', 'SMS']",
  "status": "enum: ['PENDING', 'DELIVERED', 'FAILED']",
  "retryCount": "Number (default: 0)",
  "createdAt": "Date"
}
```

---

## 📡 5. API Documentation

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new resident flat owner account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current session profile |
| `GET` | `/api/dashboard/summary` | Admin / Staff | Aggregated counts by status, category & overdue tickets |
| `GET` | `/api/complaints` | Resident / Staff | List complaints (Residents see own; Admins see all with filters) |
| `POST` | `/api/complaints` | Resident | Create complaint with photo attachment (`multipart/form-data`) |
| `PUT` | `/api/complaints/:id/status`| Admin / Staff | Transition FSM status & append note to audit history |
| `GET` | `/api/notices` | Authenticated | Retrieve notice board with pinned important circulars |
| `POST` | `/api/notices` | Admin | Post new circular (optionally marked `isImportant`) |
| `GET` | `/api/settings` | Admin | Retrieve category SLA & severity thresholds |
| `PUT` | `/api/settings` | Admin | Update category SLA hours & severity weights |
| `GET` | `/api/technicians` | Admin / Staff | List active contractors & dispatch directory |
| `POST` | `/api/technicians/dispatch`| Admin / Staff | Dispatch contractor to unit for urgent maintenance |

---

## 🧪 6. Automated Unit Test Suite (100% Passing)

```bash
PASS tests/unit/complaintStateMachine.test.js
  Finite State Machine (FSM) Lifecycle Transition Rules
    ✓ Should define allowed transitions according to strict corporate workflow
    ✓ Should allow legal forward progression: Open -> In Progress -> Resolved -> Closed
    ✓ Should reject illegal direct jump from Open to Closed
    ✓ Should reject illegal transition out of terminal Closed state
    ✓ Should allow fallback/re-inspection transitions

PASS tests/unit/authService.test.js
  Authentication & Security Utilities
    ✓ Should generate valid signed JWT with correct payload claims
    ✓ Should securely hash password and verify match with bcrypt

PASS tests/unit/riskScoring.test.js
  Mathematical Risk Scoring Engine - Exponential Decay Verification
    ✓ Should return the full base severity weight at Day 0 (t = 0)
    ✓ Should decay to approximately half (~50%) after 30 days
    ✓ Should decay to approximately 25% after 60 days
    ✓ Should decay to approximately 12.5% after 90 days
  SLA Due Date Calculations
    ✓ Should compute accurate due timestamp based on SLA hours

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total (100% Passing)
```

---

## 💻 7. Local Development Quickstart

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

## 📄 8. System Design Write-Up
See the complete 800-word System Design write-up in [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md).
