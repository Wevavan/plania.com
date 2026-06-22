import { z } from "zod";
import { getCategoryByName } from "@/lib/categories";

/**
 * Schémas de validation Zod pour les API
 */

// Validation d'email
export const emailSchema = z
  .string()
  .email("Email invalide")
  .toLowerCase()
  .trim()
  .min(1, "Email requis")
  .max(255, "Email trop long");

// Validation de slug (URL-friendly)
export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets"
  )
  .min(1, "Slug requis")
  .max(200, "Slug trop long");

// Catégorie = nom d'une rubrique réelle (source de vérité : lib/categories).
export const categorySchema = z
  .string()
  .trim()
  .min(1, "Rubrique requise")
  .refine((name) => getCategoryByName(name) !== null, {
    message: "Rubrique inconnue",
  });

// Statut d'article
export const articleStatusSchema = z.enum(["draft", "published", "archived"]);

// Schéma pour créer un article
export const createArticleSchema = z.object({
  slug: slugSchema,

  kicker: z
    .string()
    .trim()
    .min(1, "Kicker requis")
    .max(100, "Kicker trop long (max 100 caractères)"),

  category: categorySchema,

  section: z.string().trim().max(100).default(""),

  title: z
    .string()
    .trim()
    .min(1, "Titre requis")
    .max(200, "Titre trop long (max 200 caractères)"),

  titleTrail: z.string().trim().max(200).default(""),

  dek: z
    .string()
    .trim()
    .max(500, "Dek trop long (max 500 caractères)")
    .default(""),

  body: z
    .string()
    .trim()
    .max(100000, "Corps trop long (max 100 000 caractères)")
    .default(""),

  author: z
    .string()
    .trim()
    .min(1, "Auteur requis")
    .max(100, "Nom d'auteur trop long"),

  authorBeat: z.string().trim().max(100).default(""),

  authorBio: z.string().trim().max(500).default(""),

  imageUrl: z
    .string()
    .url("URL d'image invalide")
    .optional()
    .or(z.literal(""))
    .default(""),

  imageAlt: z.string().trim().max(200).default(""),

  imageCaption: z.string().trim().max(300).default(""),

  imageCredit: z.string().trim().max(100).default(""),

  thumbnailUrl: z
    .string()
    .url("URL de miniature invalide")
    .optional()
    .or(z.literal(""))
    .default(""),

  thumbnailAlt: z.string().trim().max(200).default(""),

  readTime: z.string().trim().max(20).default(""),

  wordCount: z.number().int().min(0).default(0),

  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(10, "Maximum 10 tags")
    .default([]),

  featured: z.boolean().default(false),

  secondary: z.boolean().default(false),

  status: z.enum(["draft", "published"]).default("published"),

  publishedAt: z
    .string()
    .datetime()
    .optional()
    .or(z.date())
    .transform((val) => (val ? new Date(val) : new Date())),
});

// Schéma pour mettre à jour un article (tous les champs optionnels)
export const updateArticleSchema = createArticleSchema.partial();

// Schéma pour inscription newsletter
export const newsletterSubscriptionSchema = z.object({
  email: emailSchema,
  horsSeries: z.boolean().default(true),
});

// Schéma pour upload d'image
export const imageUploadSchema = z.object({
  kind: z.enum(["hero", "thumbnail"]).default("hero"),
});

/**
 * Helper pour valider et retourner des erreurs formatées
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Formatte les erreurs Zod en objet plus lisible
  const errors: Record<string, string[]> = {};
  result.error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return { success: false, errors };
}
