import "dotenv/config";
import mongoose from "mongoose";
import { SubscriberModel } from "../src/models/Subscriber";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI manquant dans .env.local");
  process.exit(1);
}

// Email ciblé passé en argument (sinon rien n'est supprimé).
const email = process.argv.find((a) => a.includes("@"))?.toLowerCase();
const CONFIRM = process.argv.includes("--confirm");

async function main() {
  if (!email) {
    console.error(
      "Usage : tsx scripts/delete-subscriber.ts <email> [--confirm]"
    );
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI!);

  const match = await SubscriberModel.find(
    { email },
    { email: 1, confirmedAt: 1, unsubscribedAt: 1, createdAt: 1 }
  ).lean();

  console.log(`\n${match.length} abonné(s) correspondant à « ${email} » :`);
  for (const s of match) {
    const status = s.confirmedAt
      ? "confirmé"
      : s.unsubscribedAt
        ? "désinscrit"
        : "en attente";
    console.log(`  - ${s.email}  [${status}]`);
  }

  if (!CONFIRM) {
    console.log("\n(DRY RUN) Relance avec --confirm pour supprimer.");
  } else {
    const res = await SubscriberModel.deleteMany({ email });
    console.log(`\n🗑️  ${res.deletedCount} abonné(s) supprimé(s).`);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
