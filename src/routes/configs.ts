import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import * as HttpStatusCodes from 'stoker/http-status-codes';
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
        return c.json(
          { error: 'User parameter is required' },
          HttpStatusCodes.BAD_REQUEST,
        );
      }
    }),
    async (c) => {
      const { user } = c.req.valid('query');
      try {
        const configs = await configService.getMultiple(user);
        return c.json({ data: configs });
      } catch (_error) {
        return c.json(
          { error: 'Failed to fetch configs' },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
    },
  )

  .get('/:id/export', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    try {
      const item = await configService.exportSingle(id);
      if (!item)
        return c.json({ error: 'Config not found' }, HttpStatusCodes.NOT_FOUND);
      return c.json(item);
    } catch (_error) {
      return c.json(
        { error: 'Failed to export config' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  })

  .get('/:id', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    try {
      const config = await configService.getSingle(id);

      if (!config) {
        return c.json({ error: 'Config not found' }, HttpStatusCodes.NOT_FOUND);
      }

      return c.json({ data: config });
    } catch (_error) {
      return c.json(
        { error: 'Failed to fetch config' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  })

  .post(
    '/',
    zValidator('json', createConfigSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          { error: 'Missing required fields: user, name, content' },
          HttpStatusCodes.BAD_REQUEST,
        );
      }
    }),
    async (c) => {
      try {
        const body = c.req.valid('json');
        const config = await configService.create(body);
        return c.json({ data: config }, HttpStatusCodes.CREATED);
      } catch (_error) {
        return c.json(
          { error: 'Failed to create config' },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
    },
  )

  .put(
    '/:id',
    zValidator('param', idParamSchema),
    zValidator('json', updateConfigSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          { error: 'Content field is required' },
          HttpStatusCodes.BAD_REQUEST,
        );
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      try {
        const body = c.req.valid('json');
        const config = await configService.update(id, body);
        return c.json({ data: config });
      } catch (_error) {
        return c.json(
          { error: 'Failed to update config' },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
    },
  )

  .delete('/:id', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    try {
      const result = await configService.delete(id);
      return c.json(result);
    } catch (_error) {
      return c.json(
        { error: 'Failed to delete config' },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  })

  .post(
    '/:id/import',
    zValidator('param', idParamSchema),
    zValidator('json', importSingleSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          { error: 'Missing required fields: user, content' },
          HttpStatusCodes.BAD_REQUEST,
        );
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      try {
        const body = c.req.valid('json');
        try {
          const result = await configService.importSingle(id, body);
          const status =
            result.action === 'created'
              ? HttpStatusCodes.CREATED
              : HttpStatusCodes.OK;
          return c.json(result, status);
        } catch (e) {
          if (
            e instanceof Error &&
            e.message.includes('Missing required field: name')
          ) {
            return c.json(
              { error: 'Missing required fields: name' },
              HttpStatusCodes.BAD_REQUEST,
            );
          }
          throw e;
        }
      } catch (_error) {
        return c.json(
          { error: 'Failed to import config' },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
    },
  );

export default app;
