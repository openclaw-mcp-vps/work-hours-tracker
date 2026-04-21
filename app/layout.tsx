import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Space_Grotesk, Geist } from "next/font/google";

import "@/app/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://work-hours-tracker.local"),
  title: "Work Hours Tracker | Actual Coding Time vs Reported Time",
  description:
    "Track actual coding hours from IDE activity, keystrokes, and git commits. Compare against reported timesheets to reveal planning and billing gaps.",
  keywords: [
    "coding time tracker",
    "developer timesheet accuracy",
    "freelancer time tracking",
    "engineering sprint planning"
  ],
  openGraph: {
    title: "Work Hours Tracker",
    description:
      "Automatically compare observed coding time against reported hours and catch estimate drift before it hits delivery dates.",
    url: "https://work-hours-tracker.local",
    siteName: "Work Hours Tracker",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Work Hours Tracker",
    description:
      "Stop guessing how long coding actually takes. Measure activity, compare reports, and tighten project estimates."
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${heading.variable} ${mono.variable} min-h-screen bg-[#0d1117] text-[#e6edf3] antialiased`}>
        {children}
      </body>
    </html>
  );
}
