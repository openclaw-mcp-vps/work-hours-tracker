import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("rounded-xl border border-[#2f3943] bg-[#111827]/80", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("flex flex-col gap-1.5 p-6 pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return <h3 className={cn("text-lg font-semibold text-[#e6edf3]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>): React.JSX.Element {
  return <p className={cn("text-sm text-[#9fb0c3]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("p-6 pt-2", className)} {...props} />;
}
