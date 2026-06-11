"use client";

type Handler = {
  icon: React.ReactNode;
  name: string;
  type: string;
  description: string;
  fields: { key: string; value: string | string[] }[];
  accentClass: string;
};

const HANDLERS: Handler[] = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="4"
          width="16"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M2 7l8 5 8-5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    name: "Email dispatch",
    type: "send_email",
    description:
      "Queue and deliver transactional emails with full payload control. Retries on failure, deduplication on key.",
    fields: [
      { key: "to", value: "user@example.com" },
      { key: "subject", value: "Your order is confirmed" },
      { key: "body", value: "Hi Alice, your order #4821…" },
    ],
    accentClass: "text-secondary",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 10a7 7 0 1 0 14 0A7 7 0 0 0 3 10Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M10 6v4l3 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    name: "Webhook delivery",
    type: "webhook_delivery",
    description:
      "POST signed payloads to any endpoint. Configurable method, headers, and body — with automatic retry logic.",
    fields: [
      { key: "url", value: "https://api.yourapp.com/hooks" },
      { key: "method", value: "POST" },
      { key: "body", value: '{"event":"payment.success"}' },
    ],
    accentClass: "text-success",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 5h14M3 9h10M3 13h12M3 17h8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    name: "Log processing",
    type: "log_processing",
    description:
      "Ingest and process structured log lines from any source. Batch jobs, stream ingestion, or one-off pipeline runs.",
    fields: [
      { key: "source", value: "nginx-prod-01" },
      {
        key: "log_lines",
        value: [
          "2024-01-15 ERROR timeout…",
          "2024-01-15 WARN retry scheduled…",
        ],
      },
    ],
    accentClass: "text-accent",
  },
];

function PayloadPreview({
  fields,
  accentClass,
}: {
  fields: Handler["fields"];
  accentClass: string;
}) {
  return (
    <div className="mt-5 rounded-lg border border-border bg-code p-3 font-mono text-[11px] leading-relaxed text-code-foreground">
      <p className="text-muted-foreground">{"{"}</p>
      {fields.map(({ key, value }) =>
        Array.isArray(value) ? (
          <div key={key} className="pl-3">
            <span className={accentClass}>&quot;{key}&quot;</span>
            <span className="text-muted-foreground">: [</span>
            <div className="pl-3">
              {value.map((line, index) => (
                <p key={line}>
                  <span className="text-code-foreground/75">
                    &quot;{line}&quot;
                  </span>
                  {index < value.length - 1 ? (
                    <span className="text-muted-foreground">,</span>
                  ) : null}
                </p>
              ))}
            </div>
            <span className="text-muted-foreground">]</span>
          </div>
        ) : (
          <p key={key} className="pl-3">
            <span className={accentClass}>&quot;{key}&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-code-foreground/75">&quot;{value}&quot;</span>
          </p>
        ),
      )}
      <p className="text-muted-foreground">{"}"}</p>
    </div>
  );
}

export function Handlers() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            Job handlers
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three handler types.
            <br />
            <span className="text-muted-foreground">One unified queue.</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HANDLERS.map((handler) => (
            <div
              key={handler.type}
              className="group rounded-lg border border-border bg-card p-5 shadow-sm shadow-shadow-color transition-all hover:-translate-y-1 hover:border-accent/35 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex size-10 items-center justify-center rounded-lg border border-border bg-muted ${handler.accentClass}`}
              >
                {handler.icon}
              </div>

              <h3 className="text-base font-semibold text-card-foreground">
                {handler.name}
              </h3>
              <p className="mt-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                type: &quot;{handler.type}&quot;
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {handler.description}
              </p>

              <PayloadPreview
                fields={handler.fields}
                accentClass={handler.accentClass}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
