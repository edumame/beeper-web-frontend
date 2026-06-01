"use client";

import { useState, useEffect } from "react";
import { api, formatTime } from "@/lib/api";
import { useIdentity } from "@/lib/identity";

export default function AccessPage() {
  const [me] = useIdentity();
  const [edges, setEdges] = useState<{ owner: string; sender: string; added_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!me) return;
    setLoading(true);
    setFetchError(null);
    api.allowlist(me)
      .then(data => setEdges(data))
      .catch(e => setFetchError((e as Error).message))
      .finally(() => setLoading(false));
  }, [me]);

  if (!me) return null;

  return (
    <main className="flex-grow px-container-margin max-w-3xl mx-auto w-full pt-4 md:pt-8">
      <header className="mb-stack-md flex items-center justify-between border-b border-outline-variant pb-4">
        <h1 className="font-display text-display tracking-tight text-primary">
          🔑 ACCESS
        </h1>
        <span className="font-code-sm text-code-sm text-on-surface-variant">
          allowlist
        </span>
      </header>

      <section className="mb-8">
        <h2 className="font-label-caps text-label-caps text-secondary mb-stack-sm">
          ALLOWLIST — WHO CAN BEEP YOU
        </h2>

        {fetchError && (
          <div className="mb-stack-sm font-code-sm text-code-sm text-error border border-error px-stack-sm py-2">
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
          <div className="border border-outline-variant">
            <div className="grid grid-cols-[1fr_auto] gap-stack-sm px-stack-sm py-2 bg-surface-container-low border-b border-outline-variant">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                SENDER
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                SINCE
              </span>
            </div>
            {edges.map((edge) => (
              <div
                key={edge.sender}
                className="grid grid-cols-[1fr_auto] gap-stack-sm px-stack-sm py-2 border-b border-outline-variant last:border-b-0 font-data-value text-data-value text-on-surface"
              >
                <span className="uppercase">{edge.sender}</span>
                <span className="text-on-surface-variant">{formatTime(edge.added_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
