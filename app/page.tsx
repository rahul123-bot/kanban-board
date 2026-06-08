"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const routeUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      router.replace(session ? "/dashboard" : "/login");
    };

    routeUser();
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.1),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(241,245,249,0.8))]" />
      <div className="absolute left-1/2 top-1/4 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/80 p-8 text-center shadow-[0_30px_100px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
          <Sparkles className="h-7 w-7" />
        </div>

        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
          Workspace ready
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Preparing your workspace
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          We are checking your session and taking you to the right place.
        </p>

        <div className="mt-8 overflow-hidden rounded-full bg-slate-100">
          <div className="h-1.5 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-sky-500 via-slate-900 to-sky-400" />
        </div>
      </div>
    </main>
  );
}
