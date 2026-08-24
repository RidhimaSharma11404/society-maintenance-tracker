# Walkthrough - Enterprise Society Maintenance Tracker

The Society Maintenance Tracker has been tailored to the high engineering and product standards expected by **Unthinkable Solutions (Pune)**, featuring a clean, uncluttered enterprise SaaS design, context-aware **Operations AI Copilot**, dynamic exponential half-life risk-scoring engine, append-only Finite State Machine (FSM) complaint lifecycle, and decoupled Transactional Outbox pattern.

---

## Architecture & Engineering Highlights

```
                                  +-----------------------------+
                                  |   React 18 + Vite (SPA)     |
                                  | High-Contrast Executive UI  |
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
         | (Exp Decay & Aggregation) | | (Ops Telemetry)   | |  (Active Probe & Fallback)|
         +-------------+-------------+ +---------+---------+ +-------------+-------------+
                       |                         |                         |
                       v                         v                         v
         +-------------------------------------------------------------------------------+
         |                       MongoDB In-Memory / Replica-Set Engine                  |
         |                         Status FSM + Settings + Outbox Events                 |
         +-------------------------------------------------------------------------------+
```

---

## Key Enhancements & New Features

### 1. Operations AI Copilot (`/api/assistant/chat`)
- Real-time intelligent operations assistant embedded into the executive navigation header.
- Answers queries on telemetry, analyzes high-risk recurring units, summarizes overdue SLA tickets, and drafts resident maintenance circulars.
- Includes quick-prompt suggestion chips, instant response rendering, and one-click copy to clipboard.

### 2. High-Contrast, Distraction-Free Enterprise UI
- Clean, uncluttered layout adhering to modern product engineering standards (Linear/Notion/Stripe styling).
- High readability: Deep slate headings (`#0f172a`), clean white cards, subtle border delineation (`#e2e8f0`), and professional `#0f766e` teal accents.
- Removed neon glows, unnecessary pulsing dots, and visual clutter.

### 3. Interactive Range Sliders
- **Dynamic Risk Engine (`/risk-analytics`)**:
  - Lookback Window Slider ($15\text{ to }180\text{ Days}$)
  - Risk Alert Threshold Slider ($1.0\text{ to }8.0\text{ pts}$)
  - Decay Half-Life Slider ($10\text{ to }60\text{ Days}$) recalculating $\lambda = \frac{\ln 2}{t_{1/2}}$ in real-time.
- **SLA & Severity Matrix (`/settings`)**:
  - Direct sliders for category severity ($1\text{ to }5$) and response targets ($1\text{ to }72\text{ Hours}$).

### 4. Single Unified Link Deployment
- All three personas (**Admin**, **Staff**, and **Resident**) are accessible through a single port: **[http://localhost:3000](http://localhost:3000)** (or **[http://localhost:5000](http://localhost:5000)**).
- Built-in one-click persona switcher on the navigation bar.

---

## Verification Results

### Automated Unit Test Suite (`npm test`)
```
PASS tests/unit/complaintStateMachine.test.js
  Finite State Machine (FSM) Lifecycle Transition Rules
    √ Should define allowed transitions according to strict corporate workflow (8 ms)
    √ Should allow legal forward progression: Open -> In Progress -> Resolved -> Closed (2 ms)
    √ Should reject illegal direct jump from Open to Closed (1 ms)
    √ Should reject illegal transition out of terminal Closed state (2 ms)
    √ Should allow fallback/re-inspection transitions (In Progress -> Open, Resolved -> In Progress) (1 ms)

PASS tests/unit/authService.test.js
  Authentication & Security Utilities
    √ Should generate valid signed JWT with correct payload claims (5 ms)
    √ Should securely hash password and verify match with bcrypt (319 ms)

PASS tests/unit/riskScoring.test.js
  Mathematical Risk Scoring Engine - Exponential Decay Verification
    √ Should return the full base severity weight at Day 0 (t = 0) (2 ms)
    √ Should decay to approximately half (~50%) of severity weight after 30 days (1 ms)
    √ Should decay to approximately 25% of severity weight after 60 days
    √ Should decay to approximately 12.5% of severity weight after 90 days (1 ms)
    √ Should handle edge cases gracefully (negative daysAgo treated as 0) (1 ms)
  SLA Due Date Calculations
    √ Should compute accurate due timestamp based on SLA hours (1 ms)
    √ Should accurately add fractional or short emergency SLA hours (1 ms)

Test Suites: 3 passed, 3 total
Tests:       14 passed, 14 total
Time:        1.969 s
```
