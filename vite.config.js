import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

function apiDevServerPlugin(env) {
  return {
    name: 'vite-plugin-api-routes',
    configureServer(server) {
      server.middlewares.use('/api/bulk-enquiry', (req, res) => {
        Object.assign(process.env, env);

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch (e) {
            req.body = {};
          }

          if (!res.status) {
            res.status = function(code) {
              res.statusCode = code;
              return res;
            };
          }
          if (!res.json) {
            res.json = function(data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }

          try {
            const { default: handler } = await import('./api/bulk-enquiry.js');
            await handler(req, res);
          } catch (err) {
            console.error('Dev server API handler error:', err);
            res.status(500).json({ success: false, message: 'Unable to submit bulk order enquiry.' });
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin(env)],
  };
})



