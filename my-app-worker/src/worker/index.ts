/**
 * Cloudflare Workers 入口
 */

import { createD1Repository } from './db/d1';
import { createApp } from '../shared/app';

export default {
  fetch(request: Request, env: any) {
    const repo = createD1Repository(env);
    const app = createApp(repo);
    return app.fetch(request, env);
  },
};
