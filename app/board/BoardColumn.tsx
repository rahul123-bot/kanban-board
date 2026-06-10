"use client";

import { useDroppable } from "@dnd-kit/core";
import { CircleDashed, Layers3 } from "lucide-react";

import TaskCard from "@/components/task/TaskCard";
import type { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Array<Task & { due_date?: string | null }>;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  activeId?: string | null;
}

const columnTones: Record<
  string,
  {
    accent: string;
    count: string;
    empty: string;
  }
> = {
  todo: {
    accent: "from-sky-400 to-sky-700",
    count: "bg-sky-50 text-sky-700 border-sky-100",
    empty: "text-sky-500",
  },
  "in-progress": {
    accent: "from-amber-400 to-amber-700",
    count: "bg-amber-50 text-amber-700 border-amber-100",
    empty: "text-amber-500",
  },
  review: {
    accent: "from-slate-400 to-slate-700",
    count: "bg-slate-50 text-slate-700 border-slate-200",
    empty: "text-slate-500",
  },
  done: {
    accent: "from-emerald-400 to-emerald-700",
    count: "bg-emerald-50 text-emerald-700 border-emerald-100",
    empty: "text-emerald-500",
  },
};

export default function BoardColumn({
  id,
  title,
  tasks,
  onDelete,
  onEdit,
  activeId,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const tone = columnTones[id] ?? columnTones.todo;

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "group relative min-h-[220px] sm:min-h-[550px] border-white/70 bg-white/85 transition-all duration-200",
        isOver
          ? "scale-[1.01] ring-2 ring-sky-400/70 shadow-[0_24px_80px_-35px_rgba(14,165,233,0.35)]"
          : "shadow-[0_18px_60px_-30px_rgba(15,23,42,0.28)]"
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <CardHeader className="pb-4">
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r shadow-sm",
              tone.accent
            )}
          />
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm shadow-slate-900/15">
                <Layers3 className="h-4 w-4" />
              </div>

              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Task column
                </p>
              </div>
            </div>
          </div>

          <span
            className={cn(
              "inline-flex min-w-11 justify-center rounded-full border px-3 py-1 text-sm font-semibold shadow-sm",
              tone.count
            )}
          >
            {tasks.length}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-12 text-center">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white shadow-sm",
                tone.empty
              )}
            >
              <CircleDashed className="h-6 w-6" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-700">
              No tasks yet
            </p>
            <p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">
              Drag tasks here or create a new one to keep work moving.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              due_date={task.due_date ?? undefined}
              onDelete={onDelete}
              onEdit={onEdit}
              activeId={activeId}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
