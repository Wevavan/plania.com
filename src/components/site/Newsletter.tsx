export function Newsletter() {
  return (
    <section
      id="newsletter"
      className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 py-14 border-b border-rule items-start"
    >
      <div>
        <span className="font-mono text-[11px] tracking-[2.4px] text-accent font-medium uppercase">
          ↓ Lettre ouverte aux lecteurs
        </span>
        <h2 className="font-serif italic font-normal text-[44px] lg:text-[56px] leading-[1.1] tracking-[-0.5px] text-ink m-0 mt-4 mb-6">
          <span className="text-accent">«</span> Chères lectrices, chers
          lecteurs
          <span className="text-accent"> »</span>
        </h2>
        <p className="text-[16px] leading-[1.6] text-ink-2 m-0 mb-5 text-center">
          Chaque mercredi, une lettre ouverte sur l'actualité de l'IA. Cinq
          lectures, parfois une archive retrouvée, parfois une colère. C'est
          gratuit, et ce sera toujours sans publicité.
        </p>
        <p className="font-serif italic text-[14px] text-muted m-0">
          - La rédaction.
        </p>
      </div>

      <form
        action="/api/newsletter"
        method="post"
        className="border border-ink p-7 self-start w-full"
      >
        <div className="flex justify-between items-center mb-5">
          <span className="font-mono text-[10px] tracking-[2px] text-muted uppercase">
            Pour recevoir la lettre
          </span>
          <span className="text-muted text-[14px]" aria-hidden="true">
            ↗
          </span>
        </div>
        <input
          type="email"
          name="email"
          required
          placeholder="votre.adresse@exemple.fr"
          className="w-full bg-transparent border-b border-rule pb-2 mb-5 font-serif italic text-[15px] outline-none focus:border-ink placeholder:text-muted"
        />
        <label className="flex items-center gap-2 mb-5 font-sans text-[12px] text-ink-3 cursor-pointer">
          <input
            type="checkbox"
            name="hors-series"
            defaultChecked
            className="accent-accent"
          />
          Recevoir aussi les hors-séries (4 par an)
        </label>
        <button
          type="submit"
          className="w-full bg-accent text-paper font-sans text-[14px] font-semibold py-[14px] tracking-[0.2px] hover:bg-accent-warm transition-colors cursor-pointer border-none"
        >
          Recevoir la lettre →
        </button>
        <div className="font-serif italic text-[12px] text-muted mt-3">
          48 000 lecteurs et lectrices ont déjà rejoint.
        </div>
      </form>
    </section>
  );
}
