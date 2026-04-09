"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLSpanElement>(null);

  const position = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({
      top: r.top + window.scrollY,
      left: r.left + r.width / 2 + window.scrollX,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    position();
    function handleClose(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, [open, position]);

  const tooltip = open && typeof document !== "undefined"
    ? createPortal(
        <div
          className="pointer-events-none absolute z-[9999] w-64 -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-zinc-900/95 px-3.5 py-2.5 text-xs leading-relaxed text-zinc-300 shadow-xl backdrop-blur-sm"
          style={{ top: coords.top - 8, left: coords.left }}
        >
          <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-zinc-900/95" />
          {content}
        </div>,
        document.body
      )
    : null;

  return (
    <span ref={btnRef} className={cn("relative inline-flex", className)}>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); setOpen((v) => !v); } }}
        onMouseEnter={() => { position(); setOpen(true); }}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex size-4 cursor-pointer items-center justify-center rounded-full bg-white/8 text-[10px] font-medium text-zinc-500 transition-colors hover:bg-white/15 hover:text-zinc-300 focus:outline-none"
        aria-label="Info"
      >
        i
      </span>
      {tooltip}
    </span>
  );
}
