"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur côté client (peut être envoyé à un service de monitoring)
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-serif font-bold text-ink mb-4">Erreur</h1>
        <p className="text-xl text-ink/70 mb-8">
          Une erreur inattendue s'est produite.
        </p>

        {error.digest && (
          <p className="text-sm text-ink/50 mb-6 font-mono">
            Code: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-ink text-paper rounded-lg hover:bg-ink/90 transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-ink text-ink rounded-lg hover:bg-ink/5 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>

        <p className="text-sm text-ink/50 mt-8">
          Si le problème persiste, veuillez nous contacter.
        </p>
      </div>
    </div>
  );
}
