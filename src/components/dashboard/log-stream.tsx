"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { formatDateTime, truncateMiddle } from "@/lib/dashboard-format";
import type { JobLog } from "@/lib/dashboard-types";
import { JsonBlock, Panel } from "./ui";

type LogStreamDensity = "comfortable" | "compact";

const eventTones: Record<
  string,
  {
    label: string;
    rail: string;
    badge: string;
    icon: React.ReactNode;
  }
> = {
  job_created: {
    label: "Created",
    rail: "bg-secondary",
    badge: "border-secondary/35 bg-secondary/10 text-secondary",
    icon: <Clock3 className="size-3.5" />,
  },
  job_started: {
    label: "Started",
    rail: "bg-accent",
    badge: "border-accent/35 bg-accent-soft text-accent",
    icon: <RefreshCw className="size-3.5" />,
  },
  job_retry_attempted: {
    label: "Retry",
    rail: "bg-warning",
    badge: "border-warning/35 bg-warning/10 text-warning",
    icon: <RefreshCw className="size-3.5" />,
  },
  job_completed: {
    label: "Completed",
    rail: "bg-success",
    badge: "border-success/35 bg-success/10 text-success",
    icon: <CheckCircle2 className="size-3.5" />,
  },
  job_failed: {
    label: "Failed",
    rail: "bg-danger",
    badge: "border-danger/35 bg-danger/10 text-danger",
    icon: <XCircle className="size-3.5" />,
  },
  job_cancelled: {
    label: "Cancelled",
    rail: "bg-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground",
    icon: <AlertTriangle className="size-3.5" />,
  },
};

export function LogStream({
  logs,
  density = "comfortable",
  framed = true,
}: {
  logs: JobLog[];
  density?: LogStreamDensity;
  framed?: boolean;
}) {
  const content = (
    <div className="divide-y divide-border">
      {logs.map((log, index) => (
        <LogRow
          key={log.id}
          log={log}
          density={density}
          first={index === 0}
          last={index === logs.length - 1}
        />
      ))}
    </div>
  );

  if (!framed) {
    return content;
  }

  return <Panel className="overflow-hidden">{content}</Panel>;
}

function LogRow({
  log,
  density,
  first,
  last,
}: {
  log: JobLog;
  density: LogStreamDensity;
  first: boolean;
  last: boolean;
}) {
  const tone = eventTones[log.event] ?? {
    label: humanizeEvent(log.event),
    rail: "bg-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground",
    icon: <Clock3 className="size-3.5" />,
  };
  const metadataEntries = Object.entries(log.metadata ?? {});
  const compact = density === "compact";

  return (
    <article
      className={[
        "grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 bg-card transition-colors hover:bg-muted/20",
        compact ? "px-3 py-3" : "px-4 py-4",
      ].join(" ")}
    >
      <div className="relative flex justify-center">
        {!first ? (
          <span className="absolute -top-4 bottom-1/2 w-px bg-border" />
        ) : null}
        {!last ? (
          <span className="absolute top-1/2 -bottom-4 w-px bg-border" />
        ) : null}
        <span
          className={[
            "relative mt-1 flex size-3 rounded-full ring-4 ring-card",
            tone.rail,
          ].join(" ")}
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-semibold",
                  tone.badge,
                ].join(" ")}
              >
                {tone.icon}
                {tone.label}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {truncateMiddle(log.job_id, compact ? 8 : 12)}
              </span>
            </div>
            <p
              className={[
                "mt-2 whitespace-pre-wrap text-foreground",
                compact ? "text-xs leading-5" : "text-sm leading-6",
              ].join(" ")}
            >
              {log.message}
            </p>
          </div>
          <time className="shrink-0 font-mono text-[11px] text-muted-foreground">
            {formatDateTime(log.created_at)}
          </time>
        </div>

        {metadataEntries.length > 0 ? (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {metadataEntries.slice(0, 4).map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  {key}={formatMetadataValue(value)}
                </span>
              ))}
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                Inspect metadata
              </summary>
              <div className="mt-2">
                <JsonBlock value={log.metadata} />
              </div>
            </details>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function humanizeEvent(event: string) {
  return event
    .replace(/^job_/, "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMetadataValue(value: unknown) {
  if (typeof value === "string") {
    return truncateMiddle(value, 12);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null || value === undefined) {
    return "null";
  }

  return "{...}";
}
