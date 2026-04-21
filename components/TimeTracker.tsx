"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TimeTrackerProps = {
  defaultProject: string;
};

const formatElapsed = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export function TimeTracker({ defaultProject }: TimeTrackerProps) {
  const router = useRouter();
  const [project, setProject] = useState(defaultProject);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const onKeyDown = (): void => {
      setKeystrokes((value) => value + 1);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [running]);

  const elapsedMs = useMemo(() => {
    if (!startedAt) {
      return 0;
    }
    return (running ? tick || Date.now() : Date.now()) - startedAt.getTime();
  }, [running, startedAt, tick]);

  const startTimer = (): void => {
    setRunning(true);
    setStartedAt(new Date());
    setTick(Date.now());
    setKeystrokes(0);
    setMessage("");
  };

  const stopTimer = async (): Promise<void> => {
    if (!startedAt) {
      return;
    }

    setSaving(true);

    try {
      const endedAt = new Date();
      const response = await fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "activity",
          project,
          source: "manual-timer",
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          keystrokes,
          commitCount: 0,
          notes: "Logged from dashboard timer"
        })
      });

      if (!response.ok) {
        throw new Error("Unable to save timer session.");
      }

      setRunning(false);
      setStartedAt(null);
      setKeystrokes(0);
      setMessage("Session saved.");
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to save session.";
      setMessage(text);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Coding Timer</CardTitle>
        <CardDescription>
          Run this while you code to capture real elapsed coding time and keyboard activity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="block text-sm font-medium text-[#9fb0c3]" htmlFor="project-name">
          Project Label
        </label>
        <input
          id="project-name"
          value={project}
          onChange={(event) => setProject(event.target.value)}
          className="h-10 w-full rounded-md border border-[#2f3943] bg-[#0f1723] px-3 text-[#e6edf3] outline-none focus:ring-2 focus:ring-[#2f81f7]"
          placeholder="Client website revamp"
        />

        <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-4">
          <p className="text-xs uppercase tracking-wide text-[#9fb0c3]">Elapsed Time</p>
          <p className="font-mono text-3xl font-semibold text-[#e6edf3]">{formatElapsed(elapsedMs)}</p>
          <p className="mt-1 text-sm text-[#9fb0c3]">Keystrokes this session: {keystrokes}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!running ? (
            <Button onClick={startTimer} size="lg">
              Start Tracking
            </Button>
          ) : (
            <Button onClick={() => void stopTimer()} variant="secondary" size="lg" disabled={saving}>
              {saving ? "Saving..." : "Stop and Save"}
            </Button>
          )}
        </div>

        {message ? <p className="text-sm text-[#58a6ff]">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
