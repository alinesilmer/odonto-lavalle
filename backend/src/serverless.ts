import { createApp } from "./app.js";

/**
 * Entry point for Vercel's serverless runtime: the same Express app as
 * index.ts, exported as a request handler instead of listening on a port.
 * Built to dist/serverless.cjs and re-exported by /api/index.js at the repo root.
 */
export default createApp();
