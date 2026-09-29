/**
 * Production build: one ESM file in dist/. npm packages stay external (they're
 * installed on the server), but the workspace's own @odonto/shared is bundled
 * in, because it ships TypeScript source that plain Node can't import.
 */
import { build } from "esbuild";

const externalPackages = {
  name: "external-packages",
  setup(b) {
    // Bare imports ("express", "firebase-admin/…") except our workspace packages.
    b.onResolve({ filter: /^[^./]/ }, (args) =>
      args.path.startsWith("@odonto/") ? undefined : { path: args.path, external: true },
    );
  },
};

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: "dist/index.js",
  sourcemap: true,
  plugins: [externalPackages],
  logLevel: "info",
});
