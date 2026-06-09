"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import {
  CalendarDays,
  ChevronLeft,
  CircleDashed,
  LogOut,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import BoardColumn from "@/app/board/BoardColumn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import type { Task } from "@/types/task";

interface BoardMember {
  id: string;
  email: string;
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;

  const [tasks, setTasks] = useState([] as Task[]);
  const [title, setTitle] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [editingId, setEditingId] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState([] as BoardMember[]);

  const [isOwner, setIsOwner] = useState(false);

  const [dueDate, setDueDate] = useState("");
  const channelRef = useRef(null as ReturnType<typeof supabase.channel> | null);

  const fetchTasks = useCallback(async () => {
       
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("board_id", boardId);
        console.log(data);
      if (error) {
      console.error(error);
      return;
    }

    setTasks(data || []);
  }, [boardId]);
  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .eq("board_id", boardId);

    if (error) {
      console.error(error);
      return;
    }

    setMembers(data || []);
  }, [boardId]);
const inviteMember = async () => {
  if (!inviteEmail.trim()) return;

  const { error } = await supabase
    .from("board_members")
    .insert({
      board_id: boardId,
      email: inviteEmail,
    });

  if (error) {
    console.error(error);
    return;
  }

  setInviteEmail("");
  fetchMembers();
};
const removeMember = async (memberId: string) => {
  const { error } = await supabase
    .from("board_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    console.error(error);
    return;
  }

  fetchMembers();
};

  useEffect(() => {
    let cancelled = false;

    const verifyBoardAccess = async () => {
      if (!boardId) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: board, error } = await supabase
        .from("boards")
        .select("id")
        .eq("id", boardId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        router.replace("/dashboard");
        return;
      }

      if (board) {
        setIsAuthorized(true);
        setIsOwner(true);
        return;
      }
      const {
          data: memberAccess,
        } = await supabase
         .from("board_members")
         .select("*")
         .eq("board_id", boardId)
         .eq("email", user.email);
        if (memberAccess) {
        setIsAuthorized(true);
        return;
      }      

      const { data: legacyBoard, error: legacyError } = await supabase
        .from("boards")
        .select("id")
        .eq("id", boardId)
        .is("user_id", null)
        .maybeSingle();

      if (cancelled) return;

      if (legacyError || !legacyBoard) {
        router.replace("/dashboard");
        return;
      }

      const { error: claimError } = await supabase
        .from("boards")
        .update({ user_id: user.id })
        .eq("id", boardId);

      if (cancelled) return;

      if (claimError) {
        router.replace("/dashboard");
        return;
      }

      setIsAuthorized(true);
    };

    verifyBoardAccess();

    return () => {
      cancelled = true;
    };
  }, [boardId, router]);

  useEffect(() => {
    
    if (!isAuthorized) {
      return;
    }

    let active = true;

    const setupRealtime = async () => {
      await fetchTasks();
      await fetchMembers();

      if (!active) {
        return;
      }

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase.channel(`tasks-realtime-${boardId}`);

      channel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `board_id=eq.${boardId}`,
          },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    void setupRealtime();

    return () => {
      active = false;

      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [boardId, fetchMembers, fetchTasks, isAuthorized]);

  if (!isAuthorized) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(241,245,249,0.78))]" />

        <Card className="w-full max-w-md border-white/70 bg-white/85 text-center shadow-[0_28px_90px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="px-8 py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
              <CircleDashed className="h-7 w-7 animate-spin" />
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              Loading board
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Checking access and syncing your tasks.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const createTask = async () => {
    if (!title.trim()) return;

    const { error } = await supabase.from("tasks").insert({
      board_id: boardId,
      title,
      status: "todo",
      due_date: dueDate || null,
    });

    if (error) {
      console.error(error);
      toast.error("Could not create task");
      return;
    }

    toast.success("Task created");
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error(error);
      toast.error("Could not delete task");
      return;
    }

    toast.success("Task deleted");
    fetchTasks();
  };

  const startEdit = (taskId: string, taskTitle: string) => {
    setEditingId(taskId);
    setEditTitle(taskTitle);
  };

  const saveTask = async () => {
    if (!editTitle.trim()) return;

    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTitle,
      })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      toast.error("Could not save task");
      return;
    }

    toast.success("Task updated");
    setEditingId("");
    setEditTitle("");

    fetchTasks();
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        status,
      })
      .eq("id", taskId);

    if (error) {
      console.error(error);
      toast.error("Could not move task");
      return;
    }

    fetchTasks();
  };

  const [activeId, setActiveId] = useState(null as string | null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
    console.log("dnd: start", event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    console.log("dnd: end", active?.id, over?.id);

    if (!over) return;

    await updateTaskStatus(active.id.toString(), over.id.toString());
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 8 } })
  );

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const progressTasks = tasks.filter((task) => task.status === "in-progress");
  const reviewTasks = tasks.filter((task) => task.status === "review");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const stats = [
    {
      label: "Total Tasks",
      value: tasks.length,
      accent: "from-sky-500 to-slate-900",
    },
    {
      label: "Todo",
      value: todoTasks.length,
      accent: "from-sky-400 to-sky-700",
    },
    {
      label: "In Progress",
      value: progressTasks.length,
      accent: "from-amber-400 to-amber-700",
    },
    {
      label: "Done",
      value: doneTasks.length,
      accent: "from-emerald-400 to-emerald-700",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.86),_rgba(241,245,249,0.9))]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                Real-time board
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Kanban Board
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Organize tasks, move work through each stage, and keep the flow
                clear with a responsive interface that feels premium.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <ChevronLeft className="h-4 w-4" />
                  Back to boards
                </Link>
              </Button>

                <Button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    toast.message("Signed out successfully");
                    router.push("/login");
                  }}
                  variant="outline"
                >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-white/70 bg-white/85 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.3)]">
              <CardContent className="p-5">
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${stat.accent}`} />
                <p className="mt-4 text-sm text-slate-500">{stat.label}</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                  {stat.value}
                </h2>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-white/70 bg-white/85 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.3)] backdrop-blur">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>
                  Add a task, choose an optional due date, then drag it across
                  columns as work progresses.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 lg:flex-row">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className="lg:flex-1"
              />

              <div className="relative lg:w-56">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-11"
                />
              </div>

              <Button onClick={createTask} size="lg">
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {editingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-[0_30px_100px_-35px_rgba(15,23,42,0.45)]">
              <CardHeader>
                <CardTitle>Edit Task</CardTitle>
                <CardDescription>Refine the task title before saving.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Task title"
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button onClick={() => setEditingId("")} variant="outline">
                    Cancel
                  </Button>

                  <Button onClick={saveTask}>Save changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <Card className="border-white/70 bg-white/85 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.3)] backdrop-blur">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>Invite Members</CardTitle>
                <CardDescription>
                  Add collaborators to this board and keep the workflow moving together.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@email.com"
                  className="pl-11"
                />
              </div>

              <Button onClick={inviteMember} size="lg" className="w-full lg:w-auto">
                <Send className="h-4 w-4" />
                Invite member
              </Button>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Board members</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {members.length} total
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {members.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                    No members yet. Invite someone to start collaborating.
                  </div>
                ) : (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {member.email}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          Board collaborator
                        </p>
                      </div>

                      {isOwner && (
                        <Button
                          onClick={() => removeMember(member.id)}
                          variant="destructive"
                          size="sm"
                          className="shrink-0"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="md:overflow-x-auto overflow-visible pb-2" style={{ touchAction: 'pan-y' }}>
            <div className="grid min-w-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <BoardColumn
                id="todo"
                title="Todo"
                tasks={todoTasks}
                onDelete={deleteTask}
                onEdit={startEdit}
                activeId={activeId}
              />

              <BoardColumn
                id="in-progress"
                title="In Progress"
                tasks={progressTasks}
                onDelete={deleteTask}
                onEdit={startEdit}
                activeId={activeId}
              />

              <BoardColumn
                id="review"
                title="Review"
                tasks={reviewTasks}
                onDelete={deleteTask}
                onEdit={startEdit}
                activeId={activeId}
              />

              <BoardColumn
                id="done"
                title="Done"
                tasks={doneTasks}
                onDelete={deleteTask}
                onEdit={startEdit}
                activeId={activeId}
              />
            </div>
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="pointer-events-none z-50 -translate-y-2 transform-gpu">
                <Card className="w-64 border-white/70 bg-white/100 shadow-2xl scale-105 transform transition-all duration-150">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold leading-6 text-slate-900">
                      {tasks.find((t) => t.id === activeId)?.title}
                    </p>
                    {tasks.find((t) => t.id === activeId)?.due_date && (
                      <p className="mt-2 text-xs text-slate-500">
                        Due {new Date(tasks.find((t) => t.id === activeId)!.due_date!).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
