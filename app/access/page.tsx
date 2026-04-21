import Link from "next/link";
import { Suspense } from "react";

import { UnlockAccess } from "@/components/UnlockAccess";
import { buttonVariants } from "@/components/ui/button";

export default function AccessPage() {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK as string;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-3xl space-y-6">
        <Suspense
          fallback={
            <div className="rounded-xl border border-[#2f3943] bg-[#111827]/80 p-8 text-center text-[#9fb0c3]">
              Loading access panel...
            </div>
          }
        >
          <UnlockAccess />
        </Suspense>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <a href={paymentLink} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "default" })}>
            Purchase $8/mo Access
          </a>
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
