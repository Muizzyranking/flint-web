"use client";

import { useMemo } from "react";
import { tokenise } from "@/lib/markdown-tokenise";
import type { Token } from "@/types/md";
import { RenderToken } from "./inline-render";


export function MarkdownRenderer({ content }: { content: string }) {
  const tokens = useMemo(() => tokenise(content), [content]);

  return (
    <div className="min-w-0">
      {tokens.map((token) => (
        <RenderToken key={token.key} token={token} />
      ))}
    </div>
  );
}

export type TocEntry = { id: string; text: string; level: 1 | 2 | 3 };

export function extractToc(md: string): TocEntry[] {
  const tokens = tokenise(md);
  return tokens
    .filter(
      (t): t is Extract<Token, { type: "h1" | "h2" | "h3" }> =>
        t.type === "h1" || t.type === "h2" || t.type === "h3",
    )
    .map((t) => ({
      id: t.id,
      text: t.text,
      level: Number(t.type[1]) as 1 | 2 | 3,
    }));
}
