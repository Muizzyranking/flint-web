import { readFile } from "node:fs/promises";
import path from "node:path";
import { ArchitectureClient } from "@/components/architecture/client";
import { Navbar } from "@/components/layout/navbar";

const ARCHITECTURE_MD_PATHS = [
  path.join(process.cwd(), "src/app/architecture/architecture.md"),
  path.join(process.cwd(), "public/architecture.md"),
];

async function readArchitectureMarkdown() {
  for (const filePath of ARCHITECTURE_MD_PATHS) {
    try {
      return await readFile(filePath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  return "# Flint Architecture\n\nAdd `src/app/architecture/architecture.md` to render this page.";
}

function stripInlineTableOfContents(markdown: string) {
  return markdown
    .replace(/\n## Table of Contents\s*\n[\s\S]*?(?=\n## )/, "\n")
    .replace(/\n---\s*\n---/g, "\n---");
}

export default async function ArchitecturePage() {
  const content = stripInlineTableOfContents(await readArchitectureMarkdown());

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <ArchitectureClient content={content} />
    </div>
  );
}
