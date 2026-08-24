const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Complaint = require('../../src/models/Complaint');
const NotificationOutbox = require('../../src/models/NotificationOutbox');
const CategorySetting = require('../../src/models/CategorySetting');
const { generateToken } = require('../../src/services/authService');
const { connectTestDb, disconnectTestDb, clearTestDb } = require('../setupTestDb');

describe('Complaint Finite State Machine (FSM) & Outbox Integration', () => {
  let adminUser;
  let residentUser;
  let adminToken;
  let residentToken;
  let testComplaint;

  beforeAll(async () => {
    await connectTestDb();
    await clearTestDb();

    // Seed category
    await CategorySetting.create({
      category: 'Plumbing',
      severityWeight: 4,
      slaHours: 24
    });

    // Create users
    adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin.fsm@test.com',
      password: 'Password123!',
      role: 'admin',
      unitNumber: 'Office 1'
    });

    residentUser = await User.create({
      name: 'Test Resident',
      email: 'resident.fsm@test.com',
      password: 'Password123!',
      role: 'resident',
      unitNumber: 'Block A - 101'
    });

    adminToken = generateToken(adminUser);
    residentToken = generateToken(residentUser);
  }, 30000);

  afterAll(async () => {
    await disconnectTestDb();
  }, 30000);

  test('POST /api/complaints - Should create a complaint in "Open" status and enqueue Outbox event', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${residentToken}`)
      .send({
        title: 'Water tap leaking',
        description: 'Bathroom tap won\'t shut completely',
        category: 'Plumbing',
        unitNumber: 'Block A - 101'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentStatus).toBe('Open');
    expect(res.body.data.statusHistory.length).toBe(1);

    testComplaint = res.body.data;

    // Verify Outbox enqueued an event
    const outboxItem = await NotificationOutbox.findOne({
      'metadata.complaintId': testComplaint._id
    });
    expect(outboxItem).not.toBeNull();
    expect(outboxItem.recipient).toBe(residentUser.email);
    expect(outboxItem.status).toBe('PENDING');
  });

  test('PUT /api/complaints/:id/status - Should allow valid transition: Open -> In Progress', async () => {
    const res = await request(app)
      .put(`/api/complaints/${testComplaint._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nextStatus: 'In Progress',
        comment: 'Technician assigned and dispatched.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentStatus).toBe('In Progress');
    expect(res.body.data.statusHistory.length).toBe(2);
    expect(res.body.data.statusHistory[1].status).toBe('In Progress');
  });

  test('PUT /api/complaints/:id/status - Should REJECT invalid transition: In Progress -> Closed directly', async () => {
    const res = await request(app)
      .put(`/api/complaints/${testComplaint._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nextStatus: 'Closed',
        comment: 'Attempting invalid direct close.'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid status transition');
  });

  test('PUT /api/complaints/:id/status - Should allow valid transition: In Progress -> Resolved', async () => {
    const res = await request(app)
      .put(`/api/complaints/${testComplaint._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nextStatus: 'Resolved',
        comment: 'Pipe seal replaced. Tested with water pressure.'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.currentStatus).toBe('Resolved');
  });

  test('PUT /api/complaints/:id/status - Should allow valid transition: Resolved -> Closed', async () => {
    const res = await request(app)
      .put(`/api/complaints/${testComplaint._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nextStatus: 'Closed',
        comment: 'Resident confirmed resolution.'
      });

    expect(res.status).toBe(200);
    expect(res.body.data.currentStatus).toBe('Closed');
  });

  test('PUT /api/complaints/:id/status - Should REJECT any transition from terminal Closed state', async () => {
    const res = await request(app)
      .put(`/api/complaints/${testComplaint._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nextStatus: 'Open',
        comment: 'Trying to reopen closed ticket.'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid status transition');
  });
});
