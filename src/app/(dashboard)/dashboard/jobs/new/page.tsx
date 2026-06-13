"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { CreateJobForm } from "@/components/dashboard/create-job-form";
import { useAsyncData } from "@/components/dashboard/hooks";
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";

export default function NewJobPage() {
  const router = useRouter();

  const loadJobs = useCallback(async () => {
    const response = await dashboardApi.jobs({ limit: 100 });
    return response.data;
  }, []);

  const { data, error, loading, refresh } = useAsyncData(loadJobs);

  return (
    <>
      <PageHeader
        title="Create job"
        description="Choose a job type, schedule it, and build the payload with fields that match the selected handler."
        action={
          <Link href="/dashboard/jobs">
            <Button type="button" variant="secondary">
              <ArrowLeft className="size-4" />
              Back to jobs
            </Button>
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading dependency candidates" /> : null}
      {error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => void refresh()}
        />
      ) : null}

      <Panel className="p-5">
        <CreateJobForm
          jobs={data ?? []}
          onCreated={() => router.push("/dashboard/jobs")}
        />
      </Panel>
    </>
  );
}
