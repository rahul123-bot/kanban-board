import * as React from "react";

import { cn } from "@/lib/utils";

type DivProps = Record<string, any>;

const Card = React.forwardRef(({ className, size = "default", ...props }: DivProps & { size?: "default" | "sm" }, ref: any) => {
  return (
    <div
      ref={ref}
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/40 bg-white/95 py-4 text-sm text-card-foreground shadow-[0_20px_60px_-20px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/6 backdrop-blur supports-[backdrop-filter]:bg-white/85 hover:shadow-[0_26px_90px_-24px_rgba(15,23,42,0.36)] transform-gpu will-change-transform data-[size=sm]:gap-3 data-[size=sm]:py-3",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-[1.5rem] px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-semibold tracking-tight group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-[1.5rem] border-t border-white/70 bg-slate-50/90 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
