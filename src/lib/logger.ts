import pino from "pino";

/**
 * Logger structuré avec Pino
 *
 * Utilisation :
 * - logger.info({ userId: 123 }, "User logged in")
 * - logger.error({ err, requestId }, "Upload failed")
 * - logger.warn({ remaining: 0 }, "Rate limit reached")
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),

  // Format de développement plus lisible
  ...(isDevelopment && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),

  // Format de production structuré (JSON)
  ...(!isDevelopment && {
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  }),

  // Timestamp automatique
  timestamp: pino.stdTimeFunctions.isoTime,

  // Informations de base
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA,
  },
});

/**
 * Logger spécifique pour les API routes
 */
export function createApiLogger(route: string) {
  return logger.child({ route });
}

/**
 * Logger pour les erreurs avec contexte enrichi
 */
export function logError(
  error: Error | unknown,
  context: Record<string, unknown> = {}
) {
  const errorDetails = error instanceof Error
    ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      }
    : { error: String(error) };

  logger.error({
    ...context,
    ...errorDetails,
  }, "Error occurred");
}

/**
 * Logger pour les requêtes API avec métriques
 */
export function logApiRequest(params: {
  method: string;
  path: string;
  userId?: string;
  ip?: string;
  duration?: number;
  status?: number;
}) {
  logger.info(params, "API request");
}
