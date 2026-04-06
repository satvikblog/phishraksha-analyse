import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "soft-glow relative overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl",
        className,
      )}
      {...props}
    />
  );
}
