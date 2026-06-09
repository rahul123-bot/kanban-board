"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  FolderKanban,
  LayoutGrid,
  LogOut,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Board {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [boards, setBoards] = useState([] as Board[]);
  const [boardName, setBoardName] = useState("");

  const [editingBoardId, setEditingBoardId] = useState("");
  const [editBoardName, setEditBoardName] = useState("");
  const router = useRouter();

  const fetchBoards = async () => {
   
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: invitedBoards } = await supabase
    .from("board_members")
    .select("board_id")
    .eq("email", user.email);

  const invitedIds =
    invitedBoards?.map(
      (item) => item.board_id
    ) || [];

  const { data } = await supabase
    .from("boards")
    .select("*")
    .or(
      `user_id.eq.${user.id},id.in.(${invitedIds.join(",")})`
    )
    .order("created_at", {
      ascending: false,
    });

  if (data) {
    setBoards(data);
  }
};
  const restoreLegacyBoards = async (userId: string) => {
    const { data: legacyBoards, error } = await supabase
      .from("boards")
      .select("id")
      .is("user_id", null);

    if (error || !legacyBoards?.length) {
      return;
    }

    const legacyBoardIds = legacyBoards.map((board) => board.id);

    await supabase
      .from("boards")
      .update({ user_id: userId })
      .in("id", legacyBoardIds);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.message("Signed out successfully");
    router.replace("/login");
  };

  const createBoard = async () => {
    if (!boardName.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    await supabase.from("boards").insert({
      name: boardName,
      user_id: user.id,
    });

    toast.success("Board created");
    setBoardName("");
    fetchBoards();
  };

  const updateBoard = async () => {
    if (!editBoardName.trim()) return;

    const { error } = await supabase
      .from("boards")
      .update({
        name: editBoardName,
      })
      .eq("id", editingBoardId);

    if (error) {
      console.error(error);
      return;
    }

    setEditingBoardId("");
    setEditBoardName("");

    toast.success("Board updated");
    fetchBoards();
  };

  const deleteBoard = async (boardId: string) => {
    const confirmed = window.confirm("Delete this board?");

    if (!confirmed) return;

    const { error } = await supabase.from("boards").delete().eq("id", boardId);

    if (error) {
      console.error(error);
      toast.error("Could not delete board");
      return;
    }

    toast.success("Board deleted");
    fetchBoards();
  };

  useEffect(() => {
    const loadBoards = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: ownedBoards } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!ownedBoards?.length) {
        await restoreLegacyBoards(user.id);
      }

      fetchBoards();
    };

    loadBoards();
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.86),_rgba(241,245,249,0.9))]" />
      <div className="absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
      <div className="absolute right-[-6rem] top-1/2 -z-10 h-80 w-80 rounded-full bg-slate-900/5 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                Workspace overview
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                My Boards
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage and organize projects with a clear, premium workspace
                built to impress from first glance.
              </p>
            </div>

            <Button onClick={handleLogout} variant="outline" className="self-start">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="relative border-white/70 bg-white/85 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.3)] backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Create New Board</CardTitle>
                  <CardDescription>
                    Spin up a new workspace for a sprint, client, or project.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <Input
                    value={boardName}
                    onChange={(e: any) => setBoardName(e.target.value)}
                    placeholder="Enter board name..."
                    className="md:flex-1"
                  />

                  <Button onClick={createBoard} size="lg">
                    <FolderKanban className="h-4 w-4" />
                    Create Board
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-white/70 bg-slate-950 text-white shadow-[0_24px_80px_-35px_rgba(15,23,42,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />
            <CardContent className="relative flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-white/70">
                <BarChart3 className="h-5 w-5 text-sky-300" />
                <span className="text-sm font-medium uppercase tracking-[0.22em]">
                  Quick stat
                </span>
              </div>

              <div>
                <p className="text-sm text-white/70">Total Boards</p>
                <h2 className="mt-2 text-5xl font-semibold tracking-tight">
                  {boards.length}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                  A compact snapshot of your active workspaces.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium">Organized</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Flow
                  </p>
                  <p className="mt-1 text-sm font-medium">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {boards.map((board: Board) => (
            <Card
              key={board.id}
              className="group relative border-white/70 bg-white/85 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_80px_-30px_rgba(15,23,42,0.42)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="h-2 w-16 rounded-full bg-gradient-to-r from-sky-400 to-slate-900" />
                    <CardTitle className="text-xl">{board.name}</CardTitle>
                    <CardDescription>
                      Open this board to manage tasks, priorities, and progress.
                    </CardDescription>
                  </div>

                  <div className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition group-hover:scale-105">
                    <LayoutGrid className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between gap-3 pt-2">
                <Button asChild variant="ghost" size="sm" className="px-0 text-slate-600">
                  <Link href={`/board/${board.id}`}>
                    Open board
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingBoardId(board.id);
                      setEditBoardName(board.name);
                    }}
                    variant="outline"
                    size="icon-sm"
                  >
                    <PencilLine className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => deleteBoard(board.id)}
                    variant="destructive"
                    size="icon-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {boards.length === 0 && (
          <Card className="border-dashed border-slate-300 bg-white/70 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
                <FolderKanban className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                No boards yet
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Create your first board to begin organizing tasks in a clean,
                interview-ready workspace.
              </p>

              <Button onClick={createBoard} className="mt-6" size="lg">
                Create your first board
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {editingBoardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-[0_30px_100px_-35px_rgba(15,23,42,0.45)]">
            <CardHeader>
              <CardTitle>Edit Board</CardTitle>
              <CardDescription>Update the name without changing any tasks.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                value={editBoardName}
                onChange={(e: any) => setEditBoardName(e.target.value)}
                placeholder="Board name"
              />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  onClick={() => setEditingBoardId("")}
                  variant="outline"
                  className="sm:w-auto"
                >
                  Cancel
                </Button>

                <Button onClick={updateBoard} className="sm:w-auto">
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
