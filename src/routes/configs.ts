import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  createConfigSchema,
  idParamSchema,
  importSingleSchema,
  updateConfigSchema,
  userQuerySchema,
} from '../schemas/configs.schema.js';
import { configService } from '../services/config.service.js';

const app = new Hono()
  .get(
    '/',
    zValidator('query', userQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'User parameter is required' }, 400);
      }
    }),
    async (c) => {
      const { user } = c.req.valid('query');
      try {
        const configs = await configService.getMultiple(user);
        return c.json({ data: configs });
      } catch (_error) {
        return c.json({ error: 'Failed to fetch configs' }, 500);
      }
    },
  )

  .get('/:id/export', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    try {
      const item = await configService.exportSingle(id);
      if (!item) return c.json({ error: 'Config not found' }, 404);
      return c.json(item);
    } catch (_error) {
      return c.json({ error: 'Failed to export config' }, 500);
    }
  })

  .get('/:id', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
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

  .post(
    '/',
    zValidator('json', createConfigSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          { error: 'Missing required fields: user, name, content' },
          400,
        );
      }
    }),
    async (c) => {
      try {
        const body = c.req.valid('json');
        const config = await configService.create(body);
        return c.json({ data: config }, 201);
      } catch (_error) {
        return c.json({ error: 'Failed to create config' }, 500);
      }
    },
  )

  .put(
    '/:id',
    zValidator('param', idParamSchema),
    zValidator('json', updateConfigSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Content field is required' }, 400);
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      try {
        const body = c.req.valid('json');
        const config = await configService.update(id, body);
        return c.json({ data: config });
      } catch (_error) {
        return c.json({ error: 'Failed to update config' }, 500);
      }
    },
  )

  .delete('/:id', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    try {
      const result = await configService.delete(id);
      return c.json(result);
    } catch (_error) {
      return c.json({ error: 'Failed to delete config' }, 500);
    }
  })

  .post(
    '/:id/import',
    zValidator('param', idParamSchema),
    zValidator('json', importSingleSchema, (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Missing required fields: user, content' }, 400);
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      try {
        const body = c.req.valid('json');
        try {
          const result = await configService.importSingle(id, body);
          const status = result.action === 'created' ? 201 : 200;
          return c.json(result, status);
        } catch (e) {
          if (
            e instanceof Error &&
            e.message.includes('Missing required field: name')
          ) {
            return c.json({ error: 'Missing required fields: name' }, 400);
          }
          throw e;
        }
      } catch (_error) {
        return c.json({ error: 'Failed to import config' }, 500);
      }
    },
  );

export default app;
