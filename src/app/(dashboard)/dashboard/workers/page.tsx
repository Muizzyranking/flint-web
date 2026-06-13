"use client";

import { Power, RefreshCw, RotateCw } from "lucide-react";
import { useCallback, useState } from "react";
import { useAsyncData } from "@/components/dashboard/hooks";
import {
  Button,
  ConfirmModal,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";
import type { Worker } from "@/lib/dashboard-types";

export default function WorkersPage() {
  const [confirm, setConfirm] = useState<{
    type: "stop" | "restart";
    worker: Worker;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadWorkers = useCallback(async () => {
    const response = await dashboardApi.workers();
    return response.data;
  }, []);

  const { data, error, loading, refreshing, refresh } = useAsyncData(
    loadWorkers,
    {
      intervalMs: 15_000,
    },
  );

  async function runAction() {
    if (!confirm) {
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      if (confirm.type === "stop") {
        await dashboardApi.stopWorker(confirm.worker.worker_id);
      } else {
        await dashboardApi.restartWorker(confirm.worker.worker_id);
      }

      setConfirm(null);
      await refresh();
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Workers"
        description="View active workers and send stop or restart signals. Stopping a worker may require server access to start it again."
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
        {loading ? <LoadingState label="Loading workers" /> : null}
        {error ? (
          <ErrorState
            message={getApiErrorMessage(error)}
            onRetry={() => void refresh()}
          />
        ) : null}
        {data ? (
          data.length > 0 ? (
            <Panel className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Worker</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">TTL</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.map((worker) => (
                      <tr key={worker.worker_id} className="bg-card/80">
                        <td className="px-4 py-3 font-mono text-sm text-foreground">
                          {worker.worker_id}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={worker.status} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {worker.ttl_seconds}s
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                setConfirm({ type: "restart", worker })
                              }
                            >
                              <RotateCw className="size-4" />
                              Restart
                            </Button>
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() =>
                                setConfirm({ type: "stop", worker })
                              }
                            >
                              <Power className="size-4" />
                              Stop
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : (
            <EmptyState
              title="No active workers"
              description="Workers will appear here when their heartbeat is registered by the backend."
            />
          )
        ) : null}
      </div>

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.type === "stop" ? "Stop worker" : "Restart worker"}
        description={
          confirm?.type === "stop"
            ? "This sends a stop signal to the worker. You may need to access the server to bring the process back."
            : "This sends a restart signal to the worker process."
        }
        confirmLabel={
          confirm?.type === "stop" ? "Stop worker" : "Restart worker"
        }
        variant={confirm?.type === "stop" ? "danger" : "primary"}
        loading={actionLoading}
        onClose={() => setConfirm(null)}
        onConfirm={() => void runAction()}
      />
    </>
  );
}
