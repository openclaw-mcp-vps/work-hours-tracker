"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ReportComparisonProps = {
  actualHours: number;
  reportedHours: number;
  gapHours: number;
  accuracyPercent: number;
};

const todaysDate = (): string => new Date().toISOString().slice(0, 10);

export function ReportComparison({
  actualHours,
  reportedHours,
  gapHours,
  accuracyPercent
}: ReportComparisonProps) {
  const router = useRouter();
  const [project, setProject] = useState("Default Project");
  const [date, setDate] = useState(todaysDate());
  const [hours, setHours] = useState("0");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const interpretation = useMemo(() => {
    if (gapHours > 0.5) {
      return "Reported hours are higher than observed coding activity. Review meeting/debugging time separately so estimates stop drifting.";
    }

    if (gapHours < -0.5) {
      return "Actual coding time is above what you reported. You are likely under-billing or missing tracked blocks.";
    }

    return "Reported and observed coding time are aligned. Current estimate quality is stable.";
  }, [gapHours]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      const numericHours = Number.parseFloat(hours);
      if (!Number.isFinite(numericHours) || numericHours < 0) {
        throw new Error("Hours must be a positive number.");
      }

      const response = await fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "reported",
          project,
          date,
          hours: numericHours,
          notes
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save reported hours.");
      }

      setStatus("Reported hours saved.");
      setNotes("");
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Could not save reported hours.";
      setStatus(text);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reported vs Actual</CardTitle>
        <CardDescription>
          Compare what was claimed in timesheets to what the tracker measured.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-3">
            <p className="text-xs text-[#9fb0c3]">Actual (14d)</p>
            <p className="text-xl font-semibold">{actualHours.toFixed(2)}h</p>
          </div>
          <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-3">
            <p className="text-xs text-[#9fb0c3]">Reported (14d)</p>
            <p className="text-xl font-semibold">{reportedHours.toFixed(2)}h</p>
          </div>
          <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-3">
            <p className="text-xs text-[#9fb0c3]">Gap</p>
            <p className="text-xl font-semibold">{gapHours >= 0 ? "+" : ""}{gapHours.toFixed(2)}h</p>
          </div>
          <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-3">
            <p className="text-xs text-[#9fb0c3]">Accuracy</p>
            <p className="text-xl font-semibold">{accuracyPercent.toFixed(1)}%</p>
          </div>
        </div>

        <p className="rounded-md border border-[#2f3943] bg-[#0f1723] p-3 text-sm text-[#9fb0c3]">{interpretation}</p>

        <form className="grid gap-3" onSubmit={(event) => void onSubmit(event)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={project}
              onChange={(event) => setProject(event.target.value)}
              className="h-10 rounded-md border border-[#2f3943] bg-[#0f1723] px-3 text-[#e6edf3] outline-none focus:ring-2 focus:ring-[#2f81f7]"
              placeholder="Project"
            />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-10 rounded-md border border-[#2f3943] bg-[#0f1723] px-3 text-[#e6edf3] outline-none focus:ring-2 focus:ring-[#2f81f7]"
            />
          </div>

          <input
            type="number"
            step="0.25"
            min="0"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            className="h-10 rounded-md border border-[#2f3943] bg-[#0f1723] px-3 text-[#e6edf3] outline-none focus:ring-2 focus:ring-[#2f81f7]"
            placeholder="Reported hours"
          />

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-[90px] rounded-md border border-[#2f3943] bg-[#0f1723] px-3 py-2 text-[#e6edf3] outline-none focus:ring-2 focus:ring-[#2f81f7]"
            placeholder="What consumed time that coding telemetry may not capture?"
          />

          <Button type="submit" disabled={saving} className="w-fit">
            {saving ? "Saving..." : "Save Reported Hours"}
          </Button>
        </form>

        {status ? <p className="text-sm text-[#58a6ff]">{status}</p> : null}
      </CardContent>
    </Card>
  );
}
