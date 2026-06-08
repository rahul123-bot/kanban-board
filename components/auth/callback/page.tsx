"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(241,245,249,0.78))]" />

      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_28px_90px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
          <Sparkles className="h-7 w-7" />
        </div>

        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Secure handoff
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Completing sign in
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Taking you to your boards.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-500">
          <LoaderCircle className="h-4 w-4 animate-spin text-sky-500" />
          Verifying session
        </div>
      </div>
    </main>
  );
}
