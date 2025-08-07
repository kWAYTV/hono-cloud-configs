import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import notFound from 'stoker/middlewares/not-found';
import onError from 'stoker/middlewares/on-error';
import configs from './routes/configs.js';

const app = new Hono();

app.use(logger());
app.use(prettyJSON());
app.use(poweredBy({ serverName: 'cloud-config-api' }));
app.use(requestId());

app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }));

app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Cloud Configuration API',
  });
});

app.route('/api/configs', configs);

app.notFound(notFound);

app.onError(onError);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  },
);
