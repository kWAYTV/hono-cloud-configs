import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import { prisma } from '../src/lib/prisma.js';
import configs from '../src/routes/configs.js';

// Create test app
const app = new Hono();
app.route('/api/configs', configs);

// Test data
const testUser = 'testuser';
const testConfig = {
  user: testUser,
  name: 'test-config',
  content: 'test content',
};

describe('Configs Routes', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.config.deleteMany({
      where: { user: testUser },
    });
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.config.deleteMany({
      where: { user: testUser },
    });
  });

  describe('GET /api/configs', () => {
    it('Should return 400 if user parameter is missing', async () => {
      const req = new Request('http://localhost:3000/api/configs');
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('User parameter is required');
    });

    it('Should return empty array for user with no configs', async () => {
      const req = new Request(
        'http://localhost:3000/api/configs?user=nonexistentuser',
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('Should return user configs', async () => {
      // Create test config
      const createdConfig = await prisma.config.create({
        data: {
          id: 'test-id-1',
          ...testConfig,
        },
      });

      const req = new Request(
        `http://localhost:3000/api/configs?user=${testUser}`,
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].id).toBe(createdConfig.id);
      expect(data.data[0].name).toBe(testConfig.name);
      expect(data.data[0].user).toBe(testConfig.user);
    });
  });

  describe('GET /api/configs/:id', () => {
    it('Should return 404 for non-existent config', async () => {
      const req = new Request(
        'http://localhost:3000/api/configs/non-existent-id',
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe('Config not found');
    });

    it('Should return specific config', async () => {
      // Create test config
      const createdConfig = await prisma.config.create({
        data: {
          id: 'test-id-2',
          ...testConfig,
        },
      });

      const req = new Request(
        `http://localhost:3000/api/configs/${createdConfig.id}`,
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.id).toBe(createdConfig.id);
      expect(data.data.name).toBe(testConfig.name);
      expect(data.data.content).toBe(testConfig.content);
    });
  });

  describe('POST /api/configs', () => {
    it('Should return 400 if required fields are missing', async () => {
      const req = new Request('http://localhost:3000/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'test' }), // missing name and content
      });
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Missing required fields: user, name, content');
    });

    it('Should create new config', async () => {
      const req = new Request('http://localhost:3000/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testConfig),
      });
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.data.name).toBe(testConfig.name);
      expect(data.data.user).toBe(testConfig.user);
      expect(data.data.content).toBe(testConfig.content);
      expect(data.data.id).toBeDefined();
      expect(data.data.createdAt).toBeDefined();
      expect(data.data.updatedAt).toBeDefined();
    });
  });

  describe('PUT /api/configs/:id', () => {
    it('Should return 400 if content field is missing', async () => {
      const req = new Request('http://localhost:3000/api/configs/test-id', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // missing content
      });
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Content field is required');
    });

    it('Should update existing config', async () => {
      // Create test config
      const createdConfig = await prisma.config.create({
        data: {
          id: 'test-id-3',
          ...testConfig,
        },
      });

      const updatedContent = 'updated content';
      const req = new Request(
        `http://localhost:3000/api/configs/${createdConfig.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: updatedContent }),
        },
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.content).toBe(updatedContent);
      expect(data.data.id).toBe(createdConfig.id);
    });
  });

  describe('DELETE /api/configs/:id', () => {
    it('Should delete existing config', async () => {
      // Create test config
      const createdConfig = await prisma.config.create({
        data: {
          id: 'test-id-4',
          ...testConfig,
        },
      });

      const req = new Request(
        `http://localhost:3000/api/configs/${createdConfig.id}`,
        {
          method: 'DELETE',
        },
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe('Config successfully deleted');

      // Verify config is deleted
      const deletedConfig = await prisma.config.findUnique({
        where: { id: createdConfig.id },
      });
      expect(deletedConfig).toBeNull();
    });
  });

  describe('GET /api/configs/:id/export', () => {
    it('Should return 404 for non-existent config', async () => {
      const req = new Request(
        'http://localhost:3000/api/configs/no-such-id/export',
      );
      const res = await app.fetch(req);
      expect(res.status).toBe(404);
    });

    it('Should export a single config by id', async () => {
      const created = await prisma.config.create({
        data: { id: 'exp-one-1', user: testUser, name: 'n1', content: 'C1' },
      });
      const req = new Request(
        `http://localhost:3000/api/configs/${created.id}/export`,
      );
      const res = await app.fetch(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe(created.id);
      expect(data.user).toBe(testUser);
      expect(data.name).toBe('n1');
      expect(data.content).toBe('C1');
    });
  });

  describe('POST /api/configs/:id/import', () => {
    it('Should return 400 if user/content are missing', async () => {
      const req = new Request(
        'http://localhost:3000/api/configs/imp-one-1/import',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: testUser }),
        },
      );
      const res = await app.fetch(req);
      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBe('Missing required fields: user, content');
    });

    it('Should create when not exists (requires name)', async () => {
      const req = new Request(
        'http://localhost:3000/api/configs/imp-one-2/import',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: testUser, name: 'n2', content: 'C2' }),
        },
      );
      const res = await app.fetch(req);
      const data = await res.json();
      expect(res.status).toBe(201);
      expect(data.action).toBe('created');
      const created = await prisma.config.findUnique({
        where: { id: 'imp-one-2' },
      });
      expect(created?.content).toBe('C2');
    });

    it('Should update when exists (default upsert)', async () => {
      await prisma.config.create({
        data: { id: 'imp-one-3', user: testUser, name: 'n3', content: 'old' },
      });
      const req = new Request(
        'http://localhost:3000/api/configs/imp-one-3/import',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: testUser, content: 'new' }),
        },
      );
      const res = await app.fetch(req);
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.action).toBe('updated');
      const updated = await prisma.config.findUnique({
        where: { id: 'imp-one-3' },
      });
      expect(updated?.content).toBe('new');
    });

    it('Should skip when exists and mode is insert-only', async () => {
      await prisma.config.create({
        data: { id: 'imp-one-4', user: testUser, name: 'n4', content: 'keep' },
      });
      const req = new Request(
        'http://localhost:3000/api/configs/imp-one-4/import',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: testUser,
            content: 'ignored',
            mode: 'insert-only',
          }),
        },
      );
      const res = await app.fetch(req);
      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.action).toBe('skipped');
      const unchanged = await prisma.config.findUnique({
        where: { id: 'imp-one-4' },
      });
      expect(unchanged?.content).toBe('keep');
    });
  });
});
