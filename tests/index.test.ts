import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import configs from '../src/routes/configs.js';

// Create app instance for testing
const app = new Hono();

app.get('/', (c) => {
  return c.json({
    message: '🚀 Cloud Configuration System API',
    version: '1.0.0',
    endpoints: {
      configs: '/api/configs',
    },
  });
});

app.route('/api/configs', configs);

describe('Main Application', () => {
  it('Should return API info on root endpoint', async () => {
    const req = new Request('http://localhost:3000/');
    const res = await app.fetch(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('🚀 Cloud Configuration System API');
    expect(data.version).toBe('1.0.0');
    expect(data.endpoints.configs).toBe('/api/configs');
  });

  it('Should return 404 for unknown routes', async () => {
    const req = new Request('http://localhost:3000/unknown-route');
    const res = await app.fetch(req);

    expect(res.status).toBe(404);
  });
});
