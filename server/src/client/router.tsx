import { Hono } from 'hono';
import type { Bindings } from './types/bindings';
import HomePage from './pages/home/HomePage';
import HomePage2 from './pages/home/HomePage2';

const app = new Hono<{ Bindings: Bindings }>();

app
  .get('/', async (c) => {
    const messages = ['Good Morning', 'Good Evening', 'Good Night'];
    const content = await HomePage2({ messages, DB: c.env.DB });

    return c.html(content);
  })
  .get('/2', async (c) => {
    const messages = ['Good Morning', 'Good Evening', 'Good Night'];
    const content = await HomePage({ messages, DB: c.env.DB });

    return c.html(content);
  });

export default app;
