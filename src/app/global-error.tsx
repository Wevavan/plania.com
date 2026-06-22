"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur critique
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-6xl font-bold text-black mb-4">Erreur</h1>
            <p className="text-xl text-gray-700 mb-8">
              Une erreur critique s'est produite.
            </p>

            {error.digest && (
              <p className="text-sm text-gray-500 mb-6 font-mono">
                Code: {error.digest}
              </p>
            )}

            <div className="flex flex-col gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Réessayer
              </button>
              <a
                href="/"
                className="px-6 py-3 border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
