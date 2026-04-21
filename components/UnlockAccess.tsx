"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UnlockAccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const next = searchParams.get("next") ?? "/dashboard";

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to grant access.");
      }

      router.push(next);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to grant access.";
      setStatus(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Unlock Your Dashboard</CardTitle>
        <CardDescription>
          Enter the same email used at Stripe checkout. Access is granted via secure cookie.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="h-10 w-full rounded-md border border-[#2f3943] bg-[#0f1723] px-3 text-[#e6edf3] outline-none focus:ring-2 focus:ring-[#2f81f7]"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Checking purchase..." : "Unlock Access"}
          </Button>
        </form>
        {status ? <p className="mt-3 text-sm text-[#f0883e]">{status}</p> : null}
      </CardContent>
    </Card>
  );
}
