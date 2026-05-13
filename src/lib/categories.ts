// Taxonomie : 4 sections × 4 sous-catégories chacune (15 sous-cat au total).
// Une section = grand thème éditorial. Une catégorie = sous-rubrique.
// Article : appartient à une catégorie (et hérite de sa section).

export type CategoryMeta = {
  name: string;
  slug: string;
  sectionSlug: string;
  dek: string;
  editor: string;
  chips: string[];
};

export type SectionMeta = {
  name: string;
  slug: string;
  index: number;
  emoji?: string;
  dek: string;
  categories: CategoryMeta[];
};

const SECTIONS_RAW: (Omit<SectionMeta, "categories"> & {
  categories: Omit<CategoryMeta, "sectionSlug">[];
})[] = [
  {
    name: "Intelligence Artificielle",
    slug: "intelligence-artificielle",
    index: 1,
    emoji: "🤖",
    dek: "Pour parler des IA elles-mêmes : modèles, recherches, outils, et les impacts qu'ils dessinent.",
    categories: [
      {
        name: "IA générative",
        slug: "ia-generative",
        dek: "Texte, image, audio, vidéo : les modèles qui créent et ce que cela change.",
        editor: "M. Vidal",
        chips: ["Tous", "Texte", "Image", "Audio", "Vidéo", "Code"],
      },
      {
        name: "Machine Learning",
        slug: "machine-learning",
        dek: "Architectures, papers, méthodes d'entraînement et évaluations.",
        editor: "P. Lambert",
        chips: [
          "Tous",
          "LLMs",
          "Multimodal",
          "Architectures",
          "Open-weights",
          "Évaluations",
          "Frontier",
        ],
      },
      {
        name: "Outils IA",
        slug: "outils-ia",
        dek: "OpenAI, Anthropic, Google, Mistral : les sorties produits qui comptent.",
        editor: "M. Hadid",
        chips: [
          "Tous",
          "OpenAI",
          "Anthropic",
          "Google DeepMind",
          "Mistral",
          "Meta",
          "xAI",
          "Open-source",
        ],
      },
      {
        name: "Éthique & impacts",
        slug: "ethique-impacts",
        dek: "Biais, surveillance, environnement, droit : les sujets qui dérangent.",
        editor: "F. Said",
        chips: [
          "Tous",
          "Biais",
          "Surveillance",
          "Environnement",
          "Droit d'auteur",
          "Vie privée",
          "Régulation",
        ],
      },
    ],
  },
  {
    name: "Experts & Marché IA",
    slug: "experts-marche-ia",
    index: 2,
    emoji: "🧑‍💼",
    dek: "La cartographie mouvante des talents et des stratégies d'entreprise dans l'IA.",
    categories: [
      {
        name: "Transferts de talents",
        slug: "transferts-talents",
        dek: "Qui part où, et pourquoi : la valse des chercheurs et des ingénieurs.",
        editor: "C. Benhamou",
        chips: [
          "Tous",
          "OpenAI",
          "Anthropic",
          "Google",
          "Meta",
          "Startups",
          "Académique",
        ],
      },
      {
        name: "Recrutements majeurs",
        slug: "recrutements-majeurs",
        dek: "Les annonces qui rebattent les cartes des laboratoires.",
        editor: "J. Chen",
        chips: [
          "Tous",
          "Direction",
          "Recherche",
          "Produit",
          "Sécurité",
          "Politique",
        ],
      },
      {
        name: "Stratégies d'entreprises",
        slug: "strategies-entreprises",
        dek: "Google, Microsoft, Meta, Amazon : leurs paris IA décortiqués.",
        editor: "N. Abitbol",
        chips: [
          "Tous",
          "Google",
          "Microsoft",
          "Meta",
          "Amazon",
          "Apple",
          "Acquisitions",
        ],
      },
      {
        name: "Salaires & tendances",
        slug: "salaires-tendances",
        dek: "Combien on gagne, où, et ce que cela dit du marché.",
        editor: "A. Berthier",
        chips: [
          "Tous",
          "ML Engineer",
          "Researcher",
          "Product",
          "Freelance",
          "France",
          "USA",
          "Asie",
        ],
      },
    ],
  },
  {
    name: "Tutoriels",
    slug: "tutoriels",
    index: 3,
    dek: "Par où commencer, comment faire : nos guides pratiques pour devs, curieux et pros.",
    categories: [
      {
        name: "Tutoriels IA",
        slug: "tutoriels-ia",
        dek: "Chatbots, automation, prompts : apprendre à construire avec l'IA.",
        editor: "S. Mehta",
        chips: [
          "Tous",
          "Chatbots",
          "Automation",
          "Prompts",
          "RAG",
          "Agents",
          "Fine-tuning",
        ],
      },
      {
        name: "Développement",
        slug: "developpement",
        dek: "Coder, déboguer, déployer : les fondamentaux modernes.",
        editor: "T. Okonkwo",
        chips: [
          "Tous",
          "Frontend",
          "Backend",
          "Mobile",
          "DevOps",
          "Bases de données",
          "Tests",
        ],
      },
      {
        name: "Outils tech",
        slug: "outils-tech",
        dek: "IDE, agents, frameworks : ce que les développeurs adoptent.",
        editor: "S. Mehta",
        chips: [
          "Tous",
          "IDE",
          "Agents",
          "Frameworks",
          "Évaluations",
          "Orchestration",
          "Déploiement",
        ],
      },
      {
        name: "Informatique de base",
        slug: "informatique-de-base",
        dek: "Les bases pour comprendre la machine, le réseau, la donnée.",
        editor: "L. Varga",
        chips: [
          "Tous",
          "Système",
          "Réseau",
          "Sécurité",
          "Cloud",
          "Données",
          "Ligne de commande",
        ],
      },
    ],
  },
  {
    name: "Actualités",
    slug: "actualites",
    index: 4,
    emoji: "📰",
    dek: "Les brèves de la semaine : ce qu'il faut savoir, sans hype, sans catastrophisme.",
    categories: [
      {
        name: "Brèves IA",
        slug: "breves-ia",
        dek: "Les annonces, accords et incidents IA en format court.",
        editor: "H. Larivière",
        chips: [
          "Tous",
          "Sorties",
          "Accords",
          "Incidents",
          "Levées",
          "Politique",
        ],
      },
      {
        name: "Nouveautés tech",
        slug: "nouveautes-tech",
        dek: "Tout ce qui n'est pas IA mais compte pour le secteur.",
        editor: "R. Kowalski",
        chips: [
          "Tous",
          "Hardware",
          "Logiciels",
          "Web",
          "Mobile",
          "Crypto",
          "Open-source",
        ],
      },
      {
        name: "Lancements produits",
        slug: "lancements-produits",
        dek: "Les sorties marquantes : à essayer, à surveiller, à oublier.",
        editor: "M. Dupas",
        chips: [
          "Tous",
          "Apps",
          "Services",
          "Plateformes",
          "Hardware",
          "Outils dev",
        ],
      },
    ],
  },
];

