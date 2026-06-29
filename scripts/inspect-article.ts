import "dotenv/config";
import mongoose from "mongoose";
import { ArticleModel } from "../src/models/Article";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI manquant");
  process.exit(1);
}

const slug = process.argv.slice(2).find((a) => /^[a-z0-9-]+$/.test(a)) || "";

async function main() {
  await mongoose.connect(MONGODB_URI!);
  const a = await ArticleModel.findOne(slug ? { slug } : {})
    .sort({ updatedAt: -1 })
    .lean();
  if (!a) {
    console.log("Aucun article trouvé.");
    await mongoose.disconnect();
    return;
  }
  const body = String(a.body || "");
  console.log("Slug :", a.slug);
  console.log("Longueur body :", body.length);
  console.log("Contient class align- :", /class="[^"]*align-/.test(body));
  console.log("Contient style width :", /style="[^"]*width/.test(body));
  console.log("Nb <h2> :", (body.match(/<h2/gi) || []).length);
  console.log("Nb <h3> :", (body.match(/<h3/gi) || []).length);
  console.log("Format détecté :", /<(p|h2|h3|ul|img)/i.test(body) ? "HTML" : "Markdown/texte");
  console.log("\n--- Extrait autour de la 1re image ---");
  const i = body.search(/<img/i);
  console.log(i >= 0 ? body.slice(i, i + 220) : "(aucune balise <img>)");
  console.log("\n--- 400 premiers caractères ---");
  console.log(body.slice(0, 400));
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
