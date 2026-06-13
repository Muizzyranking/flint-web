"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSseUrl } from "@/lib/dashboard-api";
import type { SseJobEvent } from "@/lib/dashboard-types";

export function useAsyncData<T>(
  load: () => Promise<T>,
  options?: {
    enabled?: boolean;
    intervalMs?: number;
  },
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);
  const enabled = options?.enabled ?? true;

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setError(null);
    setRefreshing(true);

    try {
      const next = await load();
      if (mounted.current) {
        setData(next);
      }
    } catch (requestError) {
      if (mounted.current) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Something went wrong.",
        );
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [enabled, load]);

  useEffect(() => {
    mounted.current = true;
    void refresh();

    return () => {
      mounted.current = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (!options?.intervalMs || !enabled) {
      return;
    }

    const timer = window.setInterval(() => {
      void refresh();
    }, options.intervalMs);

    return () => window.clearInterval(timer);
  }, [enabled, options?.intervalMs, refresh]);

  return {
    data,
    error,
    loading,
    refreshing,
    setData,
    refresh,
  };
}

export function useJobEvents(onEvent?: (event: SseJobEvent) => void) {
  const [events, setEvents] = useState<SseJobEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const source = new EventSource(getSseUrl());

    source.onopen = () => {
      setConnected(true);
    };

    source.onerror = () => {
      setConnected(false);
    };

    source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as SseJobEvent;
        setEvents((current) => [event, ...current].slice(0, 30));
        onEventRef.current?.(event);
      } catch {
        setConnected(false);
      }
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, []);

  return useMemo(
    () => ({
      events,
      connected,
    }),
    [connected, events],
  );
}
