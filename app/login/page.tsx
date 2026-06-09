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
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data?.session) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        // In some cases the session may not be immediately available client-side
        toast.success("Login successful — redirecting...");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account consent",
          },
        },
      });

      if (error) {
        console.error(error);
        toast.error(error.message || "Google sign-in failed");
        return;
      }

      // If the provider returns a URL or session, the browser will redirect automatically
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-8 lg:py-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(241,245,249,0.82))]" />
      <div className="absolute left-[-8rem] top-20 -z-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
      <div className="absolute right-[-6rem] bottom-16 -z-10 h-80 w-80 rounded-full bg-slate-900/5 blur-3xl" />

      <section className="relative hidden overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 p-10 text-white shadow-[0_30px_100px_-35px_rgba(15,23,42,0.6)] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.2),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            Kanban Pro
          </div>

          <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
            A premium workspace that makes task management feel effortless.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
            Clean structure, smooth collaboration, and a polished interface
            designed to impress in interviews and in production.
          </p>
        </div>

        <div className="relative z-10 grid gap-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <p className="font-medium">Secure Google sign in</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Fast access with a refined login flow and clear session handling.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-3xl font-semibold">24/7</p>
              <p className="mt-1 text-sm text-white/70">Real-time ready</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-3xl font-semibold">4</p>
              <p className="mt-1 text-sm text-white/70">Task lanes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center py-4 lg:py-0">
        <Card className="w-full max-w-lg border-white/70 bg-white/85 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Welcome back
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                  Sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Access your boards and continue where you left off.
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
                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-sky-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </label>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Logging in..." : "Login"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                onClick={handleGoogleLogin}
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
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                New here?
              </div>
              <Link href="/signup" className="font-semibold text-slate-950 hover:underline">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
