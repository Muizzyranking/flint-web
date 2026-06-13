"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import {
  Button,
  ErrorState,
  JsonBlock,
  PageHeader,
  Panel,
  SelectField,
  TextInput,
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";
import type {
  BenchmarkAlgorithm,
  BenchmarkMetric,
  BenchmarkResult,
} from "@/lib/dashboard-types";

const algorithmOptions = [
  {
    label: "Both",
    value: "both" as const,
    description: "Run heap and timing wheel in one benchmark.",
  },
  {
    label: "Heap",
    value: "heap" as const,
    description: "Primary queue algorithm.",
  },
  {
    label: "Timing wheel",
    value: "timing_wheel" as const,
    description: "Alternative scheduling algorithm.",
  },
];

export default function BenchmarkPage() {
  const [n, setN] = useState(10_000);
  const [algorithm, setAlgorithm] = useState<BenchmarkAlgorithm>("both");
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runBenchmark(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await dashboardApi.runBenchmark(n, algorithm);
      setResult(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Benchmark"
        description="Compare the heap scheduler against the timing wheel alternative using the backend benchmark runner."
      />

      <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <Panel className="p-5">
          <form onSubmit={runBenchmark} className="space-y-4">
            {error ? <ErrorState message={error} /> : null}
            <TextInput
              label="Number of jobs"
              type="number"
              min={1}
              max={1_000_000}
              value={n}
              onChange={(event) => setN(Number(event.target.value))}
            />
            <SelectField
              label="Algorithm"
              value={algorithm}
              options={algorithmOptions}
              onChange={setAlgorithm}
            />
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              <Play className="size-4" />
              Run benchmark
            </Button>
          </form>
        </Panel>

        <div className="space-y-4">
          {result ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {result.heap ? (
                  <BenchmarkCard title="Heap" metric={result.heap} />
                ) : null}
                {result.timing_wheel ? (
                  <BenchmarkCard
                    title="Timing wheel"
                    metric={result.timing_wheel}
                  />
                ) : null}
              </div>
              <Panel className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Winner
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">
                      {result.winner ?? "Not reported"}
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground">
                    n={result.n}
                  </span>
                </div>
                {result.notes ? (
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {result.notes}
                  </p>
                ) : null}
              </Panel>
              <Panel className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Raw result
                </h3>
                <JsonBlock value={result} />
              </Panel>
            </>
          ) : (
            <Panel className="p-6">
              <p className="text-sm text-muted-foreground">
                Run a benchmark to see insert, pop, and total timing results.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function BenchmarkCard({
  title,
  metric,
}: {
  title: string;
  metric: BenchmarkMetric;
}) {
  return (
    <Panel className="p-5">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Insert" value={metric.insert_time_ms} />
        <Metric label="Pop" value={metric.pop_time_ms} />
        <Metric label="Total" value={metric.total_time_ms} />
      </div>
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold text-foreground">
        {value.toFixed(2)}ms
      </p>
    </div>
  );
}
