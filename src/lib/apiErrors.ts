import { NextResponse } from "next/server";

/**
 * Codes d'erreur standardisés pour l'API
 */
export enum ApiErrorCode {
  // Erreurs de validation (400)
  INVALID_REQUEST = "INVALID_REQUEST",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  MISSING_FIELD = "MISSING_FIELD",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_SLUG = "INVALID_SLUG",

  // Erreurs d'authentification (401)
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_TOKEN = "INVALID_TOKEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Erreurs d'autorisation (403)
  FORBIDDEN = "FORBIDDEN",
  ADMIN_ONLY = "ADMIN_ONLY",

  // Erreurs de ressource (404)
  NOT_FOUND = "NOT_FOUND",
  ARTICLE_NOT_FOUND = "ARTICLE_NOT_FOUND",

  // Erreurs de conflit (409)
  ALREADY_EXISTS = "ALREADY_EXISTS",
  SLUG_EXISTS = "SLUG_EXISTS",
  EMAIL_EXISTS = "EMAIL_EXISTS",

  // Erreurs de rate limiting (429)
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // Erreurs serveur (500)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  UPLOAD_ERROR = "UPLOAD_ERROR",
  EMAIL_SEND_ERROR = "EMAIL_SEND_ERROR",
}

/**
 * Structure standardisée des réponses d'erreur
 */
interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
  };
}

/**
 * Crée une réponse d'erreur standardisée
 */
export function createApiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: Record<string, unknown>,
  headers?: HeadersInit
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details && { details }),
        timestamp: new Date().toISOString(),
      },
    },
    { status, headers }
  );
}

/**
 * Erreurs préconfigurées courantes
 */
export const ApiErrors = {
  // 400 Bad Request
  invalidRequest: (message = "Requête invalide", details?: Record<string, unknown>) =>
    createApiError(ApiErrorCode.INVALID_REQUEST, message, 400, details),

  validationError: (errors: Record<string, string[]>) =>
    createApiError(
      ApiErrorCode.VALIDATION_ERROR,
      "Erreur de validation",
      400,
      { errors }
    ),

  missingField: (field: string) =>
    createApiError(
      ApiErrorCode.MISSING_FIELD,
      `Champ manquant : ${field}`,
      400,
      { field }
    ),

  invalidEmail: () =>
    createApiError(ApiErrorCode.INVALID_EMAIL, "Email invalide", 400),

  // 401 Unauthorized
  unauthorized: (message = "Non authentifié") =>
    createApiError(ApiErrorCode.UNAUTHORIZED, message, 401),

  // 403 Forbidden
  forbidden: (message = "Accès refusé") =>
    createApiError(ApiErrorCode.FORBIDDEN, message, 403),

  adminOnly: () =>
    createApiError(
      ApiErrorCode.ADMIN_ONLY,
      "Accès réservé aux administrateurs",
      403
    ),

  // 404 Not Found
  notFound: (resource = "Ressource") =>
    createApiError(ApiErrorCode.NOT_FOUND, `${resource} introuvable`, 404),

  articleNotFound: (slug?: string) =>
    createApiError(
      ApiErrorCode.ARTICLE_NOT_FOUND,
      "Article introuvable",
      404,
      slug ? { slug } : undefined
    ),

  // 409 Conflict
  alreadyExists: (resource = "Ressource", identifier?: string) =>
    createApiError(
      ApiErrorCode.ALREADY_EXISTS,
      `${resource} existe déjà`,
      409,
      identifier ? { identifier } : undefined
    ),

  slugExists: (slug: string) =>
    createApiError(
      ApiErrorCode.SLUG_EXISTS,
      "Un article avec ce slug existe déjà",
      409,
      { slug }
    ),

  // 429 Rate Limit
  rateLimitExceeded: (
    limit: number,
    remaining: number,
    reset: number
  ) =>
    createApiError(
      ApiErrorCode.RATE_LIMIT_EXCEEDED,
      "Trop de tentatives. Veuillez réessayer plus tard.",
      429,
      { limit, remaining, resetAt: new Date(reset).toISOString() },
      {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      }
    ),

  // 500 Internal Server Error
  internalError: (message = "Erreur interne du serveur") =>
    createApiError(ApiErrorCode.INTERNAL_ERROR, message, 500),

  databaseError: (operation?: string) =>
    createApiError(
      ApiErrorCode.DATABASE_ERROR,
      `Erreur de base de données${operation ? ` lors de ${operation}` : ""}`,
      500
    ),

  uploadError: (message = "Erreur lors de l'upload") =>
    createApiError(ApiErrorCode.UPLOAD_ERROR, message, 500),

  emailSendError: () =>
    createApiError(
      ApiErrorCode.EMAIL_SEND_ERROR,
      "Erreur lors de l'envoi de l'email",
      500
    ),
};
