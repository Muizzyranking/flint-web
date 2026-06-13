"use client";

import { Ban, Eye, RotateCcw, Trash2 } from "lucide-react";
import {
  formatDate,
  formatInterval,
  truncateMiddle,
} from "@/lib/dashboard-format";
import type { Job } from "@/lib/dashboard-types";
import { LogStream } from "./log-stream";
import {
  Button,
  EmptyState,
  IconButton,
  JsonBlock,
  Panel,
  PriorityBadge,
  StatusBadge,
} from "./ui";

type JobAction = {
  label: string;
  icon: React.ReactNode;
  onClick: (job: Job) => void;
  disabled?: (job: Job) => boolean;
};

export function JobsTable({
  jobs,
  emptyTitle = "No jobs found",
  emptyDescription = "Jobs will appear here when the API returns data.",
  onInspect,
  actions = [],
}: {
  jobs: Job[];
  emptyTitle?: string;
  emptyDescription?: string;
  onInspect: (job: Job) => void;
  actions?: JobAction[];
}) {
  if (jobs.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Retries</th>
              <th className="px-4 py-3 font-semibold">Scheduled</th>
              <th className="px-4 py-3 font-semibold">Interval</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="bg-card/80 transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {truncateMiddle(job.id, 6)}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {job.type}
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={job.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {job.retry_count}/{job.max_retries}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(job.scheduled_at)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatInterval(job.interval_seconds)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(job.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      label="Inspect job"
                      onClick={() => onInspect(job)}
                    >
                      <Eye className="size-4" />
                    </IconButton>
                    {actions.map((action) => (
                      <IconButton
                        key={action.label}
                        label={action.label}
                        onClick={() => action.onClick(job)}
                        disabled={action.disabled?.(job)}
                      >
                        {action.icon}
                      </IconButton>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function JobDetailDrawer({
  job,
  onClose,
}: {
  job: Job | null;
  onClose: () => void;
}) {
  if (!job) {
    return null;
  }

  const dependencies = job.dependencies ?? [];
  const logs = job.logs ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close job details"
      />
      <aside className="relative h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-card p-5 shadow-2xl shadow-shadow-color">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{job.id}</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              {job.type}
            </h3>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Status" value={<StatusBadge status={job.status} />} />
          <Detail
            label="Priority"
            value={<PriorityBadge priority={job.priority} />}
          />
          <Detail
            label="Retry count"
            value={`${job.retry_count}/${job.max_retries}`}
          />
          <Detail
            label="Effective priority"
            value={String(job.effective_priority ?? "-")}
          />
          <Detail label="Worker" value={job.worker_id ?? "None"} />
          <Detail label="Scheduled" value={formatDate(job.scheduled_at)} />
          <Detail label="Started" value={formatDate(job.started_at)} />
          <Detail label="Completed" value={formatDate(job.completed_at)} />
        </div>

        {job.last_error ? (
          <div className="mt-5 rounded-lg border border-danger/35 bg-danger/10 p-4">
            <p className="text-sm font-semibold text-danger">Last error</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
              {job.last_error}
            </p>
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Payload</h4>
          <JsonBlock value={job.payload} />
        </div>

        <div className="mt-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Dependencies
          </h4>
          {dependencies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dependencies.map((dependency) => (
                <span
                  key={dependency}
                  className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
                >
                  {truncateMiddle(dependency, 8)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No dependencies.</p>
          )}
        </div>

        <div className="mt-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Job logs</h4>
          {logs.length > 0 ? (
            <LogStream logs={logs} density="compact" framed={false} />
          ) : (
            <p className="text-sm text-muted-foreground">No logs attached.</p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export const defaultJobActions = {
  cancel(onClick: (job: Job) => void): JobAction {
    return {
      label: "Cancel job",
      icon: <Ban className="size-4" />,
      onClick,
      disabled: (job) =>
        ["completed", "failed", "cancelled"].includes(String(job.status)),
    };
  },
  delete(onClick: (job: Job) => void): JobAction {
    return {
      label: "Delete job",
      icon: <Trash2 className="size-4" />,
      onClick,
    };
  },
  retry(onClick: (job: Job) => void): JobAction {
    return {
      label: "Retry job",
      icon: <RotateCcw className="size-4" />,
      onClick,
    };
  },
};
