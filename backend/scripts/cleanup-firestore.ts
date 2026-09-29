/**
 * Wipes every Firestore document in the project.
 *
 * Firebase Authentication users are NEVER touched by this script — logins keep
 * working. Cloud Storage files are not touched either.
 *
 * This is irreversible. It refuses to run unless you pass --yes, and it prints
 * exactly what it is about to delete first.
 *
 *   npm run cleanup -w backend -- --dry-run   # show counts, delete nothing
 *   npm run cleanup -w backend -- --yes       # actually delete
 */
import { db } from "../src/config/firebase.js";
import { env } from "../src/config/env.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const confirmed = args.has("--yes");

/** Deletes a collection and everything under it, in batches. */
async function deleteCollection(ref: FirebaseFirestore.CollectionReference): Promise<number> {
  let deleted = 0;
  for (;;) {
    const snap = await ref.limit(300).get();
    if (snap.empty) break;

    for (const doc of snap.docs) {
      // Subcollections are not removed by deleting the parent doc, so recurse first.
      for (const sub of await doc.ref.listCollections()) {
        deleted += await deleteCollection(sub);
      }
    }

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += snap.size;
  }
  return deleted;
}

async function main() {
  const collections = await db.listCollections();

  console.log(`\nProject: ${env.FIREBASE_PROJECT_ID}`);

  if (collections.length === 0) {
    console.log("Firestore is already empty. Nothing to do.\n");
    return;
  }

  console.log("Top-level collections found:");
  for (const col of collections) {
    const count = (await col.count().get()).data().count;
    console.log(`  - ${col.id} (${count} docs)`);
  }

  if (dryRun) {
    console.log("\n--dry-run: nothing was deleted.\n");
    return;
  }

  if (!confirmed) {
    console.log(
      "\nRefusing to delete without confirmation." +
        "\nRe-run with --yes once you are sure:" +
        "\n  npm run cleanup -w backend -- --yes\n",
    );
    process.exitCode = 1;
    return;
  }

  console.log("\nDeleting...");
  let total = 0;
  for (const col of collections) {
    const n = await deleteCollection(col);
    total += n;
    console.log(`  cleared ${col.id}: ${n} docs`);
  }

  console.log(`\nDone. ${total} documents deleted.`);
  console.log("Firebase Auth users were left untouched.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
