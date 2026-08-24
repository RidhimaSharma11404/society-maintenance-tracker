# Greenwood Heights · Facility Operations & Predictive Maintenance Platform

A production-grade Facility Operations & Predictive Maintenance Management System for **Greenwood Heights Co-operative Housing Society**. Engineered with an architectural elevation digital twin, mathematical exponential half-life defect decay modeling, multi-tenant RBAC, append-only Finite State Machine (FSM) complaint audit logs, and a Transactional Outbox Pattern for decoupled event-driven dispatch.

---

## 🌐 Live Application & Demo Access

- **Live Deployed URL**: **[https://thin-papers-heal.loca.lt](https://thin-papers-heal.loca.lt)** *(Enter Tunnel Password: `139.167.143.182` if prompted)*
- **Local URL**: `http://localhost:5000` (or `http://localhost:3000`)

### 🔑 Instant 1-Click Demo Credentials (All 3 Roles)
| Role | Email | Password | Access Scope |
|---|---|---|---|
| **🛡️ Admin (Secretary Vance)** | `admin@greenwood.com` | `Password123!` | Full Operations Console, Elevation Map, Defect Analytics, Outbox Dispatch |
| **🔧 Staff (Technician Cole)** | `staff@greenwood.com` | `Password123!` | Work Orders Registry, Dispatch Queue, Maintenance Logs |
| **🏠 Resident (Dr. Pendelton)** | `resident@greenwood.com` | `Password123!` | Resident Dashboard, Flat Tickets, Ledger & Society Bulletins |

---

## 🏗️ Architecture & Engineering Pillars

```
                                  +-----------------------------+
                                  |   React 18 + Vite (SPA)     |
                                  | Living Building Hero Map    |
                                  +--------------+--------------+
                                                 | REST / Multipart API
                                                 v
                                  +-----------------------------+
                                  |   Express.js Application    |
                                  |  (Auth / RBAC / FSM Engine) |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                         |                         |
                       v                         v                         v
         +---------------------------+ +-------------------+ +---------------------------+
         | Complaint / Risk Service  | | Operations Hub    | |  Transactional Outbox     |
         | (Exp Decay & Aggregation) | | (Telemetry Stream)| |  (Active Probe & Dispatch)|
         +-------------+-------------+ +---------+---------+ +-------------+-------------+
                       |                         |                         |
                       v                         v                         v
         +-------------------------------------------------------------------------------+
         |                       MongoDB In-Memory / Replica-Set Engine                  |
         |                         Status FSM + Settings + Outbox Events                 |
         +-------------------------------------------------------------------------------+
```

### Key Engineering Features
1. **Living Building Elevation Map**: Interactive architectural elevation blueprint of Greenwood Heights (Tower A, Central Utility Core with Otis elevator shafts, Tower B, and foundation plinth) with real-time radial alert glows on trouble units.
2. **Predictive Defect Decay Engine**: Computes dynamic exponential decay to spot recurring equipment strain before major breakdowns:
   $$S(t) = \text{SeverityWeight} \times e^{-\lambda \times t}$$
3. **Finite State Machine (FSM) Lifecycle**: Strict status transition graph (`Open` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Closed`) enforced at the Mongoose pre-save model layer with immutable audit histories.
4. **Resilient Transactional Outbox Pattern**: Runtime active probe detects replica-set ACID multi-document transaction capability with a transparent standalone fallback mechanism for reliable email/SMS dispatch.
5. **Split-Screen Modern SaaS Authentication**: Bespoke split-screen sign-in console with instant 1-click role switcher and interactive resident flat registration.

---

## 🧪 Automated Unit Test Suite (100% Passing)

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
Tests:       14 passed, 14 total (100% Passed)
```

---

## 🚀 Cloud Deployment Instructions

### Deploy to Render (Zero-Config 1-Click)
This repository includes a native **`render.yaml`** configuration:
1. Go to **[Render.com](https://render.com)** $\rightarrow$ Click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository: `RidhimaSharma11404/society-maintenance-tracker`.
3. Render will auto-detect `render.yaml` (`npm run build` and `npm start`).
4. Click **Create Web Service**.

### Deploy to Vercel (Frontend)
1. Go to **[Vercel.com](https://vercel.com/new)** $\rightarrow$ Import `society-maintenance-tracker`.
2. Set Root Directory to `frontend` (Vite framework auto-detected).
3. Set environment variable: `VITE_API_URL=https://<your-backend-url>/api`.
4. Click **Deploy**.

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/RidhimaSharma11404/society-maintenance-tracker.git
cd society-maintenance-tracker

# Install dependencies and build frontend
npm run build

# Start unified full-stack application (Port 5000)
npm start

# Run unit test suite
npm test
```
