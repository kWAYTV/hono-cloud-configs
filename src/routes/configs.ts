import { Hono } from 'hono';
import { configService } from '../services/config.service.js';
import type {
  CreateConfigRequest,
  UpdateConfigRequest,
} from '../types/config.types.js';

const app = new Hono()
  .get('/', async (c) => {
    const user = c.req.query('user');

    if (!user) {
      return c.json({ error: 'User parameter is required' }, 400);
    }

    try {
      const configs = await configService.getMultiple(user);
      return c.json({ data: configs });
    } catch (_error) {
      return c.json({ error: 'Failed to fetch configs' }, 500);
    }
  })

  .get('/:id', async (c) => {
    const id = c.req.param('id');

    try {
      const config = await configService.getSingle(id);

      if (!config) {
        return c.json({ error: 'Config not found' }, 404);
      }

      return c.json({ data: config });
    } catch (_error) {
      return c.json({ error: 'Failed to fetch config' }, 500);
    }
  })

  .post('/', async (c) => {
    try {
      const body = await c.req.json<CreateConfigRequest>();

      if (!body.user || !body.name || !body.content) {
        return c.json(
          { error: 'Missing required fields: user, name, content' },
          400,
        );
      }

      const config = await configService.create(body);
      return c.json({ data: config }, 201);
    } catch (_error) {
      return c.json({ error: 'Failed to create config' }, 500);
    }
  })

  .put('/:id', async (c) => {
    const id = c.req.param('id');

    try {
      const body = await c.req.json<UpdateConfigRequest>();

      if (!body.content) {
        return c.json({ error: 'Content field is required' }, 400);
      }

      const config = await configService.update(id, body);
      return c.json({ data: config });
    } catch (_error) {
      return c.json({ error: 'Failed to update config' }, 500);
    }
  })

  .delete('/:id', async (c) => {
    const id = c.req.param('id');

    try {
      const result = await configService.delete(id);
      return c.json(result);
    } catch (_error) {
      return c.json({ error: 'Failed to delete config' }, 500);
    }
  });

export default app;
