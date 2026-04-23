"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/Button";

export function AdminUploader({
  label = "Upload media",
  folderDefault = "uploads",
  onUploaded,
}: {
  label?: string;
  folderDefault?: string;
  onUploaded?: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [folder, setFolder] = useState(folderDefault);
  const [busy, setBusy] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
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
      setLastPath(data.path);
      onUploaded?.(data.path);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-white p-4">
      <div className="text-sm font-extrabold">{label}</div>
      <div className="mt-1 text-xs text-muted">
        Local-only: uploads into <span className="font-semibold">public/media/&lt;folder&gt;</span> and returns a
        <span className="font-semibold"> /media/...</span> path.
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-muted">Folder</label>
          <input
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="uploads"
          />
        </div>
        <div className="flex items-end">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          <Button
            className="w-full"
            onClick={() => inputRef.current?.click()}
          >
            {busy ? "Uploading…" : "Choose file"}
          </Button>
        </div>
      </div>

      {lastPath ? (
        <div className="mt-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
          Uploaded path: <span className="font-semibold">{lastPath}</span>{" "}
          <button
            type="button"
            className="ml-2 text-sm font-semibold text-brand hover:underline"
            onClick={async () => {
              await navigator.clipboard.writeText(lastPath);
            }}
          >
            Copy
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}

