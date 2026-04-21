import { NextRequest, NextResponse } from "next/server";

import { addActivity, addReportedEntry, getTrackingSummary } from "@/lib/db";

export const dynamic = "force-dynamic";

type ActivityPayload = {
  type: "activity";
  project: string;
  source?: "desktop-agent" | "manual-timer" | "git" | "ide";
  startedAt: string;
  endedAt: string;
  keystrokes?: number;
  commitCount?: number;
  notes?: string;
};

type ReportedPayload = {
  type: "reported";
  project: string;
  date: string;
  hours: number;
  notes?: string;
};

function isISODate(input: string): boolean {
  const parsed = new Date(input);
  return !Number.isNaN(parsed.getTime());
}

function minutesBetween(startedAt: string, endedAt: string): number {
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return Math.round((end - start) / 60000);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const daysRaw = request.nextUrl.searchParams.get("days");
  const days = Number.parseInt(daysRaw ?? "14", 10);
  const safeDays = Number.isFinite(days) ? Math.min(Math.max(days, 1), 90) : 14;

  const summary = await getTrackingSummary(safeDays);

  return NextResponse.json({
    days: safeDays,
    summary
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = (await request.json()) as ActivityPayload | ReportedPayload;

  if (!payload?.type) {
    return NextResponse.json({ error: "Missing payload type." }, { status: 400 });
  }

  if (payload.type === "activity") {
    if (!payload.project || !payload.startedAt || !payload.endedAt) {
      return NextResponse.json({ error: "project, startedAt, and endedAt are required." }, { status: 400 });
    }

    if (!isISODate(payload.startedAt) || !isISODate(payload.endedAt)) {
      return NextResponse.json({ error: "startedAt and endedAt must be valid ISO dates." }, { status: 400 });
    }

    const durationMinutes = minutesBetween(payload.startedAt, payload.endedAt);

    const saved = await addActivity({
      project: payload.project,
      source: payload.source ?? "manual-timer",
      startedAt: payload.startedAt,
      endedAt: payload.endedAt,
      durationMinutes,
      keystrokes: payload.keystrokes ?? 0,
      commitCount: payload.commitCount ?? 0,
      notes: payload.notes
    });

    return NextResponse.json({ saved }, { status: 201 });
  }

  if (!payload.project || !payload.date || typeof payload.hours !== "number") {
    return NextResponse.json({ error: "project, date, and numeric hours are required." }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
    return NextResponse.json({ error: "date must be in YYYY-MM-DD format." }, { status: 400 });
  }

  const saved = await addReportedEntry({
    project: payload.project,
    date: payload.date,
    hours: payload.hours,
    notes: payload.notes
  });

  return NextResponse.json({ saved }, { status: 201 });
}
