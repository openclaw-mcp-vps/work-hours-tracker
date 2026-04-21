import Link from "next/link";

import { ActivityChart } from "@/components/ActivityChart";
import { ReportComparison } from "@/components/ReportComparison";
import { TimeTracker } from "@/components/TimeTracker";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrackingSummary } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { actualHours, reportedHours, gapHours, accuracyPercent, daily, recentActivities } =
    await getTrackingSummary(14);

  return (
    <main className="px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Activity Dashboard</h1>
            <p className="mt-1 text-[#9fb0c3]">
              Compare measured coding activity against reported hours and catch estimate drift early.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Home
            </Link>
            <Link href="/access" className={buttonVariants({ variant: "outline" })}>
              Manage Access
            </Link>
          </div>
        </header>

        <ReportComparison
          actualHours={actualHours}
          reportedHours={reportedHours}
          gapHours={gapHours}
          accuracyPercent={accuracyPercent}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <TimeTracker defaultProject="Default Project" />

          <Card>
            <CardHeader>
              <CardTitle>14-Day Trend</CardTitle>
              <CardDescription>Blue = actual coding activity, Orange = reported timesheet entries</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityChart data={daily} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Sessions</CardTitle>
            <CardDescription>Latest tracked sessions captured by the dashboard timer or desktop agent.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#2f3943] text-left text-[#9fb0c3]">
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Project</th>
                    <th className="pb-3 pr-4 font-medium">Source</th>
                    <th className="pb-3 pr-4 font-medium">Duration</th>
                    <th className="pb-3 pr-4 font-medium">Keystrokes</th>
                    <th className="pb-3 pr-4 font-medium">Commits</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.length > 0 ? (
                    recentActivities.map((item) => (
                      <tr key={item.id} className="border-b border-[#202833]">
                        <td className="py-2 pr-4 text-[#e6edf3]">{new Date(item.startedAt).toLocaleDateString()}</td>
                        <td className="py-2 pr-4 text-[#e6edf3]">{item.project}</td>
                        <td className="py-2 pr-4 text-[#9fb0c3]">{item.source}</td>
                        <td className="py-2 pr-4 text-[#e6edf3]">{item.durationMinutes}m</td>
                        <td className="py-2 pr-4 text-[#e6edf3]">{item.keystrokes}</td>
                        <td className="py-2 pr-4 text-[#e6edf3]">{item.commitCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 text-[#9fb0c3]" colSpan={6}>
                        No activity captured yet. Start the timer above or run the desktop agent.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
