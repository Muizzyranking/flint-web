import {
  Callout,
  Code,
  CodeBlock,
  DocSection,
  DocSubSection,
  Endpoint,
  P,
  PropsTable,
} from "@/components/docs/docs-components";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-28 pb-24 sm:px-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-12">
        <DocsSidebar />

        <main className="min-w-0 flex-1">
          <div className="mb-10 rounded-lg border border-border bg-card p-6 shadow-sm shadow-shadow-color">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Documentation
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Build with Flint without guessing the contract.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              API envelopes, worker controls, handler payloads, deployment
              notes, and the scheduling behavior that powers the dashboard.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["REST", "Versioned /api/v1 routes"],
                ["SSE", "Live job status stream"],
                ["Queue", "Heap and timing wheel"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-border bg-muted/40 px-3 py-2"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    {label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Overview ─────────────────────────────────────────── */}
          <DocSection id="overview" title="Overview">
            <P>
              Flint is a background job scheduler built with FastAPI (backend)
              and Next.js (frontend). It supports three job handler types, two
              interchangeable scheduling algorithms, real-time status streaming
              via SSE, and a full management UI.
            </P>
            <P>
              The REST API follows a consistent envelope format. Every response
              body has the shape:
            </P>
            <CodeBlock language="json">{`
{
  "message": "Human-readable status string",
  "data": { ... } | null,
  "errors": [],
  "meta": { "page": 1, "limit": 20, "total": 142 } | null
}
            `}</CodeBlock>
            <Callout type="info">
              All API routes are prefixed with <Code>/api/v1/</Code>. The
              frontend proxies these through Next.js API routes so the FastAPI
              server is never directly exposed to the browser.
            </Callout>
          </DocSection>

          {/* ── Getting started ───────────────────────────────────── */}
          <DocSection id="getting-started" title="Getting started">
            <DocSubSection id="prerequisites" title="Prerequisites">
              <P>
                You will need Docker and Docker Compose installed on your
                machine.
              </P>
              <CodeBlock language="bash">{`
docker --version      # >= 24.0
docker compose version # >= 2.20
              `}</CodeBlock>
            </DocSubSection>

            <DocSubSection id="installation" title="Installation">
              <P>
                Clone the repository and bring up the full stack with one
                command:
              </P>
              <CodeBlock language="bash">{`
git clone https://github.com/your-org/flint.git
cd flint
docker compose up --build
              `}</CodeBlock>
              <P>
                This starts four services: <Code>api</Code> (FastAPI on port
                8000), <Code>web</Code> (Next.js on port 3000), <Code>db</Code>{" "}
                (PostgreSQL), and <Code>worker</Code> (background job runner).
              </P>
            </DocSubSection>

            <DocSubSection id="configuration" title="Configuration">
              <P>
                Copy <Code>.env.local.example</Code> to <Code>.env.local</Code>{" "}
                in the frontend directory and set your values:
              </P>
              <CodeBlock language="bash">{`
BACKEND_URL=http://api:8000
FLINT_API_KEY=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:8000
              `}</CodeBlock>
              <Callout type="warning">
                <Code>BACKEND_URL</Code> and <Code>FLINT_API_KEY</Code> are
                server-side only. Never prefix them with{" "}
                <Code>NEXT_PUBLIC_</Code>.
              </Callout>
            </DocSubSection>
          </DocSection>

          {/* ── API reference ─────────────────────────────────────── */}
          <DocSection id="api-reference" title="API reference">
            <DocSubSection id="jobs" title="Jobs">
              <div className="space-y-2">
                <Endpoint
                  method="GET"
                  path="/api/v1/jobs"
                  description="List all jobs with optional filters and pagination."
                />
                <Endpoint
                  method="POST"
                  path="/api/v1/jobs"
                  description="Create a new job."
                />
                <Endpoint
                  method="GET"
                  path="/api/v1/jobs/{id}"
                  description="Retrieve a single job by ID including logs and dependencies."
                />
                <Endpoint
                  method="PATCH"
                  path="/api/v1/jobs/{id}/cancel"
                  description="Request cancellation of a pending or processing job."
                />
                <Endpoint
                  method="DELETE"
                  path="/api/v1/jobs/{id}"
                  description="Soft-delete a job (moves to Bin)."
                />
              </div>

              <P>
                Query parameters for <Code>GET /jobs</Code>:
              </P>
              <PropsTable
                rows={[
                  {
                    field: "status",
                    type: "string",
                    description:
                      "Filter by status: pending | processing | completed | failed | cancelled",
                  },
                  {
                    field: "type",
                    type: "string",
                    description: "Filter by job type.",
                  },
                  {
                    field: "priority",
                    type: "integer",
                    description: "Filter by priority level (1, 2, or 3).",
                  },
                  {
                    field: "page",
                    type: "integer",
                    description: "Page number (default: 1).",
                  },
                  {
                    field: "limit",
                    type: "integer",
                    description: "Results per page (default: 20, max: 100).",
                  },
                ]}
              />

              <P>
                Request body for <Code>POST /jobs</Code>:
              </P>
              <PropsTable
                rows={[
                  {
                    field: "type",
                    type: "JobType",
                    required: true,
                    description:
                      "send_email | webhook_delivery | log_processing",
                  },
                  {
                    field: "payload",
                    type: "object",
                    required: true,
                    description: "Handler-specific payload. See Job handlers.",
                  },
                  {
                    field: "priority",
                    type: "1 | 2 | 3",
                    required: true,
                    description: "1 = High, 2 = Medium, 3 = Low.",
                  },
                  {
                    field: "scheduled_at",
                    type: "ISO 8601",
                    required: false,
                    description: "When to run. Omit for immediate execution.",
                  },
                  {
                    field: "interval",
                    type: "string",
                    required: false,
                    description: "Recurrence interval, e.g. 30s, 5m, 1h, 1d.",
                  },
                  {
                    field: "dependency_ids",
                    type: "string[]",
                    required: false,
                    description:
                      "Job IDs that must complete before this job runs.",
                  },
                  {
                    field: "max_retries",
                    type: "integer",
                    required: false,
                    description: "Retry limit before DLQ. Default: 3.",
                  },
                ]}
              />

              <CodeBlock language="json">{`
// POST /api/v1/jobs — example
{
  "type": "webhook_delivery",
  "priority": 1,
  "payload": {
    "url": "https://api.yourapp.com/hooks/payment",
    "method": "POST",
    "body": { "event": "payment.success", "amount": 4900 }
  },
  "interval": "5m",
  "max_retries": 5
}
              `}</CodeBlock>
            </DocSubSection>

            <DocSubSection id="dlq" title="Dead letter queue">
              <div className="space-y-2">
                <Endpoint
                  method="GET"
                  path="/api/v1/dlq"
                  description="List jobs in the dead letter queue."
                />
                <Endpoint
                  method="POST"
                  path="/api/v1/dlq/{id}/retry"
                  description="Re-queue a DLQ job from the beginning."
                />
                <Endpoint
                  method="DELETE"
                  path="/api/v1/dlq/{id}"
                  description="Permanently remove a job from the DLQ."
                />
              </div>
              <Callout type="info">
                A job moves to the DLQ once <Code>retry_count</Code> reaches{" "}
                <Code>max_retries</Code>. The threshold for alerting is
                configurable in Settings.
              </Callout>
            </DocSubSection>

            <DocSubSection id="bin" title="Bin">
              <div className="space-y-2">
                <Endpoint
                  method="GET"
                  path="/api/v1/bin"
                  description="List soft-deleted jobs."
                />
                <Endpoint
                  method="PATCH"
                  path="/api/v1/bin/{id}/restore"
                  description="Restore a job back to the main queue."
                />
                <Endpoint
                  method="DELETE"
                  path="/api/v1/bin/{id}"
                  description="Hard-delete a job. Irreversible."
                />
              </div>
            </DocSubSection>

            <DocSubSection id="workers" title="Workers">
              <div className="space-y-2">
                <Endpoint
                  method="GET"
                  path="/api/v1/workers"
                  description="List all registered workers and their current status."
                />
                <Endpoint
                  method="POST"
                  path="/api/v1/workers/{id}/stop"
                  description="Gracefully stop a worker after its current job."
                />
                <Endpoint
                  method="POST"
                  path="/api/v1/workers/{id}/restart"
                  description="Restart a stopped worker."
                />
              </div>
            </DocSubSection>

            <DocSubSection id="logs" title="Logs">
              <div className="space-y-2">
                <Endpoint
                  method="GET"
                  path="/api/v1/logs"
                  description="Query the job event log with optional filters."
                />
              </div>
              <PropsTable
                rows={[
                  {
                    field: "job_id",
                    type: "string",
                    description: "Filter logs for a specific job.",
                  },
                  {
                    field: "event",
                    type: "string",
                    description:
                      "Filter by event type, e.g. job_failed, job_completed.",
                  },
                  {
                    field: "page",
                    type: "integer",
                    description: "Page number.",
                  },
                  {
                    field: "limit",
                    type: "integer",
                    description: "Results per page.",
                  },
                ]}
              />
            </DocSubSection>

            <DocSubSection id="settings" title="Settings">
              <div className="space-y-2">
                <Endpoint
                  method="GET"
                  path="/api/v1/settings"
                  description="Retrieve current system settings."
                />
                <Endpoint
                  method="PATCH"
                  path="/api/v1/settings"
                  description="Update one or more settings fields."
                />
              </div>
              <PropsTable
                rows={[
                  {
                    field: "scheduler_strategy",
                    type: "string",
                    description:
                      "heap | timing_wheel — switches the active algorithm.",
                  },
                  {
                    field: "dlq_threshold",
                    type: "integer",
                    description: "Alert when DLQ count reaches this number.",
                  },
                  {
                    field: "alert_emails",
                    type: "string",
                    description: "JSON array of email addresses as a string.",
                  },
                ]}
              />
            </DocSubSection>

            <DocSubSection id="benchmark" title="Benchmark">
              <div className="space-y-2">
                <Endpoint
                  method="POST"
                  path="/api/v1/benchmark/run"
                  description="Run an algorithm benchmark and return timing results."
                />
              </div>
              <PropsTable
                rows={[
                  {
                    field: "n",
                    type: "integer",
                    required: true,
                    description:
                      "Number of jobs to insert and pop (e.g. 1000, 10000, 100000).",
                  },
                  {
                    field: "algorithm",
                    type: "string",
                    required: true,
                    description: "heap | timing_wheel | both",
                  },
                ]}
              />
            </DocSubSection>

            <DocSubSection id="sse" title="SSE stream">
              <Endpoint
                method="GET"
                path="/api/v1/sse/stream"
                description="Server-Sent Events stream for real-time job status updates."
              />
              <P>
                The browser opens this connection directly to the FastAPI server
                via the <Code>NEXT_PUBLIC_API_URL</Code> env var. Each event is
                a JSON-encoded object:
              </P>
              <CodeBlock language="json">{`
// Incoming SSE event
data: {"job_id": "a3f9d2c1-...", "status": "completed", "worker_id": "worker-01"}
              `}</CodeBlock>
              <Callout type="tip">
                The frontend maintains a single global SSE connection inside{" "}
                <Code>AppShell</Code> via the <Code>useSSE</Code> hook. Status
                updates are written to Zustand and reflected immediately in the
                jobs table and job detail view without a refetch.
              </Callout>
            </DocSubSection>
          </DocSection>

          {/* ── Job handlers ─────────────────────────────────────── */}
          <DocSection id="job-handlers" title="Job handlers">
            <DocSubSection id="send-email" title="send_email">
              <P>
                Sends a transactional email via the configured mail provider.
              </P>
              <PropsTable
                rows={[
                  {
                    field: "to",
                    type: "string",
                    required: true,
                    description: "Recipient email address.",
                  },
                  {
                    field: "subject",
                    type: "string",
                    required: true,
                    description: "Email subject line.",
                  },
                  {
                    field: "body",
                    type: "string",
                    required: false,
                    description: "Plain-text body.",
                  },
                  {
                    field: "html_body",
                    type: "string",
                    required: false,
                    description:
                      "HTML body. Overrides body if both are provided.",
                  },
                ]}
              />
              <CodeBlock language="json">{`
{
  "type": "send_email",
  "priority": 2,
  "payload": {
    "to": "alice@example.com",
    "subject": "Your order has shipped",
    "html_body": "<p>Hi Alice, your order <b>#4821</b> is on its way.</p>"
  }
}
              `}</CodeBlock>
            </DocSubSection>

            <DocSubSection id="webhook-delivery" title="webhook_delivery">
              <P>Posts a signed HTTP request to an arbitrary endpoint.</P>
              <PropsTable
                rows={[
                  {
                    field: "url",
                    type: "string",
                    required: true,
                    description: "Target URL.",
                  },
                  {
                    field: "method",
                    type: "string",
                    required: false,
                    description: "HTTP method. Default: POST.",
                  },
                  {
                    field: "headers",
                    type: "object",
                    required: false,
                    description: "Key-value map of request headers.",
                  },
                  {
                    field: "body",
                    type: "any",
                    required: false,
                    description: "Request body. Serialised to JSON.",
                  },
                ]}
              />
              <CodeBlock language="json">{`
{
  "type": "webhook_delivery",
  "priority": 1,
  "payload": {
    "url": "https://hooks.yourapp.com/payment",
    "method": "POST",
    "headers": { "X-Signature": "sha256=abc123" },
    "body": { "event": "payment.captured", "amount": 9900 }
  }
}
              `}</CodeBlock>
            </DocSubSection>

            <DocSubSection id="log-processing" title="log_processing">
              <P>
                Ingests and processes structured log lines from a named source.
              </P>
              <PropsTable
                rows={[
                  {
                    field: "source",
                    type: "string",
                    required: false,
                    description:
                      "Identifier for the log source, e.g. nginx-prod-01.",
                  },
                  {
                    field: "log_lines",
                    type: "string[]",
                    required: true,
                    description: "Array of raw log lines to process.",
                  },
                ]}
              />
              <CodeBlock language="json">{`
{
  "type": "log_processing",
  "priority": 3,
  "payload": {
    "source": "nginx-prod-01",
    "log_lines": [
      "2024-01-15T12:00:01Z ERROR connection timeout to db",
      "2024-01-15T12:00:02Z WARN  retry attempt 1 of 3"
    ]
  }
}
              `}</CodeBlock>
            </DocSubSection>
          </DocSection>

          {/* ── Algorithms ───────────────────────────────────────── */}
          <DocSection id="algorithms" title="Algorithms">
            <DocSubSection id="min-heap" title="Min-heap">
              <P>
                The default strategy. Jobs are stored in a binary min-heap
                ordered by <Code>effective_priority</Code>. The scheduler always
                pops the root — guaranteeing the highest-priority job runs next.
                Insert and pop are both <Code>O(log n)</Code>.
              </P>
              <P>
                <Code>effective_priority</Code> is derived from the base
                priority level combined with scheduled time, so a lower-priority
                job can bubble up if it has been waiting too long.
              </P>
            </DocSubSection>

            <DocSubSection id="timing-wheel" title="Timing wheel">
              <P>
                A circular bucket structure where each slot represents a time
                tick. Jobs are inserted into the slot matching their scheduled
                time. The scheduler hand advances one slot per tick and
                dispatches all jobs in the current slot. Both insert and pop are{" "}
                <Code>O(1)</Code>.
              </P>
              <P>
                Best for high-volume recurring workloads where all jobs have
                roughly equal priority and precise timing matters more than
                relative ordering.
              </P>
            </DocSubSection>

            <DocSubSection id="switching" title="Switching at runtime">
              <P>
                Send a <Code>PATCH /api/v1/settings</Code> request with{" "}
                <Code>scheduler_strategy</Code> set to either <Code>heap</Code>{" "}
                or <Code>timing_wheel</Code>. The change is applied to the next
                job pop — no restart required.
              </P>
              <CodeBlock language="bash">{`
curl -X PATCH http://localhost:8000/api/v1/settings \\
  -H "X-API-Key: your-key" \\
  -H "Content-Type: application/json" \\
  -d '{"scheduler_strategy": "timing_wheel"}'
              `}</CodeBlock>
              <Callout type="tip">
                You can also switch algorithms from the Settings page in the
                dashboard or from the Algorithm Switcher on the landing page.
              </Callout>
            </DocSubSection>
          </DocSection>

          {/* ── Deployment ───────────────────────────────────────── */}
          <DocSection id="deployment" title="Deployment">
            <DocSubSection id="docker" title="Docker Compose">
              <P>
                The repository ships with a <Code>docker-compose.yml</Code> that
                wires up all four services. For production, set{" "}
                <Code>NODE_ENV=production</Code> and ensure your domain is
                pointed at the Nginx reverse proxy.
              </P>
              <CodeBlock language="bash">{`
docker compose -f docker-compose.prod.yml up -d
              `}</CodeBlock>
            </DocSubSection>

            <DocSubSection id="env-vars" title="Environment variables">
              <PropsTable
                rows={[
                  {
                    field: "BACKEND_URL",
                    type: "string",
                    required: true,
                    description:
                      "Internal URL of the FastAPI service. Server-side only.",
                  },
                  {
                    field: "FLINT_API_KEY",
                    type: "string",
                    required: true,
                    description:
                      "Secret API key injected into every proxied request.",
                  },
                  {
                    field: "NEXT_PUBLIC_API_URL",
                    type: "string",
                    required: true,
                    description:
                      "Public URL of the FastAPI service. Used for SSE from the browser.",
                  },
                ]}
              />
            </DocSubSection>
          </DocSection>
        </main>
      </div>
    </div>
  );
}
