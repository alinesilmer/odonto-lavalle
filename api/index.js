// Vercel serverless function: every /api/* request lands here (see the rewrite
// in vercel.json) and is handled by the backend's Express app, pre-bundled by
// `npm run build --workspace=backend` into backend/dist/serverless.cjs.
import backend from "../backend/dist/serverless.cjs";

// esbuild's CommonJS output keeps the ES default export under `.default`.
export default backend.default ?? backend;
