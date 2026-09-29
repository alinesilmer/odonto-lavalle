/**
 * Creates the composite Firestore indexes this API needs.
 *
 * `firebase deploy --only firestore:indexes` needs project-level permissions a
 * service-account key does not have, so this talks to the Firestore Admin API
 * directly using the same credentials the server already runs on.
 *
 *   npm run indexes -w backend            # create anything missing
 *   npm run indexes -w backend -- --list  # just show what exists
 */
import { readFileSync } from "node:fs";
import { app } from "../src/config/firebase.js";
import { env } from "../src/config/env.js";

const API = "https://firestore.googleapis.com/v1";
const PARENT = `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/collectionGroups`;

interface IndexField {
  fieldPath: string;
  order: "ASCENDING" | "DESCENDING";
}

interface IndexSpec {
  collectionGroup: string;
  fields: IndexField[];
}

interface RemoteIndex {
  name?: string;
  state?: string;
  fields?: { fieldPath: string; order?: string }[];
}

/** The index list lives in the repo so it stays reviewable in one place. */
function wantedIndexes(): IndexSpec[] {
  const url = new URL("../../firestore.indexes.json", import.meta.url);
  const file = JSON.parse(readFileSync(url, "utf8")) as { indexes: IndexSpec[] };
  return file.indexes;
}

async function token(): Promise<string> {
  const credential = app.options.credential;
  if (!credential) throw new Error("no credential on the Firebase app");
  const { access_token } = await credential.getAccessToken();
  return access_token;
}

async function call(path: string, init?: RequestInit) {
  const res = await fetch(`${API}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await token()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${res.status} ${json?.error?.message ?? text}`);
  return json;
}

/** Composite indexes already defined for a collection, ignoring the implicit __name__ tail. */
async function existing(collectionGroup: string): Promise<string[]> {
  const res = (await call(`${PARENT}/${collectionGroup}/indexes`)) as { indexes?: RemoteIndex[] };
  return (res.indexes ?? []).map((index) =>
    (index.fields ?? [])
      .filter((f) => f.fieldPath !== "__name__")
      .map((f) => `${f.fieldPath}:${f.order}`)
      .join(","),
  );
}

const signature = (spec: IndexSpec) =>
  spec.fields.map((f) => `${f.fieldPath}:${f.order}`).join(",");

async function main() {
  const listOnly = process.argv.includes("--list");
  const specs = wantedIndexes();
  const groups = [...new Set(specs.map((s) => s.collectionGroup))];

  const present = new Map<string, string[]>();
  for (const group of groups) present.set(group, await existing(group));

  if (listOnly) {
    for (const [group, sigs] of present) {
      console.log(`${group}:`);
      for (const sig of sigs) console.log(`   ${sig || "(single field)"}`);
    }
    return;
  }

  let created = 0;
  for (const spec of specs) {
    const sig = signature(spec);
    if (present.get(spec.collectionGroup)?.includes(sig)) {
      console.log(`  ok      ${spec.collectionGroup}  ${sig}`);
      continue;
    }

    await call(`${PARENT}/${spec.collectionGroup}/indexes`, {
      method: "POST",
      body: JSON.stringify({ queryScope: "COLLECTION", fields: spec.fields }),
    });
    created += 1;
    console.log(`  create  ${spec.collectionGroup}  ${sig}`);
  }

  console.log(
    created === 0
      ? "\nAll indexes already exist."
      : `\nRequested ${created} index(es). Firestore builds them in the background; ` +
          "re-run with --list in a minute to confirm they are READY.",
  );
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error("[indexes]", err instanceof Error ? err.message : err);
    process.exit(1);
  },
);
