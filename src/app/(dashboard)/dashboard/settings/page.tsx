"use client";

import { Save, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAsyncData } from "@/components/dashboard/hooks";
import {
  Button,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  TextInput,
} from "@/components/dashboard/ui";
import { dashboardApi, getApiErrorMessage } from "@/lib/dashboard-api";

export default function SettingsPage() {
  const [dlqThreshold, setDlqThreshold] = useState("5");
  const [alertEmails, setAlertEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    const response = await dashboardApi.settings();
    return response.data;
  }, []);

  const { data, error, loading, refresh } = useAsyncData(loadSettings);

  useEffect(() => {
    if (!data) {
      return;
    }

    setDlqThreshold(data.dlq_threshold);
    setAlertEmails(parseAlertEmails(data.alert_emails));
  }, [data]);

  function addEmail() {
    const next = emailInput.trim();

    if (!next || alertEmails.includes(next)) {
      setEmailInput("");
      return;
    }

    setAlertEmails((current) => [...current, next]);
    setEmailInput("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSavedMessage(null);

    try {
      const response = await dashboardApi.updateSettings({
        dlq_threshold: dlqThreshold,
        alert_emails: JSON.stringify(alertEmails),
      });
      setSavedMessage(response.message);
      await refresh();
    } catch (requestError) {
      setSaveError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure DLQ alerting and the engineers who should receive threshold notifications."
      />

      {loading ? <LoadingState label="Loading settings" /> : null}
      {error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => void refresh()}
        />
      ) : null}

      {data ? (
        <Panel className="p-5">
          <form onSubmit={save} className="space-y-6">
            {saveError ? <ErrorState message={saveError} /> : null}
            {savedMessage ? (
              <div className="rounded-lg border border-success/35 bg-success/10 p-3 text-sm font-medium text-success">
                {savedMessage}
              </div>
            ) : null}

            <div className="max-w-xl">
              <TextInput
                label="DLQ threshold"
                type="number"
                min={1}
                value={dlqThreshold}
                onChange={(event) => setDlqThreshold(event.target.value)}
                hint="When DLQ size crosses this number, the backend sends alert emails."
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Alert emails
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addEmail();
                    }
                  }}
                  placeholder="ops@example.com"
                  className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground shadow-sm shadow-shadow-color outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-ring/40"
                />
                <Button type="button" variant="secondary" onClick={addEmail}>
                  Add
                </Button>
              </div>
              <div className="mt-3 flex min-h-10 flex-wrap gap-2">
                {alertEmails.length > 0 ? (
                  alertEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() =>
                          setAlertEmails((current) =>
                            current.filter((item) => item !== email),
                          )
                        }
                        className="text-muted-foreground hover:text-danger"
                        aria-label={`Remove ${email}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No alert emails configured.
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={saving}>
                <Save className="size-4" />
                Save settings
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </>
  );
}

function parseAlertEmails(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}
