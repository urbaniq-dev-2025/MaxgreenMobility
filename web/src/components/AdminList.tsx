"use client";

import { AdminField } from "@/components/AdminField";

export function AdminStringList({
  label,
  items,
  onChange,
  placeholder = "Value",
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold">{label}</div>
        <button
          type="button"
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-bold ring-1 ring-border hover:bg-white/90"
          onClick={() => onChange([...(items ?? []), ""])}
        >
          + Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((v, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="rounded-xl px-3 py-2 text-xs font-bold ring-1 ring-border hover:bg-surface/60"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-muted">No items.</div> : null}
      </div>
    </div>
  );
}

export function AdminObjectList<T extends Record<string, unknown>>({
  label,
  items,
  onChange,
  schema,
  newItem,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  schema: { key: keyof T; label: string; textarea?: boolean }[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold">{label}</div>
        <button
          type="button"
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-bold ring-1 ring-border hover:bg-white/90"
          onClick={() => onChange([...(items ?? []), newItem()])}
        >
          + Add
        </button>
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-[var(--radius-lg)] border border-border bg-white/80 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-muted">Item {idx + 1}</div>
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-xs font-bold ring-1 ring-border hover:bg-surface/60"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
              >
                Remove
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {schema.map((f) => (
                <AdminField
                  key={String(f.key)}
                  label={f.label}
                  textarea={f.textarea}
                  value={String(it[f.key] ?? "")}
                  onChange={(v) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], [f.key]: v } as T;
                    onChange(next);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-sm text-muted">No items.</div> : null}
      </div>
    </div>
  );
}

