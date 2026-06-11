export type Token =
  | { type: "h1" | "h2" | "h3"; id: string; text: string; key: string }
  | { type: "p"; text: string; key: string }
  | { type: "code"; lang: string; content: string; key: string }
  | { type: "table"; headers: string[]; rows: string[][]; key: string }
  | { type: "hr"; key: string }
  | { type: "ol"; items: string[]; key: string }
  | { type: "ul"; items: string[]; key: string }
  | { type: "blockquote"; text: string; key: string };
