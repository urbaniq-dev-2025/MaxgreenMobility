"use client";

import { useRef, useState } from "react";

export function AdminMediaField({
  label,
  value,
  onChange,
  folder = "uploads",
  accept,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  folder?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const data = (await res.json()) as { path: string };
      onChange(data.path);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted">{label}</label>
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/media/uploads/..."
        />
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
        <button
          type="button"
          className="shrink-0 rounded-xl bg-white/80 px-4 py-2 text-sm font-bold ring-1 ring-border hover:bg-white/90 disabled:opacity-60"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div className="text-[11px] text-muted">
        Uploads to <span className="font-semibold">public/media/{folder}</span> and fills the path automatically.
      </div>
    </div>
  );
}

