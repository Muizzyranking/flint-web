import type { Token } from "@/types/md";

export function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  let offset = 0;

  return parts.map((part) => {
    const key = `${offset}-${part}`;
    offset += part.length;

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-card-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={key}
          href={linkMatch[2]}
          className="text-accent underline underline-offset-2 transition-colors hover:text-accent/75"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export function RenderToken({ token }: { token: Token }) {
  switch (token.type) {
    case "h1":
      return (
        <h1
          id={token.id}
          className="mt-10 mb-4 scroll-mt-28 text-3xl font-bold tracking-tight text-foreground first:mt-0"
        >
          {renderInline(token.text)}
        </h1>
      );
    case "h2":
      return (
        <h2
          id={token.id}
          className="mt-10 mb-3 scroll-mt-28 border-b border-border pb-2 text-2xl font-bold tracking-tight text-foreground"
        >
          {renderInline(token.text)}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={token.id}
          className="mt-7 mb-2 scroll-mt-28 text-base font-semibold text-card-foreground"
        >
          {renderInline(token.text)}
        </h3>
      );
    case "p":
      return (
        <p className="mb-3 text-sm leading-7 text-muted-foreground">
          {renderInline(token.text)}
        </p>
      );
    case "blockquote":
      return (
        <blockquote className="my-4 border-l-2 border-accent/50 bg-card px-4 py-3 font-mono text-[13px] italic text-muted-foreground">
          {renderInline(token.text)}
        </blockquote>
      );
    case "hr":
      return <hr className="my-8 border-border" />;
    case "ol":
      return (
        <ol className="mb-3 list-decimal space-y-1.5 pl-5">
          {token.items.map((item) => (
            <li
              key={item}
              className="pl-1 text-sm leading-7 text-muted-foreground"
            >
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case "ul":
      return (
        <ul className="mb-3 space-y-1.5 pl-4">
          {token.items.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-7 text-muted-foreground"
            >
              <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="my-4 overflow-hidden rounded-lg border border-border bg-code shadow-sm shadow-shadow-color">
          <div className="border-b border-border bg-muted/40 px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {token.lang}
            </span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-code-foreground">
            <code>{token.content}</code>
          </pre>
        </div>
      );
    case "table":
      return (
        <div className="my-4 overflow-x-auto rounded-lg border border-border bg-card shadow-sm shadow-shadow-color">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {token.headers.map((h) => (
                  <th
                    key={`${token.key}-header-${h}`}
                    className="px-4 py-2.5 font-semibold text-muted-foreground"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {token.rows.map((row) => (
                <tr
                  key={`${token.key}-row-${row.join("|")}`}
                  className="transition-colors hover:bg-muted/35"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${token.key}-${token.headers[cellIndex] ?? "cell"}-${cell}`}
                      className="px-4 py-2.5 text-muted-foreground"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
