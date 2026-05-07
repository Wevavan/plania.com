export type Section = { n: string; id: string; title: string };
export type Block =
  | { kind: "paragraph"; text: string; lead?: boolean }
  | { kind: "heading"; n: string; id: string; title: string }
  | { kind: "subheading"; id: string; title: string }
  | { kind: "pullquote"; text: string; attribution?: string }
  | { kind: "html"; html: string };

function slugifyId(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function parseBody(body: string): { blocks: Block[]; toc: Section[] } {
  const blocks: Block[] = [];
  const toc: Section[] = [];
  if (!body) return { blocks, toc };

  const raw = body.trim().split(/\n{2,}/);
  let sectionIndex = 0;
  let paraIndex = 0;

  for (const chunk of raw) {
    const t = chunk.trim();
    if (!t) continue;

    if (t.startsWith("<")) {
      blocks.push({ kind: "html", html: t });
      continue;
    }

    if (t.startsWith("### ")) {
      const title = t.replace(/^###\s+/, "").trim();
      const id = slugifyId(title) || `sub-${blocks.length}`;
      blocks.push({ kind: "subheading", id, title });
      continue;
    }

    if (t.startsWith("## ")) {
      sectionIndex += 1;
      const title = t.replace(/^##\s+/, "").trim();
      const n = String(sectionIndex).padStart(2, "0");
      const id = slugifyId(title) || `section-${n}`;
      blocks.push({ kind: "heading", n, id, title });
      toc.push({ n, id, title });
      continue;
    }

    if (t.startsWith("> ")) {
      // pullquote. Attribution = trailing "— ..." line
      const lines = t
        .split(/\n/)
        .map((l) => l.replace(/^>\s?/, "").trim())
        .filter(Boolean);
      let attribution: string | undefined;
      const last = lines[lines.length - 1];
      if (last && /^[—–-]\s/.test(last)) {
        attribution = last.replace(/^[—–-]\s*/, "").trim();
        lines.pop();
      }
      blocks.push({
        kind: "pullquote",
        text: lines.join(" "),
        attribution,
      });
      continue;
    }

    paraIndex += 1;
    blocks.push({
      kind: "paragraph",
      text: t,
      lead: paraIndex === 1,
    });
  }

  return { blocks, toc };
}

export function renderInline(s: string): string {
  // Minimal inline markdown: **strong**, *em*, [text](url), backticks -> code
  let out = escapeHtml(s);
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="article-inline-link">$1</a>'
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function truncateBody(body: string, maxBlocks: number): string {
  if (!body) return "";
  const chunks = body.trim().split(/\n{2,}/);
  return chunks.slice(0, Math.max(0, maxBlocks)).join("\n\n");
}

export function halfBody(body: string): string {
  if (!body) return "";
  const chunks = body.trim().split(/\n{2,}/);
  let count = Math.max(1, Math.ceil((chunks.length * 2) / 3));
  // Évite de finir sur un titre orphelin (## Section sans son contenu)
  while (count > 1 && chunks[count - 1].trim().startsWith("## ")) {
    count -= 1;
  }
  return chunks.slice(0, count).join("\n\n");
}
