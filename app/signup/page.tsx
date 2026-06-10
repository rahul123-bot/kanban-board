"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    await supabase.auth.signOut({ scope: "local" });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account consent",
        },
      },
    });

    if (error) {
      console.log(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:px-8 lg:py-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(241,245,249,0.82))]" />
      <div className="absolute left-[-8rem] top-20 -z-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
      <div className="absolute right-[-6rem] bottom-16 -z-10 h-80 w-80 rounded-full bg-slate-900/5 blur-3xl" />

      <section className="relative order-2 overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 p-10 text-white shadow-[0_30px_100px_-35px_rgba(15,23,42,0.6)] lg:order-1 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            Join Kanban Pro
          </div>

          <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
            Start with a polished workspace and scale your process cleanly.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
            Clear onboarding, elegant UI, and a thoughtful task flow that feels
            ready for real users from day one.
          </p>
        </div>

        <div className="relative z-10 grid gap-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              <p className="font-medium">Fast account setup</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Create an account with email/password or continue with Google.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-3xl font-semibold">1 min</p>
              <p className="mt-1 text-sm text-white/70">To get started</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-3xl font-semibold">100%</p>
              <p className="mt-1 text-sm text-white/70">Responsive layout</p>
            </div>
          </div>
        </div>
      </section>

      <section className="order-1 flex items-center justify-center py-4 lg:order-2 lg:py-0">
        <Card className="w-full max-w-lg border-white/70 bg-white/85 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Create account
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  Sign up
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Build your board and start organizing work in minutes.
                </p>
              </div>

              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20 sm:flex">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-8 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
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

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="pl-11"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              <Button
                onClick={handleSignup}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                onClick={handleGoogleSignup}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Globe className="h-4 w-4" />
                Continue with Google
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                Already a member?
              </div>
              <Link href="/login" className="font-semibold text-slate-950 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
