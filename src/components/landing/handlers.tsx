"use client";

type Handler = {
  icon: React.ReactNode;
  name: string;
  type: string;
  description: string;
  fields: { key: string; value: string }[];
  accent: string;
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
    accent: "#7EB8E8",
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
    accent: "#7EC8A4",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
      { key: "log_lines", value: "2024-01-15 ERROR timeout…" },
    ],
    accent: "#E8A87C",
  },
];

function PayloadPreview({
  fields,
  accent,
}: {
  fields: Handler["fields"];
  accent: string;
}) {
  return (
    <div className="mt-4 rounded-lg border border-white/[0.05] bg-[#0D0D10] p-3 font-mono text-[11px] leading-relaxed">
      <p className="text-white/20">{"{"}</p>
      {fields.map(({ key, value }) => (
        <p key={key} className="pl-3">
          <span style={{ color: accent }} className="opacity-70">
            &quot;{key}&quot;
          </span>
          <span className="text-white/20">: </span>
          <span className="text-white/45">&quot;{value}&quot;</span>
        </p>
      ))}
      <p className="text-white/20">{"}"}</p>
    </div>
  );
}

export function Handlers() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      {/* Section header */}
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#FF6B2B]/70">
          Job handlers
        </p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Three handler types.
          <br />
          <span className="text-white/35">One unified queue.</span>
        </h2>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HANDLERS.map((handler) => (
          <div
            key={handler.type}
            className="group relative rounded-xl border border-white/[0.06] bg-[#111114] p-5 transition-all hover:border-white/[0.12] hover:bg-[#13131a]"
          >
            {/* Icon */}
            <div
              className="mb-4 flex size-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]"
              style={{ color: handler.accent }}
            >
              {handler.icon}
            </div>

            {/* Text */}
            <h3 className="text-[15px] font-semibold text-white/90">
              {handler.name}
            </h3>
            <p className="mt-1 font-mono text-[10px] text-white/25 tracking-wider">
              type: &quot;{handler.type}&quot;
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/40">
              {handler.description}
            </p>

            {/* Payload preview */}
            <PayloadPreview fields={handler.fields} accent={handler.accent} />
          </div>
        ))}
      </div>
    </section>
  );
}
