import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Planète IA collecte, utilise et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <SiteShell>
      <article className="py-12 max-w-[780px] mx-auto">
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          Vie privée
        </span>
        <h1 className="font-serif text-[56px] font-bold leading-[1.05] tracking-[-1px] m-0 mt-4 mb-8 balance">
          Politique de confidentialité.
        </h1>

        <div className="prose-article">
          <p className="text-[19px] leading-[1.55] text-ink-2 m-0 mb-8 max-w-[640px]">
            Planète IA est édité à titre non commercial. Nous limitons la
            collecte aux données strictement nécessaires au fonctionnement du
            site et à l'envoi de la newsletter.
          </p>

          <h2>Qui est responsable du traitement ?</h2>
          <p>
            <strong>Wev</strong>, éditeur du site, agissant comme responsable
            de traitement.
            <br />
            Contact :{" "}
            <a href="mailto:wev.ia.org@gmail.com">wev.ia.org@gmail.com</a>
          </p>

          <h2>Quelles données collectons-nous ?</h2>
          <h3>À l'inscription à la newsletter</h3>
          <p>
            Adresse email uniquement. Nous générons un jeton d'opt-in et un
            jeton de désinscription.
          </p>
          <h3>À la création d'un compte</h3>
          <p>
            Email et - si connexion via Google - nom et photo de profil
            renvoyés par Google. Aucune autre donnée n'est collectée.
          </p>
          <h3>À l'envoi du formulaire contact</h3>
          <p>
            Nom, email et message. Ces informations transitent par email
            uniquement (Resend) et ne sont pas stockées en base.
          </p>
          <h3>Logs techniques</h3>
          <p>
            Notre hébergeur (Vercel) conserve des logs de requêtes (adresse IP,
            user-agent, date) pendant une durée limitée à des fins de sécurité
            et de diagnostic.
          </p>

          <h2>Pourquoi collectons-nous ces données ?</h2>
          <ul>
            <li>
              <strong>Newsletter</strong> : vous envoyer la lettre du mercredi
              et les emails de service (confirmation, désinscription)
            </li>
            <li>
              <strong>Compte</strong> : vous identifier pour accéder aux
              articles et gérer votre profil
            </li>
            <li>
              <strong>Contact</strong> : vous répondre
            </li>
            <li>
              <strong>Logs</strong> : assurer la sécurité et la stabilité du
              site
            </li>
          </ul>

          <h2>Combien de temps les conservons-nous ?</h2>
          <ul>
            <li>
              <strong>Email newsletter</strong> : tant que vous êtes abonné·e
              ; supprimé après désinscription (lien en bas de chaque envoi)
            </li>
            <li>
              <strong>Compte</strong> : tant qu'il existe ; suppression
              complète possible sur simple demande
            </li>
            <li>
              <strong>Logs</strong> : durée standard Vercel (30 jours)
            </li>
          </ul>

          <h2>Avec qui partageons-nous vos données ?</h2>
          <p>
            Nous ne vendons jamais vos données. Elles sont traitées uniquement
            par les sous-traitants techniques nécessaires au fonctionnement
            du site :
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (États-Unis) - hébergement,{" "}
              <a
                href="https://vercel.com/legal/dpa"
                target="_blank"
                rel="noopener noreferrer"
              >
                DPA
              </a>
            </li>
            <li>
              <strong>MongoDB Atlas</strong> (Union européenne) - stockage des
              comptes, articles, abonnés newsletter
            </li>
            <li>
              <strong>Resend</strong> (Irlande, UE) - envoi des emails
              (newsletter, magic link, contact)
            </li>
            <li>
              <strong>Cloudinary</strong> (États-Unis) - stockage et livraison
              des images
            </li>
            <li>
              <strong>Google LLC</strong> (États-Unis) - authentification OAuth
              uniquement si vous choisissez « Se connecter avec Google »
            </li>
          </ul>
          <p>
            Les transferts vers les États-Unis sont encadrés par les{" "}
            <em>Standard Contractual Clauses</em> de la Commission européenne
            ou par le <em>Data Privacy Framework</em> selon le sous-traitant.
          </p>

          <h2>Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>
              <strong>Accès</strong> aux données que nous détenons sur vous
            </li>
            <li>
              <strong>Rectification</strong> en cas d'erreur
            </li>
            <li>
              <strong>Effacement</strong> (« droit à l'oubli »)
            </li>
            <li>
              <strong>Opposition</strong> au traitement
            </li>
            <li>
              <strong>Portabilité</strong> (recevoir vos données dans un format
              lisible)
            </li>
          </ul>
          <p>
            Pour exercer un droit, écrivez à{" "}
            <a href="mailto:wev.ia.org@gmail.com">wev.ia.org@gmail.com</a> en
            précisant la demande. Vous recevrez une réponse sous trente jours.
          </p>
          <p>
            Vous pouvez également déposer une réclamation auprès de la{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              CNIL
            </a>{" "}
            si vous estimez que vos droits ne sont pas respectés.
          </p>

          <h2>Cookies</h2>
          <p>
            Voir la <a href="/cookies">politique cookies</a> pour le détail
            des cookies utilisés.
          </p>

          <p className="font-serif italic text-[14px] text-muted mt-12">
            Dernière mise à jour : mai 2026.
          </p>
        </div>
      </article>
      <SiteFooter />
    </SiteShell>
  );
}
