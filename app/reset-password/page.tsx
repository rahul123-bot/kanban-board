"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] =
    useState("");

  const router = useRouter();

  const handleUpdate = async () => {
    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (!error) {
      alert("Password updated");
      router.push("/login");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(241,245,249,0.8))]" />

      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.2),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                Secure reset
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight">
                Set a new password and get back to your boards.
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/70">
                Pick a strong new password to finish the recovery flow and return to the dashboard.
              </p>
            </div>

            <div className="relative z-10 rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <p className="font-medium">One final step</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/70">
                This updates the password for your active Supabase session.
              </p>
            </div>
          </aside>

          <Card className="rounded-none border-0 bg-transparent shadow-none">
            <CardContent className="space-y-6 px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Recovery
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    Reset password
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose a new password to secure your account again.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20 sm:flex">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">New password</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="pl-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </label>

                <Button onClick={handleUpdate} className="w-full" size="lg">
                  Update password
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Need a fresh start?</span>
                <Link href="/login" className="font-semibold text-slate-950 hover:underline">
                  Return to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