export const ALL_SECTIONS: SectionMeta[] = SECTIONS_RAW.map((s) => ({
  ...s,
  categories: s.categories.map((c) => ({
    ...c,
    sectionSlug: s.slug,
  })),
}));

export const ALL_CATEGORIES: CategoryMeta[] = ALL_SECTIONS.flatMap(
  (s) => s.categories
);

export function getSectionBySlug(slug: string): SectionMeta | null {
  return ALL_SECTIONS.find((s) => s.slug === slug) ?? null;
}

export function getCategoryBySlug(slug: string): CategoryMeta | null {
  return ALL_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getCategoryByName(name: string): CategoryMeta | null {
  return ALL_CATEGORIES.find((c) => c.name === name) ?? null;
}

export function getSectionForCategoryName(
  categoryName: string
): SectionMeta | null {
  const cat = getCategoryByName(categoryName);
  if (!cat) return null;
  return getSectionBySlug(cat.sectionSlug);
}

export function categoryUrl(category: CategoryMeta): string {
  return `/${category.sectionSlug}/${category.slug}`;
}

export function categoryUrlByName(name: string): string {
  const cat = getCategoryByName(name);
  return cat ? categoryUrl(cat) : "/";
}

export function sectionUrl(section: SectionMeta): string {
  return `/${section.slug}`;
}

// Compatibilité historique - slugify utilisé par les anciens composants.
export function categorySlug(name: string): string {
  const cat = getCategoryByName(name);
  if (cat) return cat.slug;
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
