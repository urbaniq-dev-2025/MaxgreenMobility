"use client";

export function AdminField({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted">{label}</label>
      {textarea ? (
        <textarea
          className="min-h-24 w-full rounded-xl border border-border px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

