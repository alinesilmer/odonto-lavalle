/**
 * Reconciles Firebase Auth with Firestore after a cleanup.
 *
 * Because `cleanup-firestore` keeps Auth users but deletes their patient
 * documents, every surviving login would otherwise have no profile. This walks
 * every Auth user and:
 *   - sets the `role` custom claim if missing (defaults to "patient")
 *   - recreates a minimal patients/{uid} document for patients
 *
 * Promote an admin by email:
 *   npm run seed -w backend -- --admin=admin@lavalle.com
 */
import { auth } from "../src/config/firebase.js";
import { patientsCol } from "../src/services/patients.service.js";

const adminEmails = new Set(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--admin="))
    .map((a) => a.slice("--admin=".length).toLowerCase()),
);

async function main() {
  let created = 0;
  let claimed = 0;
  let pageToken: string | undefined;

  do {
    const page = await auth.listUsers(1000, pageToken);
    pageToken = page.pageToken;

    for (const user of page.users) {
      const email = (user.email ?? "").toLowerCase();
      const shouldBeAdmin = adminEmails.has(email);
      const currentRole = user.customClaims?.role as string | undefined;
      const role = shouldBeAdmin ? "admin" : (currentRole ?? "patient");

      if (currentRole !== role) {
        await auth.setCustomUserClaims(user.uid, { ...user.customClaims, role });
        claimed += 1;
        console.log(`  claim  ${email} -> ${role}`);
      }

      if (role !== "patient") continue;

      const ref = patientsCol().doc(user.uid);
      if ((await ref.get()).exists) continue;

      const now = new Date();
      await ref.set({
        uid: user.uid,
        fullName: user.displayName ?? email.split("@")[0] ?? "Paciente",
        // Unknown after a wipe; the patient completes these in Configuración.
        dni: "",
        gender: "otro",
        email,
        phone: "",
        birthDate: "",
        insurance: "ninguna",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      created += 1;
      console.log(`  create patients/${user.uid} (${email})`);
    }
  } while (pageToken);

  console.log(`\nDone. ${created} patient docs created, ${claimed} role claims updated.`);
  if (adminEmails.size === 0) {
    console.log("No --admin= passed, so nobody was promoted. Existing admin claims were kept.\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
