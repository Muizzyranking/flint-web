"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
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
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";
import type { Job } from "@/lib/dashboard-types";

export default function DlqPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState<{
    type: "retry" | "delete";
    job: Job;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDlq = useCallback(async () => {
    const response = await dashboardApi.dlq({ limit: 100 });
    return response.data;
  }, []);

  const { data, error, loading, refreshing, setData, refresh } =
    useAsyncData(loadDlq);

  useJobEvents((event) => {
    if (event.is_dlq) {
      void refresh();
    }
  });

  const jobs = (data ?? []).filter((job) => {
    const normalized = query.trim().toLowerCase();

    return (
      !normalized ||
      job.id.toLowerCase().includes(normalized) ||
      String(job.type).toLowerCase().includes(normalized) ||
      (job.last_error ?? "").toLowerCase().includes(normalized)
    );
  });

  async function runAction() {
    if (!confirm) {
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      if (confirm.type === "retry") {
        await dashboardApi.retryDlqJob(confirm.job.id);
      } else {
        await dashboardApi.deleteDlqJob(confirm.job.id);
      }

      setData(
        (current) =>
          current?.filter((job) => job.id !== confirm.job.id) ?? current,
      );
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
        title="Dead-letter queue"
        description="Inspect jobs that exhausted retries, review error details, and manually retry after the underlying issue is fixed."
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

      <div className="space-y-4">
        {actionError ? <ErrorState message={actionError} /> : null}
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search DLQ by ID, type, or error"
        />
        {loading ? <LoadingState label="Loading DLQ" /> : null}
        {error ? (
          <ErrorState
            message={getApiErrorMessage(error)}
            onRetry={() => void refresh()}
          />
        ) : null}
        {data ? (
          <JobsTable
            jobs={jobs}
            emptyTitle="DLQ is empty"
            emptyDescription="Jobs appear here after retry exhaustion."
            onInspect={setSelectedJob}
            actions={[
              defaultJobActions.retry((job) =>
                setConfirm({ type: "retry", job }),
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
        open={Boolean(confirm)}
        title={confirm?.type === "retry" ? "Retry DLQ job" : "Remove DLQ job"}
        description={
          confirm?.type === "retry"
            ? "This moves the job back for processing. If it fails again, it will return to the DLQ."
            : "This soft-deletes the job from the DLQ view for debugging cleanup."
        }
        confirmLabel={confirm?.type === "retry" ? "Retry job" : "Remove job"}
        variant={confirm?.type === "retry" ? "primary" : "danger"}
        loading={actionLoading}
        onClose={() => setConfirm(null)}
        onConfirm={() => void runAction()}
      />
    </>
  );
}
