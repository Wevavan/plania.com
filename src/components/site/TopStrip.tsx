const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const DAYS_FR = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

function formatTodayFr() {
  const d = new Date();
  return `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

export function TopStrip() {
  return (
    <div className="font-mono text-[11px] tracking-[0.3px] text-muted uppercase py-[14px] pb-[10px] border-b border-rule">
      {formatTodayFr()}
    </div>
  );
}
