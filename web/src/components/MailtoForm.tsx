"use client";

import { useMemo } from "react";

type Field =
  | { kind: "text" | "email" | "tel"; name: string; label: string; placeholder?: string; required?: boolean; colSpan?: 1 | 2 }
  | { kind: "select"; name: string; label: string; required?: boolean; colSpan?: 1 | 2; options: { label: string; value: string }[] }
  | { kind: "textarea"; name: string; label: string; placeholder?: string; required?: boolean; colSpan?: 1 | 2; rows?: number }
  | { kind: "radio"; name: string; label: string; colSpan?: 1 | 2; options: { label: string; value: string }[]; defaultValue?: string };

export function MailtoForm({
  toEmail,
  subjectPrefix,
  fields,
  submitLabel,
  footerHint,
  className = "",
}: {
  toEmail: string;
  subjectPrefix: string;
  fields: Field[];
  submitLabel: string;
  footerHint?: string;
  className?: string;
}) {
  const radioDefaults = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of fields) {
      if (f.kind === "radio" && f.defaultValue) map.set(f.name, f.defaultValue);
    }
    return map;
  }, [fields]);

  return (
    <form
      className={`grid gap-4 sm:grid-cols-2 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        // Ensure radio default is applied when nothing chosen.
        for (const [name, val] of radioDefaults.entries()) {
          if (!fd.get(name)) fd.set(name, val);
        }

        const subject = encodeURIComponent(subjectPrefix);
        const lines: string[] = [];
        for (const f of fields) {
          if (f.kind === "radio") continue; // handled via FormData
          const v = String(fd.get(f.name) ?? "");
          if (v) lines.push(`${f.label}: ${v}`);
        }
        // Include radio values too
        for (const f of fields) {
          if (f.kind !== "radio") continue;
          const v = String(fd.get(f.name) ?? "");
          if (v) lines.push(`${f.label}: ${v}`);
        }

        const body = encodeURIComponent(lines.join("\n"));
        window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
      }}
    >
      {fields.map((f) => {
        const col = f.colSpan === 2 ? "sm:col-span-2" : "";

        if (f.kind === "select") {
          return (
            <div key={f.name} className={`space-y-1 ${col}`}>
              <label className="text-xs font-semibold text-muted">{f.label}</label>
              <select
                name={f.name}
                required={f.required}
                className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Select an option
                </option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (f.kind === "textarea") {
          return (
            <div key={f.name} className={`space-y-1 ${col}`}>
              <label className="text-xs font-semibold text-muted">{f.label}</label>
              <textarea
                name={f.name}
                required={f.required}
                rows={f.rows ?? 5}
                className="min-h-28 w-full rounded-xl border border-border px-3 py-2 text-sm"
                placeholder={f.placeholder}
              />
            </div>
          );
        }

        if (f.kind === "radio") {
          return (
            <div key={f.name} className={`space-y-2 ${col}`}>
              <div className="text-xs font-semibold text-muted">{f.label}</div>
              <div className="flex flex-wrap gap-4 text-sm">
                {f.options.map((o) => (
                  <label key={o.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={f.name}
                      value={o.value}
                      defaultChecked={(f.defaultValue ?? "") === o.value}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={f.name} className={`space-y-1 ${col}`}>
            <label className="text-xs font-semibold text-muted">{f.label}</label>
            <input
              name={f.name}
              type={f.kind}
              required={f.required}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              placeholder={f.placeholder}
            />
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <button
          className="mt-2 w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand/90"
          type="submit"
        >
          {submitLabel}
        </button>
        {footerHint ? <div className="mt-2 text-center text-xs text-muted">{footerHint}</div> : null}
      </div>
    </form>
  );
}

