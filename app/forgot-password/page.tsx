"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password reset email sent.");
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
                Password recovery
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight">
                Regain access with a clean, guided reset flow.
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/70">
                We’ll send a secure reset link so you can get back into your workspace in minutes.
              </p>
            </div>

            <div className="relative z-10 rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <p className="font-medium">Protected by Supabase auth</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Reset links stay tied to your account for a smoother, safer recovery experience.
              </p>
            </div>
          </aside>

          <Card className="rounded-none border-0 bg-transparent shadow-none">
            <CardContent className="space-y-6 px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                    <Mail className="h-3.5 w-3.5" />
                    Recovery
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    Forgot password
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter your email and we’ll send a link to set a new password.
                  </p>
                </div>

                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20 sm:flex">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="Enter email"
                      className="pl-11"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                    />
                  </div>
                </label>

                <Button onClick={handleReset} className="w-full" size="lg">
                  Send reset email
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {message && (
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                    {message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Remembered it?</span>
                <Link href="/login" className="font-semibold text-slate-950 hover:underline">
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
