const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch (err) {
    const testUri = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test-crud-db';
    await mongoose.connect(testUri);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

describe('PHASE-014: Positive Execution Paths (CRUD Success)', () => {
  const sampleUser = {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    age: 28
  };

  describe('TC-API-01: Full Positive Lifecycle Sequence (Create -> Read -> Update -> Delete -> Verify 404)', () => {
    it('should successfully execute the complete CRUD positive execution path', async () => {
      // Step 1: Dispatch POST /api/users validating 201 Created and ID mapping
      const createRes = await request(app)
        .post('/api/users')
        .send(sampleUser);

      expect([200, 201]).toContain(createRes.status);
      const createdUser = createRes.body.data || createRes.body;
      const userId = createdUser._id || createdUser.id;
      expect(userId).toBeDefined();
      expect(createdUser.name).toBe(sampleUser.name);
      expect(createdUser.email).toBe(sampleUser.email);
      expect(createdUser.age).toBe(sampleUser.age);

      // Step 2: Dispatch GET /api/users verifying data array matches length + schema
      const getAllRes = await request(app)
        .get('/api/users');

      expect(getAllRes.status).toBe(200);
      const userList = Array.isArray(getAllRes.body) ? getAllRes.body : (getAllRes.body.data || []);
      expect(Array.isArray(userList)).toBe(true);
      expect(userList.length).toBe(1);
      const retrievedUser = userList[0];
      expect(retrievedUser._id || retrievedUser.id).toBe(userId);
      expect(retrievedUser.name).toBe(sampleUser.name);
      expect(retrievedUser.email).toBe(sampleUser.email);

      // Step 3: Dispatch GET /api/users/:id verifying single resource fetch
      const getSingleRes = await request(app)
        .get(`/api/users/${userId}`);

      expect(getSingleRes.status).toBe(200);
      const singleUserData = getSingleRes.body.data || getSingleRes.body;
      expect(singleUserData._id || singleUserData.id).toBe(userId);
      expect(singleUserData.email).toBe(sampleUser.email);

      // Step 4: Dispatch PUT /api/users/<id> mutating values
      const updatedPayload = {
        name: 'Alice J. Smith',
        email: 'alice.smith@example.com',
        age: 29
      };

      const updateRes = await request(app)
        .put(`/api/users/${userId}`)
        .send(updatedPayload);

      expect(updateRes.status).toBe(200);
      const updatedUserData = updateRes.body.data || updateRes.body;
      expect(updatedUserData._id || updatedUserData.id).toBe(userId);
      expect(updatedUserData.name).toBe(updatedPayload.name);
      expect(updatedUserData.email).toBe(updatedPayload.email);
      expect(updatedUserData.age).toBe(updatedPayload.age);

      // Step 5: Dispatch DELETE /api/users/<id> verifying deletion
      const deleteRes = await request(app)
        .delete(`/api/users/${userId}`);

      expect([200, 204]).toContain(deleteRes.status);

      // Step 6: Retest GET /api/users/<id> verifying subsequent 404 absence
      const verifyAbsenceRes = await request(app)
        .get(`/api/users/${userId}`);

      expect(verifyAbsenceRes.status).toBe(404);

      // Step 7: Verify user list is now empty
      const finalGetAllRes = await request(app)
        .get('/api/users');

      expect(finalGetAllRes.status).toBe(200);
      const finalUserList = Array.isArray(finalGetAllRes.body) ? finalGetAllRes.body : (finalGetAllRes.body.data || []);
      expect(finalUserList.length).toBe(0);
    });
  });

  describe('Pagination and Bulk Read Positive Paths', () => {
    it('should paginate results accurately when query parameters page=1&limit=5 are provided', async () => {
      // Seed 7 users
      const testUsers = [
        { name: 'User One', email: 'user1@example.com', age: 21 },
        { name: 'User Two', email: 'user2@example.com', age: 22 },
        { name: 'User Three', email: 'user3@example.com', age: 23 },
        { name: 'User Four', email: 'user4@example.com', age: 24 },
        { name: 'User Five', email: 'user5@example.com', age: 25 },
        { name: 'User Six', email: 'user6@example.com', age: 26 },
        { name: 'User Seven', email: 'user7@example.com', age: 27 }
      ];

      for (const u of testUsers) {
        await request(app).post('/api/users').send(u);
      }

      // Dispatch GET /api/users?page=1&limit=5
      const page1Res = await request(app)
        .get('/api/users?page=1&limit=5');

      expect(page1Res.status).toBe(200);
      const page1Data = Array.isArray(page1Res.body) ? page1Res.body : (page1Res.body.data || []);
      expect(page1Data.length).toBe(5);

      // Dispatch GET /api/users?page=2&limit=5
      const page2Res = await request(app)
        .get('/api/users?page=2&limit=5');

      expect(page2Res.status).toBe(200);
      const page2Data = Array.isArray(page2Res.body) ? page2Res.body : (page2Res.body.data || []);
      expect(page2Data.length).toBe(2);
    });
  });
});
