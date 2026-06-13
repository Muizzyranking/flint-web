"use client";

import { RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useAsyncData } from "@/components/dashboard/hooks";
import { JobDetailDrawer, JobsTable } from "@/components/dashboard/job-table";
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

export default function BinPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState<{
    type: "restore" | "purge";
    job: Job;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadBin = useCallback(async () => {
    const response = await dashboardApi.bin({ limit: 100 });
    return response.data;
  }, []);

  const { data, error, loading, refreshing, setData, refresh } =
    useAsyncData(loadBin);

  const jobs = (data ?? []).filter((job) => {
    const normalized = query.trim().toLowerCase();
    return (
      !normalized ||
      job.id.toLowerCase().includes(normalized) ||
      String(job.type).toLowerCase().includes(normalized) ||
      String(job.status).toLowerCase().includes(normalized)
    );
  });

  async function runAction() {
    if (!confirm) {
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      if (confirm.type === "restore") {
        await dashboardApi.restoreJob(confirm.job.id);
      } else {
        await dashboardApi.purgeJob(confirm.job.id);
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
        title="Bin"
        description="Review soft-deleted jobs, restore useful records, or permanently delete entries."
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
          placeholder="Search deleted jobs"
        />
        {loading ? <LoadingState label="Loading bin" /> : null}
        {error ? (
          <ErrorState
            message={getApiErrorMessage(error)}
            onRetry={() => void refresh()}
          />
        ) : null}
        {data ? (
          <JobsTable
            jobs={jobs}
            emptyTitle="Bin is empty"
            emptyDescription="Soft-deleted jobs will appear here."
            onInspect={setSelectedJob}
            actions={[
              {
                label: "Restore job",
                icon: <RotateCcw className="size-4" />,
                onClick: (job) => setConfirm({ type: "restore", job }),
              },
              {
                label: "Permanently delete job",
                icon: <Trash2 className="size-4" />,
                onClick: (job) => setConfirm({ type: "purge", job }),
              },
            ]}
          />
        ) : null}
      </div>

      <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
      <ConfirmModal
        open={Boolean(confirm)}
        title={
          confirm?.type === "restore" ? "Restore job" : "Permanently delete"
        }
        description={
          confirm?.type === "restore"
            ? "This restores the job from the bin back to the jobs area."
            : "This permanently deletes the job record. This action cannot be undone from the UI."
        }
        confirmLabel={
          confirm?.type === "restore" ? "Restore" : "Delete forever"
        }
        variant={confirm?.type === "restore" ? "primary" : "danger"}
        loading={actionLoading}
        onClose={() => setConfirm(null)}
        onConfirm={() => void runAction()}
      />
    </>
  );
}
