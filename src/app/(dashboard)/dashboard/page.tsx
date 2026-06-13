"use client";

import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useAsyncData, useJobEvents } from "@/components/dashboard/hooks";
import { JobDetailDrawer, JobsTable } from "@/components/dashboard/job-table";
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";
import { formatDate, truncateMiddle } from "@/lib/dashboard-format";
import type { Job } from "@/lib/dashboard-types";

export default function DashboardPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const loadOverview = useCallback(async () => {
    const [stats, jobs, logs, workers] = await Promise.all([
      dashboardApi.stats(),
      dashboardApi.jobs({ limit: 6 }),
      dashboardApi.logs({ limit: 6 }),
      dashboardApi.workers(),
    ]);

    return {
      stats: stats.data,
      jobs: jobs.data,
      logs: logs.data,
      workers: workers.data,
    };
  }, []);

  const { data, error, loading, refreshing, refresh } =
    useAsyncData(loadOverview);
  const { connected } = useJobEvents(() => {
    void refresh();
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live operational snapshot for queued, running, failed, and dead-lettered work."
        action={
          <Button
            type="button"
            variant="secondary"
            loading={refreshing}
            onClick={() => void refresh()}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={connected ? "active" : "pending"} />
        <span className="text-sm text-muted-foreground">
          {connected ? "SSE connected" : "Waiting for live job events"}
        </span>
      </div>

      {loading ? <LoadingState label="Loading dashboard" /> : null}
      {error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => void refresh()}
        />
      ) : null}

      {data ? (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {Object.entries(data.stats).map(([status, count]) => (
              <Panel key={status} className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {status}
                </p>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {count}
                </p>
              </Panel>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-6">
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">
                    Recent jobs
                  </h3>
                  <Link
                    href="/dashboard/jobs"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    View all
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
                <JobsTable
                  jobs={data.jobs}
                  onInspect={setSelectedJob}
                  emptyTitle="No recent jobs"
                  emptyDescription="Create a job from the Jobs page to start filling the queue."
                />
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">
                    Recent logs
                  </h3>
                  <Link
                    href="/dashboard/logs"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    Inspect logs
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
                <Panel className="overflow-hidden">
                  {data.logs.length > 0 ? (
                    <div className="divide-y divide-border">
                      {data.logs.map((log) => (
                        <div key={log.id} className="p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-xs font-semibold text-accent">
                              {log.event}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(log.created_at)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-foreground">
                            {log.message}
                          </p>
                          <p className="mt-2 font-mono text-xs text-muted-foreground">
                            {truncateMiddle(log.job_id, 10)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No logs yet"
                      description="Structured events will appear after jobs are created or processed."
                    />
                  )}
                </Panel>
              </section>
            </div>

            <aside className="space-y-4">
              <Panel className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
                    <ShieldAlert className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Dead-letter queue
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.stats.dlq} job{data.stats.dlq === 1 ? "" : "s"} need
                      inspection
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/dlq"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                >
                  Open DLQ
                  <ArrowRight className="size-4" />
                </Link>
              </Panel>

              <Panel className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <BriefcaseBusiness className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Workers
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {data.workers.length} worker
                      {data.workers.length === 1 ? "" : "s"} registered
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {data.workers.slice(0, 4).map((worker) => (
                    <div
                      key={worker.worker_id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
                    >
                      <span className="font-mono text-xs text-foreground">
                        {worker.worker_id}
                      </span>
                      <StatusBadge status={worker.status} />
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <Activity className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Main queue
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pending and processing jobs are refreshed from SSE.
                    </p>
                  </div>
                </div>
              </Panel>
            </aside>
          </div>
        </div>
      ) : null}

      <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}
