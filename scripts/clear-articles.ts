import "dotenv/config";
import mongoose from "mongoose";
import { ArticleModel } from "../src/models/Article";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI manquant dans .env.local");
  process.exit(1);
}

const CONFIRM = process.argv.includes("--confirm");

async function main() {
  await mongoose.connect(MONGODB_URI!);

  const all = await ArticleModel.find(
    {},
    { slug: 1, title: 1, status: 1 }
  ).lean();

  console.log(`\n${all.length} article(s) en base :`);
  for (const a of all) {
    console.log(`  - [${a.status}] ${a.title}  (${a.slug})`);
  }

  if (!CONFIRM) {
    console.log(
      "\n(DRY RUN) Aucune suppression. Relance avec --confirm pour tout supprimer."
    );
  } else {
    const res = await ArticleModel.deleteMany({});
    console.log(`\n🗑️  ${res.deletedCount} article(s) supprimé(s).`);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
