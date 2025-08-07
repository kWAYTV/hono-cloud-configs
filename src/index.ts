import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import configs from './routes/configs.js';

const app = new Hono();

app.use(logger());
app.use(prettyJSON());
app.use(poweredBy({ serverName: 'cloud-config-api' }));

app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Cloud Configuration API',
  });
});

// Mount configs routes
app.route('/api/configs', configs);

app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: 'Not Found',
    },
    404,
  );
});

app.onError((_err, c) => {
  return c.json(
    {
      success: false,
      message: 'Internal Server Error',
    },
    500,
  );
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  },
);
