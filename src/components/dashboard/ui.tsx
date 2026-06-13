"use client";

import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Dashboard
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Button({
  variant = "secondary",
  loading,
  className = "",
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
}) {
  const classes: Record<ButtonVariant, string> = {
    primary:
      "border-accent bg-accent text-accent-foreground hover:brightness-105",
    secondary:
      "border-border bg-card text-foreground hover:border-accent/45 hover:text-accent",
    danger: "border-danger/50 bg-danger text-white hover:brightness-105",
    ghost:
      "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold shadow-sm shadow-shadow-color transition-all disabled:cursor-not-allowed disabled:opacity-55",
        classes[variant],
        className,
      ].join(" ")}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
}) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={[
        "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm shadow-shadow-color transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function TextInput({
  label,
  hint,
  wrapperClassName = "",
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  wrapperClassName?: string;
}) {
  return (
    <label className={["block", wrapperClassName].join(" ")}>
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </span>
      ) : null}
      <input
        {...props}
        className={[
          "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm shadow-shadow-color outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-ring/40",
          className,
        ].join(" ")}
      />
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  wrapperClassName = "",
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  wrapperClassName?: string;
}) {
  return (
    <label className={["block", wrapperClassName].join(" ")}>
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </span>
      ) : null}
      <textarea
        {...props}
        className={[
          "min-h-28 w-full resize-y rounded-lg border border-border bg-card px-3 py-2.5 text-sm leading-6 text-foreground shadow-sm shadow-shadow-color outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-ring/40",
          className,
        ].join(" ")}
      />
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label?: string;
  value: T;
  options: Array<{ label: string; value: T; description?: string }>;
  onChange: (value: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={["relative", className].join(" ")}>
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 text-left text-sm text-foreground shadow-sm shadow-shadow-color outline-none transition-colors hover:border-accent/45 focus:border-accent focus:ring-4 focus:ring-ring/40"
      >
        <span className="min-w-0 truncate">{active?.label}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-xl shadow-shadow-color">
          {options.map((option) => (
            <button
              type="button"
              key={String(option.value)}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={[
                "flex w-full items-start justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                option.value === value
                  ? "bg-accent-soft text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <span>
                <span className="block font-medium">{option.label}</span>
                {option.description ? (
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </span>
                ) : null}
              </span>
              {option.value === value ? (
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground shadow-sm shadow-shadow-color outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-ring/40"
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = {
    pending: "border-warning/40 bg-warning/12 text-warning",
    processing: "border-secondary/40 bg-secondary/12 text-secondary",
    completed: "border-success/40 bg-success/12 text-success",
    failed: "border-danger/40 bg-danger/12 text-danger",
    cancelled: "border-muted-foreground/30 bg-muted text-muted-foreground",
    active: "border-success/40 bg-success/12 text-success",
  }[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold capitalize",
        tone ?? "border-border bg-muted text-muted-foreground",
      ].join(" ")}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: number }) {
  const label = priority === 1 ? "High" : priority === 2 ? "Medium" : "Low";
  const tone =
    priority === 1
      ? "border-danger/40 bg-danger/12 text-danger"
      : priority === 2
        ? "border-warning/40 bg-warning/12 text-warning"
        : "border-secondary/40 bg-secondary/12 text-secondary";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2 py-1 text-xs font-semibold",
        tone,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-lg border border-border bg-card shadow-sm shadow-shadow-color",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-danger/35 bg-danger/10 p-4 text-sm text-foreground">
      <p className="font-semibold text-danger">Request failed</p>
      <p className="mt-1 leading-6 text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={onRetry}
        >
          Retry
        </Button>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-accent" />
        {label}
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  loading,
  variant = "danger",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  variant?: ButtonVariant;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-2xl shadow-shadow-color">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>
        <h3 className="pr-10 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={variant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function JsonBlock({ value }: { value: unknown }) {
  const text = useMemo(() => JSON.stringify(value ?? {}, null, 2), [value]);

  return (
    <pre className="max-h-72 overflow-auto rounded-lg border border-border bg-code p-3 font-mono text-xs leading-5 text-code-foreground">
      {text}
    </pre>
  );
}
