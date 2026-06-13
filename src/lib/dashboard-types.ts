export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const JOB_TYPES = [
  "send_email",
  "webhook_delivery",
  "log_processing",
] as const;

export const JOB_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
] as const;

export const PRIORITIES = [
  { label: "High", value: 1 },
  { label: "Medium", value: 2 },
  { label: "Low", value: 3 },
] as const;

export const INTERVAL_OPTIONS = [
  { label: "None", value: "" },
  { label: "Every 1 minute", value: "1m" },
  { label: "Every 5 minutes", value: "5m" },
  { label: "Every 1 hour", value: "1h" },
] as const;

export const HTTP_METHODS = ["POST", "PUT", "PATCH", "DELETE", "GET"] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];
export type HttpMethod = (typeof HTTP_METHODS)[number];
export type SchedulerStrategy = "heap" | "timing_wheel";
export type BenchmarkAlgorithm = SchedulerStrategy | "both";

export type ApiError = {
  field?: string;
  message?: string;
  [key: string]: unknown;
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
} | null;

export type ApiResponse<T> = {
  message: string;
  data: T;
  errors: ApiError[];
  meta: ApiMeta;
};

export type JobLog = {
  id: string;
  job_id: string;
  event: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type Job = {
  id: string;
  type: JobType | string;
  payload: Record<string, unknown>;
  priority: number;
  status: JobStatus | string;
  scheduled_at: string | null;
  interval_seconds: number | null;
  retry_count: number;
  max_retries: number;
  last_error: string | null;
  effective_priority: number | null;
  cancellation_requested: boolean;
  worker_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  is_dlq: boolean;
  created_at: string;
  updated_at: string;
  dependencies: string[] | null;
  logs: JobLog[] | null;
};

export type DashboardStats = {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  dlq: number;
};

export type Settings = {
  dlq_threshold: string;
  alert_emails: string;
  scheduler_strategy: SchedulerStrategy | string;
};

export type Worker = {
  worker_id: string;
  status: string;
  ttl_seconds: number;
};

export type BenchmarkMetric = {
  insert_time_ms: number;
  pop_time_ms: number;
  total_time_ms: number;
};

export type BenchmarkResult = {
  n: number;
  heap?: BenchmarkMetric;
  timing_wheel?: BenchmarkMetric;
  winner?: string;
  notes?: string;
};

export type EmailPayload = {
  to: string;
  subject: string;
  body?: string;
  html?: string;
};

export type WebhookPayload = {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

export type LogPayload = {
  lines: string[];
  source?: string;
};

export type CreateJobPayload = {
  dependency_ids: string[];
  interval?: string;
  max_retries: number;
  payload: EmailPayload | WebhookPayload | LogPayload;
  priority: number;
  scheduled_at?: string | null;
  type: JobType;
};

export type SseJobEvent = {
  job_id: string;
  status: JobStatus | string;
  type?: JobType | string;
  worker_id?: string;
  duration_ms?: number;
  retry_count?: number;
  is_dlq?: boolean;
  reason?: string;
};
