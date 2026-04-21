import { promises as fs } from "fs";
import path from "path";

export type ActivitySource = "desktop-agent" | "manual-timer" | "git" | "ide";

export type ActivityEvent = {
  id: string;
  project: string;
  source: ActivitySource;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  keystrokes: number;
  commitCount: number;
  notes?: string;
};

export type ReportedEntry = {
  id: string;
  project: string;
  date: string;
  hours: number;
  notes?: string;
};

export type PurchaseRecord = {
  id: string;
  email: string;
  source: "stripe" | "manual";
  purchasedAt: string;
  sessionId?: string;
};

export type TrackingStore = {
  activities: ActivityEvent[];
  reported: ReportedEntry[];
  purchases: PurchaseRecord[];
};

export type DailySummary = {
  date: string;
  actualHours: number;
  reportedHours: number;
};

export type TrackingSummary = {
  actualHours: number;
  reportedHours: number;
  gapHours: number;
  accuracyPercent: number;
  daily: DailySummary[];
  recentActivities: ActivityEvent[];
  recentReported: ReportedEntry[];
};

const DATA_FILE = path.join(process.cwd(), "data", "tracking.json");

const toISODate = (input: Date): string => input.toISOString().slice(0, 10);

const round = (value: number): number => Math.round(value * 100) / 100;

async function ensureDataFile(): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    const initial: TrackingStore = { activities: [], reported: [], purchases: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<TrackingStore> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as Partial<TrackingStore>;

  return {
    activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    reported: Array.isArray(parsed.reported) ? parsed.reported : [],
    purchases: Array.isArray(parsed.purchases) ? parsed.purchases : []
  };
}

async function writeStore(store: TrackingStore): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function addActivity(input: Omit<ActivityEvent, "id">): Promise<ActivityEvent> {
  const store = await readStore();
  const activity: ActivityEvent = {
    id: crypto.randomUUID(),
    ...input,
    durationMinutes: Math.max(0, input.durationMinutes),
    keystrokes: Math.max(0, input.keystrokes),
    commitCount: Math.max(0, input.commitCount)
  };

  store.activities.push(activity);
  await writeStore(store);
  return activity;
}

export async function addReportedEntry(input: Omit<ReportedEntry, "id">): Promise<ReportedEntry> {
  const store = await readStore();
  const entry: ReportedEntry = {
    id: crypto.randomUUID(),
    ...input,
    hours: Math.max(0, input.hours)
  };

  store.reported.push(entry);
  await writeStore(store);
  return entry;
}

export async function addPurchase(input: Omit<PurchaseRecord, "id">): Promise<PurchaseRecord> {
  const store = await readStore();
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = store.purchases.find(
    (record) => record.email === normalizedEmail && record.sessionId && record.sessionId === input.sessionId
  );

  if (existing) {
    return existing;
  }

  const record: PurchaseRecord = {
    id: crypto.randomUUID(),
    ...input,
    email: normalizedEmail
  };

  store.purchases.push(record);
  await writeStore(store);
  return record;
}

export async function hasPurchaseForEmail(email: string): Promise<boolean> {
  const store = await readStore();
  const normalized = email.trim().toLowerCase();
  return store.purchases.some((record) => record.email === normalized);
}

export async function getTrackingSummary(days = 14): Promise<TrackingSummary> {
  const store = await readStore();
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const buckets = new Map<string, DailySummary>();

  for (let index = 0; index < days; index += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + index);
    const key = toISODate(day);

    buckets.set(key, {
      date: key,
      actualHours: 0,
      reportedHours: 0
    });
  }

  for (const activity of store.activities) {
    const day = toISODate(new Date(activity.startedAt));
    const bucket = buckets.get(day);
    if (bucket) {
      bucket.actualHours += activity.durationMinutes / 60;
    }
  }

  for (const entry of store.reported) {
    const bucket = buckets.get(entry.date);
    if (bucket) {
      bucket.reportedHours += entry.hours;
    }
  }

  const daily = Array.from(buckets.values()).map((row) => ({
    ...row,
    actualHours: round(row.actualHours),
    reportedHours: round(row.reportedHours)
  }));

  const actualHours = round(daily.reduce((total, row) => total + row.actualHours, 0));
  const reportedHours = round(daily.reduce((total, row) => total + row.reportedHours, 0));
  const gapHours = round(reportedHours - actualHours);

  const accuracyPercent = reportedHours <= 0
    ? 100
    : round(Math.max(0, 100 - (Math.abs(gapHours) / reportedHours) * 100));

  const recentActivities = [...store.activities]
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, 20);

  const recentReported = [...store.reported]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 20);

  return {
    actualHours,
    reportedHours,
    gapHours,
    accuracyPercent,
    daily,
    recentActivities,
    recentReported
  };
}
