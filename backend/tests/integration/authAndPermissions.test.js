const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/services/authService');
const { connectTestDb, disconnectTestDb, clearTestDb } = require('../setupTestDb');

describe('Authentication & Role-Based Authorization Integration', () => {
  let adminToken;
  let residentToken;

  beforeAll(async () => {
    await connectTestDb();
    await clearTestDb();

    const admin = await User.create({
      name: 'Admin Boss',
      email: 'admin.auth@test.com',
      password: 'Password123!',
      role: 'admin',
      unitNumber: 'HQ-1'
    });

    const resident = await User.create({
      name: 'Resident John',
      email: 'resident.auth@test.com',
      password: 'Password123!',
      role: 'resident',
      unitNumber: 'Tower 4-B'
    });

    adminToken = generateToken(admin);
    residentToken = generateToken(resident);
  }, 30000);

  afterAll(async () => {
    await disconnectTestDb();
  }, 30000);

  test('POST /api/auth/register - Register new resident account', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Tenant',
        email: 'tenant@test.com',
        password: 'Password123!',
        unitNumber: 'Tower 2 - 303'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('tenant@test.com');
    expect(res.body.data.user.role).toBe('resident');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login - Authenticate with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.auth@test.com',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('admin');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login - Reject invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.auth@test.com',
        password: 'WrongPassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/settings - Allowed for authenticated users', async () => {
    const res = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${residentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('PUT /api/settings/:category - Prohibit residents from modifying SLA settings (403 Forbidden)', async () => {
    const res = await request(app)
      .put('/api/settings/Plumbing')
      .set('Authorization', `Bearer ${residentToken}`)
      .send({
        severityWeight: 5,
        slaHours: 10
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('PUT /api/settings/:category - Allow admin to modify SLA settings', async () => {
    const res = await request(app)
      .put('/api/settings/Plumbing')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        severityWeight: 5,
        slaHours: 8
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.severityWeight).toBe(5);
    expect(res.body.data.slaHours).toBe(8);
  });
});
