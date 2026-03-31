const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const app = require('../src/config/app');

test('GET /api/v1/health returns service status', async () => {
  const res = await request(app).get('/api/v1/health');
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.status);
  assert.ok(res.body.timestamp);
  assert.ok(typeof res.body.uptimeSeconds === 'number');
});

