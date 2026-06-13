import {
  API_BASE_URL,
  type ApiResponse,
  type BenchmarkAlgorithm,
  type BenchmarkResult,
  type CreateJobPayload,
  type DashboardStats,
  type Job,
  type JobLog,
  type Settings,
  type Worker,
} from "@/lib/dashboard-types";

type QueryValue = string | number | boolean | null | undefined;

class DashboardApiError extends Error {
  status: number;
  errors: ApiResponse<unknown>["errors"];

  constructor(
    message: string,
    status: number,
    errors: ApiResponse<unknown>["errors"] = [],
  ) {
    super(message);
    this.name = "DashboardApiError";
    this.status = status;
    this.errors = errors;
  }
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, API_BASE_URL);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function request<T>(
  path: string,
  init?: RequestInit,
  query?: Record<string, QueryValue>,
) {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  let body: ApiResponse<T> | null = null;

  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      body?.message || `Request failed with status ${response.status}`;
    throw new DashboardApiError(message, response.status, body?.errors ?? []);
  }

  if (!body) {
    throw new DashboardApiError(
      "API returned an empty response.",
      response.status,
    );
  }

  return body;
}

export const dashboardApi = {
  stats() {
    return request<DashboardStats>("/api/v1/dashboard/stats");
  },

  jobs(query?: Record<string, QueryValue>) {
    return request<Job[]>("/api/v1/jobs", undefined, query);
  },

  job(jobId: string) {
    return request<Job>(`/api/v1/jobs/${jobId}`);
  },

  createJob(payload: CreateJobPayload) {
    return request<Job>("/api/v1/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  cancelJob(jobId: string) {
    return request<Job>(`/api/v1/jobs/${jobId}/cancel`, {
      method: "POST",
    });
  },

  deleteJob(jobId: string) {
    return request<Job>(`/api/v1/jobs/${jobId}`, {
      method: "DELETE",
    });
  },

  dlq(query?: Record<string, QueryValue>) {
    return request<Job[]>("/api/v1/dlq", undefined, query);
  },

  retryDlqJob(jobId: string) {
    return request<Job>(`/api/v1/dlq/${jobId}/retry`, {
      method: "POST",
    });
  },

  deleteDlqJob(jobId: string) {
    return request<Job>(`/api/v1/dlq/${jobId}`, {
      method: "DELETE",
    });
  },

  bin(query?: Record<string, QueryValue>) {
    return request<Job[]>("/api/v1/bin", undefined, query);
  },

  restoreJob(jobId: string) {
    return request<Job>(`/api/v1/bin/${jobId}/restore`, {
      method: "POST",
    });
  },

  purgeJob(jobId: string) {
    return request<Job>(`/api/v1/bin/${jobId}`, {
      method: "DELETE",
    });
  },

  logs(query?: Record<string, QueryValue>) {
    return request<JobLog[]>("/api/v1/logs", undefined, query);
  },

  settings() {
    return request<Settings>("/api/v1/settings");
  },

  updateSettings(payload: Partial<Settings>) {
    return request<Settings>("/api/v1/settings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  workers() {
    return request<Worker[]>("/api/v1/workers");
  },

  stopWorker(workerId: string) {
    return request<Worker>(`/api/v1/workers/${workerId}/stop`, {
      method: "POST",
    });
  },

  restartWorker(workerId: string) {
    return request<Worker>(`/api/v1/workers/${workerId}/restart`, {
      method: "POST",
    });
  },

  runBenchmark(n: number, algorithm: BenchmarkAlgorithm) {
    return request<BenchmarkResult>("/api/v1/benchmark/run", {
      method: "POST",
      body: JSON.stringify({ n, algorithm }),
    });
  },
};

export function getApiErrorMessage(error: unknown) {
  if (error instanceof DashboardApiError) {
    const fieldErrors = error.errors
      .map((item) =>
        item.field && item.message
          ? `${item.field}: ${item.message}`
          : item.message,
      )
      .filter(Boolean)
      .join(" ");

    return fieldErrors ? `${error.message} ${fieldErrors}` : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export function getSseUrl() {
  return buildUrl("/api/v1/sse/stream");
}
