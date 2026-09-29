/**
 * Copies the site's original FAQ, services and obras sociales into Firestore,
 * like the dashboard's "Cargar el contenido actual" button. A collection that
 * already has documents is left untouched, so this is safe to re-run.
 *
 *   npm run seed:content -w backend
 */
import { CONTENT_KINDS, DEFAULT_CONTENT } from "@odonto/shared";
import { collections, db } from "../src/config/firebase.js";

async function main() {
  for (const kind of CONTENT_KINDS) {
    const col = db.collection(collections[kind]);
    if (!(await col.limit(1).get()).empty) {
      console.log(`${kind}: ya tiene contenido, no se modifica`);
      continue;
    }
    const batch = db.batch();
    for (const item of DEFAULT_CONTENT[kind]) batch.set(col.doc(), item);
    await batch.commit();
    console.log(`${kind}: ${DEFAULT_CONTENT[kind].length} cargados`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
