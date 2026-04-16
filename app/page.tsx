export default function Page() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#";

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-xs text-[#58a6ff] uppercase tracking-widest">
          Productivity
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
          Track Actual Coding Hours<br />
          <span className="text-[#58a6ff]">vs Reported Time</span>
        </h1>
        <p className="text-lg text-[#8b949e] max-w-xl mx-auto mb-8">
          Connect your IDE and automatically log every minute you code. Compare real hours against what you report — and finally understand where your time goes.
        </p>
        <a
          href={checkoutUrl}
          className="inline-block bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-semibold px-8 py-3 rounded-lg transition-colors text-base"
        >
          Start Tracking — $8/mo
        </a>
        <p className="mt-3 text-xs text-[#6e7681]">Cancel anytime. No credit card required to try.</p>

        {/* Mock dashboard preview */}
        <div className="mt-14 rounded-xl border border-[#30363d] bg-[#161b22] p-6 text-left">
          <p className="text-xs text-[#6e7681] mb-4 uppercase tracking-widest">This week</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Actual Coded", value: "31h 20m", color: "text-[#58a6ff]" },
              { label: "Reported", value: "40h 00m", color: "text-[#f0883e]" },
              { label: "Discrepancy", value: "-8h 40m", color: "text-[#f85149]" }
            ].map((s) => (
              <div key={s.label} className="bg-[#0d1117] rounded-lg p-4">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-[#6e7681] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { day: "Mon", actual: 75, reported: 100 },
              { day: "Tue", actual: 90, reported: 100 },
              { day: "Wed", actual: 55, reported: 100 },
              { day: "Thu", actual: 80, reported: 100 },
              { day: "Fri", actual: 60, reported: 100 }
            ].map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-xs text-[#6e7681] w-6">{d.day}</span>
                <div className="flex-1 bg-[#0d1117] rounded h-2 overflow-hidden">
                  <div className="h-full bg-[#58a6ff] rounded" style={{ width: `${d.actual}%` }} />
                </div>
                <div className="flex-1 bg-[#0d1117] rounded h-2 overflow-hidden">
                  <div className="h-full bg-[#f0883e] rounded" style={{ width: `${d.reported}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-1 text-xs text-[#6e7681]"><span className="w-2 h-2 rounded-full bg-[#58a6ff] inline-block"></span>Actual</span>
            <span className="flex items-center gap-1 text-xs text-[#6e7681]"><span className="w-2 h-2 rounded-full bg-[#f0883e] inline-block"></span>Reported</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-sm mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Simple Pricing</h2>
        <div className="rounded-xl border border-[#58a6ff] bg-[#161b22] p-8 text-center">
          <p className="text-sm text-[#58a6ff] uppercase tracking-widest mb-2">Pro</p>
          <p className="text-5xl font-bold text-white mb-1">$8</p>
          <p className="text-sm text-[#6e7681] mb-6">per month</p>
          <ul className="text-sm text-[#8b949e] space-y-3 mb-8 text-left">
            {[
              "VS Code & JetBrains plugin",
              "Automatic time tracking",
              "Self-reported hours log",
              "Weekly discrepancy reports",
              "Productivity trend charts",
              "CSV export"
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-[#3fb950]">✓</span> {f}
              </li>
            ))}
          </ul>
          <a
            href={checkoutUrl}
            className="block w-full bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-semibold py-3 rounded-lg transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: "How does the IDE integration work?",
              a: "Install our lightweight plugin for VS Code or JetBrains IDEs. It runs silently in the background, logging active coding sessions without capturing any code or file contents."
            },
            {
              q: "Is my code or data ever uploaded?",
              a: "Never. Only timestamps and session durations are sent to our servers. Your source code stays entirely on your machine."
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Yes. Cancel with one click from your billing portal. You keep access until the end of your billing period with no questions asked."
            }
          ].map((item) => (
            <div key={item.q} className="rounded-lg border border-[#30363d] bg-[#161b22] p-5">
              <p className="font-semibold text-white mb-2">{item.q}</p>
              <p className="text-sm text-[#8b949e]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#21262d] py-6 text-center text-xs text-[#6e7681]">
        © {new Date().getFullYear()} Work Hours Tracker. All rights reserved.
      </footer>
    </main>
  );
}
