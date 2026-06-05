"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api, formatTime } from "@/lib/api";
import { useIdentity } from "@/lib/identity";

export default function AccessPage() {
  const [me] = useIdentity();
  const [edges, setEdges] = useState<
    { owner: string; sender: string; added_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!me) return;
    setLoading(true);
    setFetchError(null);
    api
      .allowlist(me)
      .then((data) => setEdges(data))
      .catch((e) => setFetchError((e as Error).message))
      .finally(() => setLoading(false));
  }, [me]);

  if (!me) return null;

  return (
    <main className="flex-grow px-container-margin max-w-3xl mx-auto w-full pt-4 md:pt-8">
      <header className="mb-stack-md flex items-center justify-between border-b border-outline-variant pb-4">
        <h1 className="font-display text-display tracking-tight text-on-surface">
          🔑 ACCESS
        </h1>
        <Link
          href="/import"
          className="font-label-caps text-label-caps text-on-primary bg-primary px-3 py-1.5 rounded-md hover:bg-on-primary-fixed-variant"
        >
          + IMPORT CONTACTS
        </Link>
        <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant ml-3">
          allowlist
        </span>
      </header>

      <section className="mb-8">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
          ALLOWLIST — WHO CAN BEEP YOU
        </h2>

        {fetchError && (
          <div className="mb-stack-sm font-code-sm text-code-sm text-error border border-error px-stack-sm py-2 rounded-md bg-error-container">
            {fetchError}
          </div>
        )}

        {loading ? (
          <div className="font-code-sm text-code-sm text-on-surface-variant py-8 text-center">
            LOADING…
          </div>
        ) : edges.length === 0 ? (
          <div className="font-code-sm text-code-sm text-on-surface-variant py-4">
            NO ALLOWLIST ENTRIES
          </div>
        ) : (
          <div
            className="border border-outline-variant rounded-md overflow-hidden"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="grid grid-cols-[1fr_auto] gap-stack-sm px-stack-sm py-2 bg-surface-container border-b border-outline-variant">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                SENDER
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                SINCE
              </span>
            </div>
            {edges.map((edge, idx) => (
              <div
                key={edge.sender}
                className={`grid grid-cols-[1fr_auto] gap-stack-sm px-stack-sm py-2 border-b border-outline-variant last:border-b-0 font-data-value text-data-value text-on-surface ${
                  idx % 2 === 1 ? "bg-surface-container-low" : "bg-surface-container-lowest"
                }`}
              >
                <span className="uppercase font-semibold">{edge.sender}</span>
                <span className="text-on-surface-variant font-code-sm text-code-sm">
                  {formatTime(edge.added_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
