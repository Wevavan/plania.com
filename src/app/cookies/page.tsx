import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Politique cookies",
  description:
    "Quels cookies utilise Planète IA, à quoi ils servent, comment les refuser.",
};

export default function CookiesPage() {
  return (
    <SiteShell>
      <article className="py-12 max-w-[780px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Politique cookies
        </span>
        <h1 className="font-serif text-[56px] font-bold leading-[1.05] tracking-[-1px] m-0 mt-4 mb-8 balance">
          Cookies utilisés par Planète IA.
        </h1>

        <div className="prose-article">
          <p className="text-[19px] leading-[1.55] text-ink-2 m-0 mb-8 max-w-[640px]">
            Nous n'utilisons que des cookies strictement nécessaires au
            fonctionnement du site. Aucun cookie publicitaire, aucun pixel de
            tracking, aucune revente de données.
          </p>

          <h2>Les cookies en place</h2>
          <table className="w-full border border-rule font-sans text-[13px] my-6">
            <thead className="bg-stripe">
              <tr>
                <th className="text-left p-3 border-b border-rule">Nom</th>
                <th className="text-left p-3 border-b border-rule">Rôle</th>
                <th className="text-left p-3 border-b border-rule">Durée</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[12px]">
              <tr>
                <td className="p-3 border-b border-rule">authjs.session-token</td>
                <td className="p-3 border-b border-rule font-sans">
                  Maintien de la session après connexion
                </td>
                <td className="p-3 border-b border-rule">30 jours</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-rule">authjs.csrf-token</td>
                <td className="p-3 border-b border-rule font-sans">
                  Protection contre les attaques CSRF
                </td>
                <td className="p-3 border-b border-rule">Session</td>
              </tr>
              <tr>
                <td className="p-3">pi_cookie_consent</td>
                <td className="p-3 font-sans">
                  Mémorise votre choix sur le bandeau cookies
                </td>
                <td className="p-3">6 mois</td>
              </tr>
            </tbody>
          </table>

          <h2>Vos droits</h2>
          <p>
            Vous pouvez à tout moment supprimer ces cookies via les paramètres
            de votre navigateur. La suppression du cookie de session vous
            déconnectera. Aucune donnée n'est partagée avec des tiers à des fins
            publicitaires.
          </p>

          <h2>Sous-traitants techniques</h2>
          <p>
            Le site repose sur les prestataires suivants, qui peuvent traiter
            des données pour assurer son fonctionnement :
          </p>
          <ul>
            <li>
              <strong>Vercel</strong> (hébergement) — logs serveur
            </li>
            <li>
              <strong>MongoDB Atlas</strong> (base de données) — comptes,
              articles, abonnés newsletter
            </li>
            <li>
              <strong>Cloudinary</strong> (images)
            </li>
            <li>
              <strong>Resend</strong> (envoi d'emails)
            </li>
            <li>
              <strong>Google</strong> (authentification OAuth, optionnelle)
            </li>
          </ul>

          <p className="font-serif italic text-[14px] text-muted mt-12">
            Dernière mise à jour : mai 2026.
          </p>
        </div>
      </article>
      <SiteFooter />
    </SiteShell>
  );
}
