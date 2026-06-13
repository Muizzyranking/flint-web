"use client";

import { Mail, Plus, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";
import { parseJsonObject, parseStringRecord } from "@/lib/dashboard-format";
import {
  type CreateJobPayload,
  HTTP_METHODS,
  type HttpMethod,
  INTERVAL_OPTIONS,
  JOB_TYPES,
  type Job,
  type JobType,
  PRIORITIES,
} from "@/lib/dashboard-types";
import { Button, ErrorState, SelectField, TextArea, TextInput } from "./ui";

type HeaderRow = {
  id: string;
  key: string;
  value: string;
};

type EmailMode = "plain" | "html";

const jobTypeOptions = JOB_TYPES.map((type) => ({
  label:
    type === "send_email"
      ? "Send email"
      : type === "webhook_delivery"
        ? "Webhook delivery"
        : "Log processing",
  value: type,
}));

const priorityOptions = PRIORITIES.map((priority) => ({
  label: `${priority.label} priority`,
  value: priority.value,
}));

const intervalOptions = INTERVAL_OPTIONS.map((interval) => ({
  label: interval.label,
  value: interval.value,
}));

const methodOptions = HTTP_METHODS.map((method) => ({
  label: method,
  value: method,
}));

export function CreateJobForm({
  jobs,
  onCreated,
}: {
  jobs: Job[];
  onCreated: () => void;
}) {
  const [type, setType] = useState<JobType>("webhook_delivery");
  const [priority, setPriority] = useState<number>(1);
  const [scheduledAt, setScheduledAt] = useState("");
  const [interval, setInterval] = useState("");
  const [maxRetries, setMaxRetries] = useState(3);
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [dependencyInput, setDependencyInput] = useState("");

  const [emailMode, setEmailMode] = useState<EmailMode>("plain");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailHeading, setEmailHeading] = useState("Welcome");
  const [emailIntro, setEmailIntro] = useState("Thanks for joining Flint.");
  const [emailButtonLabel, setEmailButtonLabel] = useState("Open dashboard");
  const [emailButtonUrl, setEmailButtonUrl] = useState("https://example.com");
  const [emailFooter, setEmailFooter] = useState(
    "This email was sent by Flint.",
  );

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookMethod, setWebhookMethod] = useState<HttpMethod>("POST");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { id: crypto.randomUUID(), key: "Content-Type", value: "application/json" },
  ]);
  const [webhookBody, setWebhookBody] = useState(
    '{\n  "event": "user.created"\n}',
  );

  const [logSource, setLogSource] = useState("unknown");
  const [logLines, setLogLines] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const htmlPreview = useMemo(
    () =>
      buildEmailHtml({
        heading: emailHeading,
        intro: emailIntro,
        buttonLabel: emailButtonLabel,
        buttonUrl: emailButtonUrl,
        footer: emailFooter,
      }),
    [emailButtonLabel, emailButtonUrl, emailFooter, emailHeading, emailIntro],
  );

  function addDependencyFromInput() {
    const next = dependencyInput.trim();

    if (!next || dependencies.includes(next)) {
      setDependencyInput("");
      return;
    }

    setDependencies((current) => [...current, next]);
    setDependencyInput("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = buildPayload();
      await dashboardApi.createJob(payload);
      onCreated();
      resetAfterSubmit();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  function buildPayload(): CreateJobPayload {
    const shared = {
      dependency_ids: dependencies,
      interval: interval || undefined,
      max_retries: maxRetries,
      priority,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      type,
    };

    if (type === "send_email") {
      if (!emailTo.trim() || !emailSubject.trim()) {
        throw new Error("Email jobs require a recipient and subject.");
      }

      return {
        ...shared,
        payload:
          emailMode === "html"
            ? {
                to: emailTo.trim(),
                subject: emailSubject.trim(),
                html: htmlPreview,
              }
            : {
                to: emailTo.trim(),
                subject: emailSubject.trim(),
                body: emailBody,
              },
      };
    }

    if (type === "webhook_delivery") {
      if (!webhookUrl.trim()) {
        throw new Error("Webhook jobs require a URL.");
      }

      return {
        ...shared,
        payload: {
          url: webhookUrl.trim(),
          method: webhookMethod,
          headers: parseStringRecord(headers),
          body: parseJsonObject(webhookBody),
        },
      };
    }

    const lines = logLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      throw new Error("Log processing jobs require at least one log line.");
    }

    return {
      ...shared,
      payload: {
        source: logSource.trim() || "unknown",
        lines,
      },
    };
  }

  function resetAfterSubmit() {
    setWebhookUrl("");
    setWebhookBody('{\n  "event": "user.created"\n}');
    setEmailTo("");
    setEmailSubject("");
    setEmailBody("");
    setLogLines("");
    setDependencies([]);
    setDependencyInput("");
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {error ? <ErrorState message={error} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SelectField
          label="Job type"
          value={type}
          options={jobTypeOptions}
          onChange={setType}
        />
        <SelectField
          label="Priority"
          value={priority}
          options={priorityOptions}
          onChange={setPriority}
        />
        <TextInput
          label="Scheduled time"
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
        />
        <SelectField
          label="Recurring interval"
          value={interval}
          options={intervalOptions}
          onChange={setInterval}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <TextInput
          label="Max retries"
          type="number"
          min={0}
          max={10}
          value={maxRetries}
          onChange={(event) => setMaxRetries(Number(event.target.value))}
        />
        <DependencyPicker
          jobs={jobs}
          dependencies={dependencies}
          dependencyInput={dependencyInput}
          onInputChange={setDependencyInput}
          onAdd={addDependencyFromInput}
          onSelect={(id) => {
            if (!dependencies.includes(id)) {
              setDependencies((current) => [...current, id]);
            }
          }}
          onRemove={(id) =>
            setDependencies((current) => current.filter((item) => item !== id))
          }
        />
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        {type === "send_email" ? (
          <EmailFields
            mode={emailMode}
            onModeChange={setEmailMode}
            emailTo={emailTo}
            emailSubject={emailSubject}
            emailBody={emailBody}
            emailHeading={emailHeading}
            emailIntro={emailIntro}
            emailButtonLabel={emailButtonLabel}
            emailButtonUrl={emailButtonUrl}
            emailFooter={emailFooter}
            htmlPreview={htmlPreview}
            setEmailTo={setEmailTo}
            setEmailSubject={setEmailSubject}
            setEmailBody={setEmailBody}
            setEmailHeading={setEmailHeading}
            setEmailIntro={setEmailIntro}
            setEmailButtonLabel={setEmailButtonLabel}
            setEmailButtonUrl={setEmailButtonUrl}
            setEmailFooter={setEmailFooter}
          />
        ) : null}

        {type === "webhook_delivery" ? (
          <WebhookFields
            url={webhookUrl}
            method={webhookMethod}
            headers={headers}
            body={webhookBody}
            setUrl={setWebhookUrl}
            setMethod={setWebhookMethod}
            setHeaders={setHeaders}
            setBody={setWebhookBody}
          />
        ) : null}

        {type === "log_processing" ? (
          <LogFields
            source={logSource}
            lines={logLines}
            setSource={setLogSource}
            setLines={setLogLines}
          />
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={submitting}>
          <Send className="size-4" />
          Create job
        </Button>
      </div>
    </form>
  );
}

function DependencyPicker({
  jobs,
  dependencies,
  dependencyInput,
  onInputChange,
  onAdd,
  onSelect,
  onRemove,
}: {
  jobs: Job[];
  dependencies: string[];
  dependencyInput: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const availableJobs = jobs.slice(0, 8);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        Dependencies
      </span>
      <div className="flex gap-2">
        <input
          value={dependencyInput}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder="Paste a job ID"
          className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm shadow-shadow-color outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-ring/40"
        />
        <Button type="button" variant="secondary" onClick={onAdd}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      {availableJobs.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {availableJobs.map((job) => (
            <button
              type="button"
              key={job.id}
              onClick={() => onSelect(job.id)}
              className="rounded-full border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              {job.type}: {job.id.slice(0, 8)}
            </button>
          ))}
        </div>
      ) : null}
      {dependencies.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {dependencies.map((dependency) => (
            <span
              key={dependency}
              className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent-soft px-2.5 py-1 font-mono text-xs text-foreground"
            >
              {dependency.slice(0, 10)}
              <button
                type="button"
                onClick={() => onRemove(dependency)}
                className="text-muted-foreground hover:text-danger"
                aria-label="Remove dependency"
              >
                <Trash2 className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EmailFields({
  mode,
  onModeChange,
  emailTo,
  emailSubject,
  emailBody,
  emailHeading,
  emailIntro,
  emailButtonLabel,
  emailButtonUrl,
  emailFooter,
  htmlPreview,
  setEmailTo,
  setEmailSubject,
  setEmailBody,
  setEmailHeading,
  setEmailIntro,
  setEmailButtonLabel,
  setEmailButtonUrl,
  setEmailFooter,
}: {
  mode: EmailMode;
  onModeChange: (mode: EmailMode) => void;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  emailHeading: string;
  emailIntro: string;
  emailButtonLabel: string;
  emailButtonUrl: string;
  emailFooter: string;
  htmlPreview: string;
  setEmailTo: (value: string) => void;
  setEmailSubject: (value: string) => void;
  setEmailBody: (value: string) => void;
  setEmailHeading: (value: string) => void;
  setEmailIntro: (value: string) => void;
  setEmailButtonLabel: (value: string) => void;
  setEmailButtonUrl: (value: string) => void;
  setEmailFooter: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-accent" />
          <h3 className="text-base font-semibold text-foreground">
            Email payload
          </h3>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {(["plain", "html"] as const).map((nextMode) => (
            <button
              type="button"
              key={nextMode}
              onClick={() => onModeChange(nextMode)}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                mode === nextMode
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {nextMode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Recipient"
          type="email"
          value={emailTo}
          onChange={(event) => setEmailTo(event.target.value)}
          placeholder="test@gmail.com"
        />
        <TextInput
          label="Subject"
          value={emailSubject}
          onChange={(event) => setEmailSubject(event.target.value)}
          placeholder="Welcome"
        />
      </div>

      {mode === "plain" ? (
        <TextArea
          label="Body"
          value={emailBody}
          onChange={(event) => setEmailBody(event.target.value)}
          placeholder="Write a plain text message"
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)]">
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Message content
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Build the HTML email from structured fields. The generated HTML
                is sent in the payload.
              </p>
            </div>
            <div className="grid gap-4">
              <TextInput
                label="Heading"
                value={emailHeading}
                onChange={(event) => setEmailHeading(event.target.value)}
              />
              <TextArea
                label="Intro text"
                value={emailIntro}
                onChange={(event) => setEmailIntro(event.target.value)}
              />
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Call to action
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Button label"
                  value={emailButtonLabel}
                  onChange={(event) => setEmailButtonLabel(event.target.value)}
                />
                <TextInput
                  label="Button URL"
                  type="url"
                  value={emailButtonUrl}
                  onChange={(event) => setEmailButtonUrl(event.target.value)}
                />
              </div>
            </div>
            <TextInput
              label="Footer note"
              value={emailFooter}
              onChange={(event) => setEmailFooter(event.target.value)}
            />
          </div>
          <EmailPreview html={htmlPreview} />
        </div>
      )}
    </div>
  );
}

function EmailPreview({ html }: { html: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-shadow-color">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Recipient preview
          </p>
          <p className="text-xs text-muted-foreground">
            This is the HTML body that will be sent.
          </p>
        </div>
        <span className="rounded-full border border-success/35 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
          HTML
        </span>
      </div>
      <div className="bg-muted/30 p-4">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <iframe
            title="Generated email preview"
            srcDoc={html}
            className="h-[28rem] w-full bg-white"
          />
        </div>
      </div>
      <details className="border-t border-border px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          Generated source
        </summary>
        <pre className="mt-3 max-h-52 overflow-auto rounded-lg border border-border bg-code p-3 font-mono text-xs leading-5 text-code-foreground">
          {html}
        </pre>
      </details>
    </div>
  );
}

function WebhookFields({
  url,
  method,
  headers,
  body,
  setUrl,
  setMethod,
  setHeaders,
  setBody,
}: {
  url: string;
  method: HttpMethod;
  headers: HeaderRow[];
  body: string;
  setUrl: (value: string) => void;
  setMethod: (value: HttpMethod) => void;
  setHeaders: React.Dispatch<React.SetStateAction<HeaderRow[]>>;
  setBody: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">
        Webhook payload
      </h3>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem]">
        <TextInput
          label="URL"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://webhook.site/abc"
        />
        <SelectField
          label="Method"
          value={method}
          options={methodOptions}
          onChange={setMethod}
        />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">Headers</span>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setHeaders((current) => [
                ...current,
                { id: crypto.randomUUID(), key: "", value: "" },
              ])
            }
          >
            <Plus className="size-4" />
            Header
          </Button>
        </div>
        <div className="space-y-2">
          {headers.map((header) => (
            <div
              key={header.id}
              className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
            >
              <input
                value={header.key}
                onChange={(event) =>
                  setHeaders((current) =>
                    current.map((item) =>
                      item.id === header.id
                        ? { ...item, key: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Header"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-ring/40"
              />
              <input
                value={header.value}
                onChange={(event) =>
                  setHeaders((current) =>
                    current.map((item) =>
                      item.id === header.id
                        ? { ...item, value: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Value"
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-ring/40"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setHeaders((current) =>
                    current.filter((item) => item.id !== header.id),
                  )
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <TextArea
        label="JSON body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="font-mono"
      />
    </div>
  );
}

function LogFields({
  source,
  lines,
  setSource,
  setLines,
}: {
  source: string;
  lines: string;
  setSource: (value: string) => void;
  setLines: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">Log payload</h3>
      <TextInput
        label="Source"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        placeholder="nginx"
      />
      <TextArea
        label="Log lines"
        value={lines}
        onChange={(event) => setLines(event.target.value)}
        placeholder={"One log line per row\n2026-06-13 INFO job completed"}
      />
    </div>
  );
}

function buildEmailHtml({
  heading,
  intro,
  buttonLabel,
  buttonUrl,
  footer,
}: {
  heading: string;
  intro: string;
  buttonLabel: string;
  buttonUrl: string;
  footer: string;
}) {
  const safeHeading = escapeHtml(heading);
  const safeIntro = escapeHtml(intro).replace(/\n/g, "<br />");
  const safeButtonLabel = escapeHtml(buttonLabel);
  const safeButtonUrl = escapeHtml(buttonUrl);
  const safeFooter = escapeHtml(footer);

  return [
    '<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>',
    '<body style="margin:0;background:#f4f7f6;padding:28px;font-family:Inter,Arial,sans-serif;color:#1f2937">',
    '<main style="max-width:580px;margin:0 auto;overflow:hidden;border:1px solid #d7dfdc;border-radius:14px;background:#ffffff">',
    '<div style="height:6px;background:#ea580c"></div>',
    '<section style="padding:32px">',
    `<p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;color:#0f766e">Flint notification</p>`,
    `<h1 style="margin:0 0 16px;font-size:30px;line-height:1.18;color:#111827">${safeHeading}</h1>`,
    `<p style="margin:0 0 26px;font-size:16px;line-height:1.7;color:#4b5563">${safeIntro}</p>`,
    buttonLabel && buttonUrl
      ? `<a href="${safeButtonUrl}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:700">${safeButtonLabel}</a>`
      : "",
    "</section>",
    `<footer style="border-top:1px solid #e5e7eb;background:#f9fafb;padding:18px 32px"><p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280">${safeFooter}</p></footer>`,
    "</main></body></html>",
  ].join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
