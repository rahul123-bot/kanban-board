"use client";

import { useDraggable } from "@dnd-kit/core";
import { CalendarDays, GripVertical, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TaskCardProps {
  id: string;
  title: string;
  due_date?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export default function TaskCard({
  id,
  title,
  due_date,
  onDelete,
  onEdit,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const dueDateLabel = due_date
    ? new Date(due_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative cursor-default border-white/70 bg-white/95 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-22px_rgba(15,23,42,0.32)]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent opacity-70" />
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            {...listeners}
            {...attributes}
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-800"
            aria-label={`Drag ${title}`}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-6 text-slate-900 transition group-hover:text-slate-950">
              {title}
            </p>

            {dueDateLabel && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <CalendarDays className="h-3.5 w-3.5" />
                Due {dueDateLabel}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <Button
            onClick={() => onEdit(id, title)}
            variant="outline"
            size="sm"
            className="px-3 text-slate-600"
          >
            <PencilLine className="h-4 w-4" />
            Edit
          </Button>

          <Button
            onClick={() => onDelete(id)}
            variant="destructive"
            size="sm"
            className="px-3"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
