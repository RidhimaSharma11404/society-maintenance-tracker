# System Design Document: Society Maintenance Platform

**Author:** Greenwood Heights Engineering Team  
**Scope:** Architecture, Audit Model, Overdue Detection, Media Storage, and Notification Flow  
**Target Length:** < 800 Words  

---

### 1. Architectural Overview
The platform implements a decoupled, three-tier enterprise architecture following the **Controller-Service-Repository** pattern. It separates transport protocols (Express REST API) from core domain business rules and persistence mechanisms (MongoDB / Mongoose). The frontend is a React 18 Single-Page Application (SPA) utilizing Tailwind CSS and Recharts for architectural digital twin telemetry and dynamic risk tracking.

```
[React SPA Client] ──(HTTPS/REST)──> [Express API Gateway & RBAC]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
[Complaint FSM Service]         [Risk & Overdue Engine]          [Transactional Outbox]
         │                                 │                                 │
         └─────────────────────────────────┼─────────────────────────────────┘
                                           ▼
                       [MongoDB Document Store (ACID)]
```

---

### 2. Complaint Lifecycle & Immutable Status History Model
To ensure complete transparency between residents and society administrators, complaints follow a deterministic **Finite State Machine (FSM)**:

$$\text{Open} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$

- **State Integrity:** Transition validation is enforced at the domain service layer and verified via Mongoose schema middleware. Direct illegal jumps (e.g., `Open` $\rightarrow$ `Closed`) are strictly rejected.
- **Append-Only History Sub-Document:** Every status update appends an immutable entry to `statusHistory`:
  ```json
  {
    "status": "In Progress",
    "changedBy": "usr_64f1a2b3c4d5",
    "comment": "Plumber assigned to inspect main riser trap.",
    "timestamp": "2026-08-24T10:30:00.000Z"
  }
  ```
- **Audit Compliance:** Historical entries cannot be modified or deleted. When a ticket is marked `Resolved`, it transitions to `Closed` with completion timestamps.

---

### 3. Configurable Overdue Detection & Mathematical Defect Risk Scoring
Overdue complaints are detected dynamically without brittle cron-job data mutations:

1. **SLA Calculation:** When a complaint is created, its deadline is set based on category-specific SLA hours configured in `CategorySetting`:
   $$\text{dueDate} = \text{createdAt} + (\text{slaHours} \times 3600 \times 1000)$$
2. **On-Read Overdue Querying:** Complaints with $\text{dueDate} < \text{Now}()$ and status $\in \{\text{Open}, \text{In Progress}\}$ are automatically flagged as overdue and sorted with top priority in administrative queues.
3. **Predictive Defect Decay Engine:** Beyond simple overdue flags, the system computes cumulative exponential decay risk scores per flat unit to detect chronic component failures before breakdown:
   $$S(t) = \text{SeverityWeight} \times e^{-\lambda \cdot t} \quad \text{where} \quad \lambda = \frac{\ln(2)}{t_{1/2}}$$
   This surfaces recurring trouble spots (e.g., Tower B-101 plumbing risers) on the architectural elevation map.

---

### 4. Photo Handling & Multipart Storage Pipeline
Residents can attach supporting photographs when submitting maintenance requests:

```
[Client Image File] ──> [Multer Multipart Pipeline] ──> [MIME/Size Validator] ──> [Local/Cloud Bucket]
                                                                                       │
                                                                         [Indexed Asset URI in DB]
```

- **Upload Verification:** Handled via `multer` with a 10MB payload limit, enforcing MIME-type validation (`image/jpeg`, `image/png`, `image/webp`).
- **Storage Strategy:** Files are hashed with UUID timestamps (`crypto.randomUUID()`) to prevent namespace collisions and stored under `/public/uploads/` (or cloud S3-compatible buckets in multi-region environments).
- **Client Delivery:** Served statically with cached `ETag` headers for rapid thumbnail loading in the complaint history timeline.

---

### 5. Decoupled Notification & Transactional Outbox Flow
To guarantee that resident email/SMS notifications are never lost during server crashes or third-party email provider outages, the platform implements the **Transactional Outbox Pattern**:

```
[Complaint Update] ──(ACID Multi-Doc Txn)──> [Save Complaint + Insert Outbox Event]
                                                              │
                                                              ▼
                                                   [Outbox Worker Poller]
                                                              │
                                                              ▼
                                                   [SMTP / Resend Dispatcher]
                                                              │
                                                              ▼
                                                   [Mark Event DELIVERED]
```

1. **Atomic Persistence:** When an admin changes complaint status or posts an important notice, the complaint update and the notification event are written within a single database transaction.
2. **Asynchronous Polling Dispatcher:** A background worker polls pending outbox entries (`status: 'PENDING'`) with exponential backoff retry logic ($3\times$ attempts).
3. **Delivery Channels:** Sends formatted HTML email updates with resolution notes to residents and broadcasts high-priority circular alerts across society notice boards.
