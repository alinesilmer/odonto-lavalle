/**
 * Production build. npm packages stay external (installed on the server),
 * except the few bundled in below.
 *
 *  - dist/index.js         ESM, a long-running server (`npm start`, local or any Node host)
 *  - dist/serverless.cjs   CommonJS, the same app as a request handler for Vercel
 *                          (/api/index.js). CommonJS so every external package is
 *                          a plain require() that Vercel's file tracer can follow.
 */
import { build } from "esbuild";

/**
 * Bundled in rather than left external:
 *  - @odonto/*: TypeScript source that plain Node can't import.
 *  - firebase-admin → jwks-rsa → jose: jwks-rsa require()s jose, which is
 *    ESM-only. Plain Node 22+ copes, but Vercel's function loader doesn't, so
 *    esbuild resolves that chain at build time instead.
 */
const BUNDLED = /^(@odonto\/|firebase-admin(\/|$)|jwks-rsa(\/|$)|jose(\/|$))/;

const externalPackages = {
  name: "external-packages",
  setup(b) {
    b.onResolve({ filter: /^[^./]/ }, (args) =>
      BUNDLED.test(args.path) ? undefined : { path: args.path, external: true },
    );
  },
};

const common = {
  bundle: true,
  platform: "node",
  target: "node20",
  sourcemap: true,
  plugins: [externalPackages],
  logLevel: "info",
};

await Promise.all([
  build({
    ...common,
    entryPoints: ["src/index.ts"],
    format: "esm",
    outfile: "dist/index.js",
    // The bundled CommonJS (firebase-admin) calls require() for built-ins and
    // external packages; an ESM file has no require, so give it one.
    banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' },
  }),
  build({
    ...common,
    entryPoints: ["src/serverless.ts"],
    format: "cjs",
    outfile: "dist/serverless.cjs",
  }),
]);
