import "dotenv/config";
import mongoose from "mongoose";
import { ArticleModel } from "../src/models/Article";
import { getCategoryByName } from "../src/lib/categories";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI manquant dans .env.local");
  process.exit(1);
}

const now = new Date("2026-04-25T08:00:00Z");
const d = (daysAgo: number) =>
  new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

type Seed = {
  slug: string;
  kicker: string;
  category: string;
  title: string;
  titleTrail?: string;
  dek?: string;
  body?: string;
  author: string;
  authorBeat?: string;
  authorBio?: string;
  authorArticleCount?: number;
  imageUrl?: string;
  imageCaption?: string;
  imageCredit?: string;
  readTime?: string;
  wordCount?: number;
  tags?: string[];
  featured?: boolean;
  secondary?: boolean;
  status?: "draft" | "published";
  publishedAt: Date;
};

const articles: Seed[] = [
  // ====================== CLAUDE AI ======================
  {
    slug: "claude-5-sonnet-sortie",
    kicker: "ANALYSE",
    category: "Outils IA",
    title: "Claude 5 Sonnet : ce que change vraiment la mise à jour",
    dek: "Anthropic a publié sa nouvelle génération mid-tier. Au-delà des benchmarks, trois changements opérationnels comptent vraiment.",
    body: `Anthropic a publié hier Claude 5 Sonnet, sa nouvelle version mid-tier qui remplace Claude 4 Sonnet. Au-delà des chiffres communiqués — meilleurs scores sur SWE-bench, MMLU, GPQA — trois changements concrets méritent qu'on s'y attarde.

## Un raisonnement plus tenace

Le nouveau Sonnet ne se contente plus d'enchaîner des étapes : il revient sur ses propres pas quand un raisonnement bute, parfois plusieurs fois. Sur les tâches d'agent en plusieurs heures, le taux de réussite a doublé.

## Computer use natif

L'API computer use sort de bêta. Elle est désormais disponible sur les trois modèles de la gamme, avec des garde-fous de sécurité renforcés.

## Tarification

Le prix d'entrée est inchangé. C'est probablement le plus important.`,
    author: "M. Hadid",
    authorBeat: "Bureau Claude · suivi des sorties Anthropic",
    authorBio:
      "Suit les sorties d'Anthropic et l'écosystème Claude depuis 2024. Spécialisé sur les API et la sûreté.",
    authorArticleCount: 22,
    readTime: "8 min",
    wordCount: 1820,
    tags: [
      "Claude 5",
      "Sonnet",
      "Anthropic",
      "Computer use",
      "Tarification",
    ],
    featured: true,
    publishedAt: d(0),
  },
  {
    slug: "constitutional-ai-2-papers",
    kicker: "RECHERCHE",
    category: "Outils IA",
    title: "Constitutional AI 2.0 : ce que dit le nouveau paper",
    dek: "Anthropic publie une refonte de sa méthode d'alignement. Auto-critique en boucle, principes émergents, et un retour partiel des humains.",
    body: `Le paper, sorti vendredi, n'est pas un simple update : c'est une refonte de l'approche par principes que l'équipe sûreté défend depuis 2022.

## Une boucle d'auto-critique

Le modèle critique ses propres réponses selon des critères qu'il infère lui-même.

## Les humains reviennent

Contrairement à la première version qui voulait s'en passer, RLHF revient — partiellement — pour calibrer les critères.`,
    author: "Claire Benhamou",
    authorBeat: "Bureau recherche · alignement & sûreté",
    readTime: "14 min",
    wordCount: 2950,
    tags: ["Constitutional AI", "RLHF", "Sûreté", "Anthropic"],
    secondary: true,
    publishedAt: d(2),
  },
  {
    slug: "mcp-protocole-standard",
    kicker: "DÉCRYPTAGE",
    category: "Outils IA",
    title: "Le Model Context Protocol s'impose-t-il comme standard ?",
    dek: "MCP, lancé par Anthropic en novembre, gagne du terrain. OpenAI, Google et plusieurs IDE l'intègrent. Tour d'horizon.",
    body: `Lancé fin 2024 par Anthropic, le Model Context Protocol fait son chemin. Cursor l'a adopté en mars, Zed en avril.

## Pourquoi un protocole ?

Connecter un LLM à des outils externes nécessitait jusqu'ici une intégration ad-hoc par éditeur. MCP propose un format unique.

## Adoption

Trois éditeurs majeurs ont rejoint le standard, et plusieurs serveurs MCP officiels existent désormais (filesystem, GitHub, Slack).`,
    author: "S. Mehta",
    readTime: "11 min",
    tags: ["MCP", "Anthropic", "Standards", "Outils"],
    secondary: true,
    publishedAt: d(4),
  },

  // ====================== MODÈLES ======================
  {
    slug: "llama-4-sortie-meta",
    kicker: "ANALYSE",
    category: "Machine Learning",
    title: "Llama 4 : Meta accélère sur l'open-weights",
    dek: "Le poids de la nouvelle génération est librement téléchargeable. Mais la licence change — et les conditions d'usage avec.",
    body: `Meta a publié vendredi les poids de Llama 4. La famille comprend trois tailles : Scout, Maverick, et Behemoth. Tous sous licence communautaire — modifiée.

## Trois tailles

Scout (8B), Maverick (70B), Behemoth (405B). Le mid-range vise la production sur 2x H100.

## La licence change

Plusieurs clauses d'usage ont été ajoutées. Pour les usages commerciaux au-delà de 700 millions d'utilisateurs actifs, la licence devient payante.`,
    author: "P. Lambert",
    authorBeat: "Bureau modèles · sorties & benchmarks",
    readTime: "12 min",
    wordCount: 2100,
    tags: ["Llama", "Meta", "Open-weights", "Licence"],
    secondary: true,
    publishedAt: d(1),
  },
  {
    slug: "mistral-small-3-1-frugalite",
    kicker: "TEST",
    category: "Machine Learning",
    title: "Mistral Small 3.1 : la frugalité comme stratégie",
    dek: "Le laboratoire parisien renforce son créneau : des modèles compacts, performants, déployables sur GPU grand public.",
    body: `Mistral Small 3.1 (24B) tourne sur une RTX 4090. Et pourtant, sur plusieurs benchmarks, il rivalise avec des modèles de 70 milliards de paramètres.

## Performances

Sur MMLU et GPQA, l'écart avec Llama 70B est minime. Pour le multilingue, Mistral garde un avantage.

## Déploiement

L'inférence sur GPU consumer change la donne pour les indépendants et les PME.`,
    author: "P. Lambert",
    readTime: "9 min",
    wordCount: 1450,
    tags: ["Mistral", "Open-weights", "Évaluations"],
    publishedAt: d(3),
  },
  {
    slug: "deepseek-v4-architecture",
    kicker: "DÉCRYPTAGE",
    category: "Machine Learning",
    title: "DeepSeek-V4 : l'architecture MoE pousse encore",
    dek: "Le laboratoire chinois publie une variante à 685 milliards de paramètres avec un coût d'inférence agressif.",
    body: `La sortie de DeepSeek-V4 confirme que le mixture-of-experts est devenu l'architecture de référence pour les très grands modèles fermés ET ouverts.

## Mixture-of-experts pousse

685 milliards de paramètres, mais seulement 37 milliards actifs par token. Le coût d'inférence est compétitif avec des modèles dix fois plus petits.

## Implications

Pour les acteurs cloud, c'est un défi : les économies d'échelle ne suffisent plus à compenser l'efficacité algorithmique.`,
    author: "J. Chen",
    readTime: "10 min",
    wordCount: 1680,
    tags: ["DeepSeek", "MoE", "Open-weights", "Architecture"],
    publishedAt: d(5),
  },

  // ====================== OUTILS ======================
  {
    slug: "cursor-vs-copilot-2026",
    kicker: "COMPARATIF",
    category: "Outils tech",
    title: "Cursor vs Copilot en 2026 : où va vraiment l'écart ?",
    dek: "Deux ans après l'arrivée de Cursor, GitHub Copilot a comblé la majeure partie de son retard. Mais pas tout.",
    body: `Nous avons fait tester les deux outils par six développeurs, sur douze tâches identiques, pendant trois semaines. Verdict.

## Sur les complétions courtes

Match nul. Les deux outils ont des taux de pertinence comparables.

## Sur les tâches multi-fichiers

Cursor garde un avantage sensible. Son Composer reste plus malléable.

## Verdict

Le choix se fait sur l'écosystème (intégration GitHub, prix, équipe).`,
    author: "S. Mehta",
    authorBeat: "Bureau outils · IDE & productivité",
    readTime: "13 min",
    wordCount: 2400,
    tags: ["Cursor", "Copilot", "IDE", "Productivité"],
    publishedAt: d(1),
  },
  {
    slug: "ollama-runtime-local",
    kicker: "TEST",
    category: "Outils tech",
    title: "Ollama, le runtime qui change la donne pour les modèles locaux",
    dek: "Avec moins de friction que vLLM, Ollama est devenu le choix par défaut pour les déploiements internes.",
    body: `En deux ans, Ollama est passé de projet de hackathon à infrastructure de production dans plusieurs DSI. Pourquoi.

## Simplicité

Une commande pour télécharger et lancer un modèle. C'est ce qui manquait à vLLM.

## Limites

Pour les charges de travail à fort QPS, vLLM reste plus performant.`,
    author: "S. Mehta",
    readTime: "8 min",
    wordCount: 1320,
    tags: ["Ollama", "Runtime", "Local", "Open-weights"],
    publishedAt: d(3),
  },
  {
    slug: "agents-frameworks-comparatif",
    kicker: "DÉCRYPTAGE",
    category: "Outils tech",
    title: "Agents : LangChain, LlamaIndex, AutoGen — qui pour quoi ?",
    dek: "Trois frameworks dominent le marché. Leurs philosophies divergent profondément. Tour d'horizon des cas d'usage.",
    body: `Choisir son framework d'agents en 2026 n'est plus une question de fonctionnalités, mais de philosophie d'architecture.

## LangChain

Pour les pipelines linéaires avec orchestration explicite. Mature, opinionated.

## LlamaIndex

Pour les systèmes RAG complexes. Le meilleur écosystème de connecteurs.

## AutoGen

Pour les architectures multi-agents conversationnelles. Plus expérimental, plus puissant.`,
    author: "N. Abitbol",
    readTime: "15 min",
    wordCount: 2700,
    tags: ["LangChain", "LlamaIndex", "AutoGen", "Agents"],
    publishedAt: d(6),
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI!, {
    dbName: process.env.MONGODB_DB || "linfoia",
  });
  console.log("✓ Connecté à MongoDB");

  await ArticleModel.deleteMany({});
  console.log("✓ Ancienne collection effacée");

  const enriched = articles.map((a) => {
    const cat = getCategoryByName(a.category);
    if (!cat) {
      throw new Error(
        `Catégorie inconnue : « ${a.category} » (article ${a.slug})`
      );
    }
    return {
      ...a,
      status: a.status ?? "published",
      section: cat.sectionSlug,
    };
  });
  await ArticleModel.insertMany(enriched);
  console.log(`✓ ${enriched.length} articles insérés`);

  await mongoose.disconnect();
  console.log("✓ Seed terminé");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
