"use client";

import { useId, useState } from "react";

export function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((it, idx) => {
        const open = openIndex === idx;
        const contentId = `${baseId}-${idx}`;
        return (
          <div key={it.q} className="rounded-[var(--radius-lg)] border border-border bg-surface">
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold"
              aria-expanded={open}
              aria-controls={contentId}
              onClick={() => setOpenIndex(open ? null : idx)}
              type="button"
            >
              <span>{it.q}</span>
              <span className="text-muted">{open ? "–" : "+"}</span>
            </button>
            {open ? (
              <div id={contentId} className="px-5 pb-4 text-sm text-muted">
                {it.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

