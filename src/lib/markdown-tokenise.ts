import type { Token } from "@/types/md";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function tokenise(md: string): Token[] {
  const lines = md.split("\n");
  const tokens: Token[] = [];
  let i = 0;

  function tokenKey(type: Token["type"], lineNumber: number, text = "") {
    return `${lineNumber}-${type}-${slugify(text).slice(0, 48)}`;
  }

  while (i < lines.length) {
    const line = lines[i];
    const lineNumber = i;

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const content: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        content.push(lines[i]);
        i++;
      }
      tokens.push({
        type: "code",
        lang,
        content: content.join("\n"),
        key: tokenKey("code", lineNumber, lang),
      });
      i++;
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      tokens.push({ type: "hr", key: tokenKey("hr", lineNumber) });
      i++;
      continue;
    }

    // Headings
    const h1 = line.match(/^# (.+)/);
    if (h1) {
      tokens.push({
        type: "h1",
        id: slugify(h1[1]),
        text: h1[1],
        key: tokenKey("h1", lineNumber, h1[1]),
      });
      i++;
      continue;
    }
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      tokens.push({
        type: "h2",
        id: slugify(h2[1]),
        text: h2[1],
        key: tokenKey("h2", lineNumber, h2[1]),
      });
      i++;
      continue;
    }
    const h3 = line.match(/^### (.+)/);
    if (h3) {
      tokens.push({
        type: "h3",
        id: slugify(h3[1]),
        text: h3[1],
        key: tokenKey("h3", lineNumber, h3[1]),
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      tokens.push({
        type: "blockquote",
        text: line.slice(2),
        key: tokenKey("blockquote", lineNumber, line),
      });
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      tokens.push({ type: "ol", items, key: tokenKey("ol", lineNumber) });
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      tokens.push({ type: "ul", items, key: tokenKey("ul", lineNumber) });
      continue;
    }

    // Table (GitHub-flavoured)
    if (line.includes("|") && lines[i + 1]?.includes("---")) {
      const headers = line
        .split("|")
        .map((h) => h.trim())
        .filter(Boolean);
      i += 2; // skip separator row
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .map((c) => c.trim())
            .filter(Boolean),
        );
        i++;
      }
      tokens.push({
        type: "table",
        headers,
        rows,
        key: tokenKey("table", lineNumber, headers.join("-")),
      });
      continue;
    }

    // Non-empty paragraph
    if (line.trim()) {
      tokens.push({
        type: "p",
        text: line.trim(),
        key: tokenKey("p", lineNumber, line),
      });
    }

    i++;
  }

  return tokens;
}
