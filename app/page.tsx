import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How is actual coding time measured?",
    answer:
      "The desktop agent samples IDE process activity, tracks file edit bursts as keystroke proxies, and captures git commit frequency. Those signals are merged into active coding windows."
  },
  {
    question: "Does this replace my timesheet tool?",
    answer:
      "No. It validates your timesheet by showing the difference between what was reported and what was observed. You keep your existing billing or PM workflow."
  },
  {
    question: "Who gets value first?",
    answer:
      "Freelancers billing hourly get immediate protection against underbilling and overreporting. Startup engineering managers use it to reduce sprint estimation drift."
  },
  {
    question: "Is this tracking screenshots or private content?",
    answer:
      "No screenshots. The app stores lightweight telemetry: activity windows, keystroke counts, and commit metadata."
  }
];

export default function Home() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK as string;

  return (
    <main className="px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <header className="rounded-2xl border border-[#2f3943] bg-[#111827]/80 p-8 shadow-[0_0_60px_rgba(47,129,247,0.1)] sm:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#58a6ff]">Work Hours Tracker</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Track actual coding hours vs reported time.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-[#9fb0c3]">
            Stop guessing how long engineering work really takes. Compare IDE activity, keystrokes, and git history against timesheet entries to expose estimate drift before it breaks delivery plans.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={paymentLink}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "shadow-[0_10px_35px_rgba(47,129,247,0.35)]")}
            >
              Start Accurate Tracking for $8/mo
            </a>
            <Link href="/access" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              I Already Purchased
            </Link>
          </div>
          <p className="mt-3 text-sm text-[#9fb0c3]">
            Hosted Stripe checkout. Cancel anytime.
          </p>
        </header>

        <section id="problem" className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Drift</CardTitle>
              <CardDescription>Developers overestimate coding and forget context switching overhead.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb0c3]">
              Teams report coding-heavy days, but actual deep-work windows are fragmented by debugging, sync meetings, and review cycles.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Billing Risk</CardTitle>
              <CardDescription>Freelancers lose revenue when real effort is not captured accurately.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb0c3]">
              Underbilling creates cash-flow pressure. Overbilling creates trust risk. Both come from inaccurate memory-based timesheets.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Planning Blind Spots</CardTitle>
              <CardDescription>Startup managers miss sprint goals because forecasts rely on self-reported effort.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-[#9fb0c3]">
              This tool exposes the gap so standups and retrospectives can focus on the real blockers.
            </CardContent>
          </Card>
        </section>

        <section id="solution" className="rounded-2xl border border-[#2f3943] bg-[#111827]/70 p-8 sm:p-10">
          <h2 className="text-3xl font-semibold">What you get</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-5">
              <h3 className="text-xl font-semibold">Automatic Activity Capture</h3>
              <p className="mt-2 text-[#9fb0c3]">
                Desktop agent monitors IDE usage, keystroke activity patterns, and commit events so your timeline is based on evidence, not memory.
              </p>
            </div>
            <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-5">
              <h3 className="text-xl font-semibold">Gap Analytics Dashboard</h3>
              <p className="mt-2 text-[#9fb0c3]">
                Visualize actual vs reported hours by day, track over/under-reporting, and identify where estimation assumptions break down.
              </p>
            </div>
            <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-5">
              <h3 className="text-xl font-semibold">Paywall + Access Cookie</h3>
              <p className="mt-2 text-[#9fb0c3]">
                Purchase once through Stripe Payment Link, verify your checkout email, then unlock the full dashboard with a secure access cookie.
              </p>
            </div>
            <div className="rounded-lg border border-[#2f3943] bg-[#0f1723] p-5">
              <h3 className="text-xl font-semibold">Actionable for Freelancers and Managers</h3>
              <p className="mt-2 text-[#9fb0c3]">
                Freelancers tighten billing confidence. Managers calibrate sprint plans using real coding bandwidth.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Simple Pricing</CardTitle>
              <CardDescription>One plan for freelancers, consultants, and startup engineering teams.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">$8<span className="text-base font-medium text-[#9fb0c3]">/month</span></p>
              <ul className="mt-5 space-y-2 text-sm text-[#9fb0c3]">
                <li>Desktop activity tracking agent</li>
                <li>Actual vs reported comparison dashboard</li>
                <li>14-day gap trend chart and accuracy score</li>
                <li>Email-based paywall unlock for purchased users</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ready to start?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href={paymentLink} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "default", size: "lg" })}>
                Buy Now
              </a>
              <Link href="/access" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Unlock Dashboard
              </Link>
            </CardContent>
          </Card>
        </section>

        <section id="faq">
          <h2 className="text-3xl font-semibold">FAQ</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[#9fb0c3]">{faq.answer}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
