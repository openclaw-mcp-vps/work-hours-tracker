import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Work Hours Tracker — Track Actual Coding Time vs Reported Hours",
  description: "Stop guessing. Automatically track real coding hours via IDE integration and compare with self-reported time. Productivity insights at a glance."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-[#c9d1d9] antialiased">{children}</body>
    </html>
  );
}
