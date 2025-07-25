import { Hono } from 'hono';
import client from './client/router';
import api from './api';

const app = new Hono();

app.route('/', client).route('/api', api);

export default app;
// export type Apptype = typeof route
