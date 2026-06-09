"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { CalendarDays, GripVertical, PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TaskCardProps {
  id: string;
  title: string;
  due_date?: string | null;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  activeId?: string | null;
}

export default function TaskCard({
  id,
  title,
  due_date,
  onDelete,
  onEdit,
  activeId,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touchDetected = typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || window.matchMedia?.("(pointer: coarse)")?.matches);
    setIsTouch(Boolean(touchDetected));
  }, []);

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

  const cardClass = isTouch
    ? "group relative cursor-grab active:cursor-grabbing border-white/70 bg-white/95 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-22px_rgba(15,23,42,0.32)]"
    : "group relative cursor-default border-white/70 bg-white/95 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-22px_rgba(15,23,42,0.32)]";

  const isActive = Boolean(activeId && activeId === id);
  const activeClass = isActive ? "ring-2 ring-sky-400 scale-105" : "";

  return (
    <Card
      ref={setNodeRef}
      // on touch devices attach drag listeners + attributes to the whole card for better UX
      {...(isTouch ? { ...listeners, ...attributes } : {})}
      onPointerDown={() => console.log("task: pointerdown", id)}
      onTouchStart={() => console.log("task: touchstart", id)}
      style={
        isTouch
          ? { ...(style || {}), touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }
          : { ...(style || {}), userSelect: "none", WebkitUserSelect: "none" }
      }
      className={`${cardClass} ${activeClass}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent opacity-70" />
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            // always keep attributes on the handle for keyboard accessibility
            {...attributes}
            // on non-touch (pointer) devices attach listeners to the handle only
            {...(!isTouch ? listeners : {})}
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
