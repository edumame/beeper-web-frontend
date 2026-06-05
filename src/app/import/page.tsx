"use client";

import Link from "next/link";
import { useState } from "react";
import { useIdentity } from "@/lib/identity";
import { parseContactsCsv, type ContactRow } from "@/lib/import";

const SAMPLE = `name,phone,email
Alice Doe,+14155550111,alice@example.com
Bob Smith,4155550222,bob@example.com`;

export default function ImportPage() {
  const [me] = useIdentity();
  const [csv, setCsv] = useState("");
  const [parsed, setParsed] = useState<ContactRow[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [adminPw, setAdminPw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    { added: number; skipped: number } | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const onPreview = () => {
    setError(null);
    setResult(null);
    const rows = parseContactsCsv(csv);
    if (rows.length === 0) {
      setError(
        "No valid contacts found. Make sure your CSV has a header row with `name` and `phone` columns.",
      );
    }
    setParsed(rows);
    setPicked(Object.fromEntries(rows.map((r) => [r.id, true])));
  };

  const toSubmit = parsed.filter((r) => picked[r.id]);

  const onImport = async () => {
    if (!me || toSubmit.length === 0) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BEEPER_API_URL ?? "https://beeper-v2-host.vercel.app"}/api/admin/contacts/import`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            // Admin password is sent as a Cookie header equivalent so the host
            // can authenticate the bulk import. Once per-user tokens land this
            // collapses to a single bearer token.
            cookie: `beeper_admin=${adminPw}`,
          },
          credentials: "include",
          body: JSON.stringify({ owner: me, contacts: toSubmit }),
        },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || `${res.status} ${res.statusText}`);
      }
      const body = await res.json();
      setResult({ added: body.added, skipped: body.skipped });
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!me) return null;

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto p-container-margin md:py-8 flex flex-col">
      <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
        <h1 className="font-display text-display text-on-surface tracking-tight flex items-center gap-3">
          <span className="text-xl">📇</span> IMPORT CONTACTS
        </h1>
        <Link
          href="/access"
          className="font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-md hover:bg-surface-container"
        >
          Cancel
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="csv"
            className="font-label-caps text-label-caps text-on-surface-variant"
          >
            PASTE CSV — REQUIRES `name` AND `phone` COLUMNS
          </label>
          <textarea
            id="csv"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder={SAMPLE}
            className="w-full min-h-[180px] border border-outline-variant bg-surface-container-lowest p-3 font-code-sm text-code-sm text-on-surface resize-y leading-relaxed placeholder:text-outline/40 rounded-md"
          />
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onPreview}
              className="font-label-caps text-label-caps px-4 py-2 border border-outline text-on-surface rounded-md hover:bg-surface-container"
            >
              PREVIEW
            </button>
            <button
              type="button"
              onClick={() => {
                setCsv(SAMPLE);
              }}
              className="font-label-caps text-label-caps px-4 py-2 text-on-surface-variant rounded-md hover:bg-surface-container"
            >
              USE SAMPLE
            </button>
          </div>
        </div>

        {parsed.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="font-label-caps text-label-caps text-on-surface-variant">
              {parsed.length} PARSED — PICK WHO TO ADD TO {me.toUpperCase()}'S
              ALLOWLIST
            </div>
            <div className="border border-outline-variant rounded-md overflow-hidden">
              {parsed.map((r) => (
                <label
                  key={r.id}
                  className="grid grid-cols-[auto_120px_1fr_160px] items-center gap-stack-sm px-stack-sm py-2 border-b border-outline-variant last:border-b-0 cursor-pointer hover:bg-surface-container-low"
                >
                  <input
                    type="checkbox"
                    checked={!!picked[r.id]}
                    onChange={(e) =>
                      setPicked((p) => ({ ...p, [r.id]: e.target.checked }))
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-data-value text-data-value">
                    {r.id}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    {r.display_name}
                  </span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">
                    {r.phone}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-1 mt-3">
              <label
                htmlFor="adminpw"
                className="font-label-caps text-label-caps text-on-surface-variant"
              >
                ADMIN PASSWORD (TEMP — PER-USER TOKENS COMING)
              </label>
              <input
                id="adminpw"
                type="password"
                value={adminPw}
                onChange={(e) => setAdminPw(e.target.value)}
                className="w-full border border-outline-variant bg-surface-container-lowest px-gutter py-2 font-data-value text-data-value text-on-surface rounded-md"
              />
            </div>

            <button
              type="button"
              onClick={onImport}
              disabled={
                submitting || toSubmit.length === 0 || !adminPw.trim()
              }
              className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-3 rounded-md hover:bg-on-primary-fixed-variant disabled:opacity-40 mt-2 flex items-center justify-center gap-2 self-start"
            >
              {submitting
                ? "IMPORTING…"
                : `IMPORT ${toSubmit.length} CONTACT${toSubmit.length === 1 ? "" : "S"}`}
            </button>
          </div>
        )}

        {error && (
          <div className="font-code-sm text-code-sm text-error border border-error px-stack-sm py-2 rounded-md bg-error-container">
            {error}
          </div>
        )}

        {result && (
          <div className="font-code-sm text-code-sm text-on-surface border border-primary px-stack-sm py-2 rounded-md bg-surface-container-low">
            ✓ Added {result.added} — skipped {result.skipped} (already on
            allowlist).
          </div>
        )}
      </div>
    </main>
  );
}
