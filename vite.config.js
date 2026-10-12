import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Serves /api/* from the api/ folder during `vite dev`, with the same
 * (req, res) shape Vercel gives its functions — so the lead form works
 * locally without the Vercel CLI.
 */
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Function calls only — not the browser loading api/*.js as a module.
        if (!req.url.startsWith('/api/') || /\.[a-z]+(\?|$)/i.test(req.url)) return next();
        const name = req.url.slice(5).split('?')[0].replace(/[^a-z0-9-]/gi, '');
        let mod;
        try {
          mod = await server.ssrLoadModule(`/api/${name}.js`);
        } catch {
          return next();
        }
        let raw = '';
        for await (const chunk of req) raw += chunk;
        try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };
        try {
          await mod.default(req, res);
        } catch (e) {
          console.error(e);
          res.status(500).json({ ok: false });
        }
      });
    }
  };
}

/**
 * Preloads the two fonts every first screen is set in (headline/body and the
 * serif italic accent), so text settles into its real font sooner.
 */
function preloadFonts() {
  const wanted = [/plus-jakarta-sans-latin-wght-normal-.*\.woff2$/, /instrument-serif-latin-400-italic-.*\.woff2$/];
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle || {});
      return wanted
        .map((re) => files.find((f) => re.test(f)))
        .filter(Boolean)
        .map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: '/' + f }, injectTo: 'head' }));
    }
  };
}

export default defineConfig({
  plugins: [react(), devApi(), preloadFonts()],
  server: { port: 5180 }
});
