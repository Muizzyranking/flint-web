"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useAsyncData, useJobEvents } from "@/components/dashboard/hooks";
import {
  defaultJobActions,
  JobDetailDrawer,
  JobsTable,
} from "@/components/dashboard/job-table";
import {
  Button,
  ConfirmModal,
  ErrorState,
  LoadingState,
  PageHeader,
  SearchInput,
  SelectField,
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";
import type { Job, JobStatus } from "@/lib/dashboard-types";

const statusFilters = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export default function JobsPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState<(typeof statusFilters)[number]["value"]>("all");
  const [confirm, setConfirm] = useState<{
    type: "cancel" | "delete";
    job: Job;
  } | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    const response = await dashboardApi.jobs({ limit: 100 });
    return response.data;
  }, []);

  const { data, error, loading, refreshing, setData, refresh } =
    useAsyncData(loadJobs);

  useJobEvents((event) => {
    setData((current) => {
      if (!current) {
        return current;
      }

      return current.map((job) =>
        job.id === event.job_id
          ? {
              ...job,
              status: event.status as JobStatus,
              retry_count: event.retry_count ?? job.retry_count,
              worker_id: event.worker_id ?? job.worker_id,
              is_dlq: event.is_dlq ?? job.is_dlq,
              updated_at: new Date().toISOString(),
            }
          : job,
      );
    });
  });

  const filteredJobs = useMemo(() => {
    const jobs = data ?? [];
    const normalized = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesStatus = status === "all" || job.status === status;
      const matchesQuery =
        !normalized ||
        job.id.toLowerCase().includes(normalized) ||
        String(job.type).toLowerCase().includes(normalized) ||
        String(job.status).toLowerCase().includes(normalized);

      return matchesStatus && matchesQuery;
    });
  }, [data, query, status]);

  async function runAction() {
    if (!confirm) {
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      if (confirm.type === "cancel") {
        const response = await dashboardApi.cancelJob(confirm.job.id);
        setData(
          (current) =>
            current?.map((job) =>
              job.id === response.data.id ? response.data : job,
            ) ?? current,
        );
      } else {
        await dashboardApi.deleteJob(confirm.job.id);
        setData(
          (current) =>
            current?.filter((job) => job.id !== confirm.job.id) ?? current,
        );
      }
      setConfirm(null);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Inspect queued work, cancel pending jobs, and soft-delete records. Status changes stream in over SSE."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="size-4" />
              New job
            </Button>
            <Button
              type="button"
              variant="secondary"
              loading={refreshing}
              onClick={() => void refresh()}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {actionError ? <ErrorState message={actionError} /> : null}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by ID, type, or status"
          />
          <SelectField
            value={status}
            options={[...statusFilters]}
            onChange={setStatus}
          />
        </div>

        {loading ? <LoadingState label="Loading jobs" /> : null}
        {error ? (
          <ErrorState
            message={getApiErrorMessage(error)}
            onRetry={() => void refresh()}
          />
        ) : null}
        {data ? (
          <JobsTable
            jobs={filteredJobs}
            onInspect={setSelectedJob}
            actions={[
              defaultJobActions.cancel((job) =>
                setConfirm({ type: "cancel", job }),
              ),
              defaultJobActions.delete((job) =>
                setConfirm({ type: "delete", job }),
              ),
            ]}
          />
        ) : null}
      </div>

      <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
      <ConfirmModal
        open={createModalOpen}
        title="Create a new job?"
        description="You will leave this table and open the full job creation page with type-specific payload fields."
        confirmLabel="Create job"
        variant="primary"
        onClose={() => setCreateModalOpen(false)}
        onConfirm={() => router.push("/dashboard/jobs/new")}
      />
      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.type === "cancel" ? "Cancel job" : "Delete job"}
        description={
          confirm?.type === "cancel"
            ? "This sends a cancellation request. Jobs already processing may finish if the worker cannot interrupt the handler."
            : "This soft-deletes the job and moves it out of the main jobs list."
        }
        confirmLabel={confirm?.type === "cancel" ? "Cancel job" : "Delete job"}
        loading={actionLoading}
        onClose={() => setConfirm(null)}
        onConfirm={() => void runAction()}
      />
    </>
  );
}
