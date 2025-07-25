import { Hono } from 'hono';
import books from './books';
import users from './users';
import backup from './backup';
import { bearerAuth } from 'hono/bearer-auth';
import { prettyJSON } from 'hono/pretty-json';
import { API_ACCESS_KEY } from '@/constant';

type Bindings = {
  DB: D1Database;
  API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const privilegedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 *  `/api/*`
 */
app
  .use(prettyJSON({ query: '' })) // 常に整形したJSONを返す
  .on(privilegedMethods, '/*', async (c, next) => {
    const bearer = bearerAuth({
      verifyToken: async (token) => token === API_ACCESS_KEY,
    });

    return bearer(c, next);
  })
  .get('/', async (c) => {
    return c.json('Hello Hono!');
  })
  .route('/books', books)
  .route('/users', users)
  .route('/backup', backup);

export default app;
export type AppType = typeof app;
