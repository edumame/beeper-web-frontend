"use client";

import { useState, useEffect } from "react";
import { api, type Beep } from "@/lib/api";
import { STATUS_DOT, STATUS_LABEL, STATUS_PILL } from "@/lib/beep-status";
import { useIdentity } from "@/lib/identity";
import { LoadMore } from "@/components/load-more";

export default function SentPage() {
  const [me] = useIdentity();
  const [beeps, setBeeps] = useState<Beep[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!me) return;
    setLoading(true);
    setFetchError(null);
    api
      .sent(me)
      .then((page) => {
        setBeeps(page.beeps);
        setNextOffset(page.next_offset);
      })
      .catch((e) => setFetchError((e as Error).message))
      .finally(() => setLoading(false));
  }, [me]);

  const loadMore = async () => {
    if (!me || nextOffset === null) return;
    setLoadingMore(true);
    setFetchError(null);
    try {
      const page = await api.sent(me, nextOffset);
      setBeeps((prev) => [...prev, ...page.beeps]);
      setNextOffset(page.next_offset);
    } catch (e: unknown) {
      setFetchError((e as Error).message);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!me) return null;

  return (
    <main className="flex-grow px-container-margin max-w-screen-md mx-auto w-full pt-4 md:pt-8">
      <div className="mb-stack-md flex items-baseline gap-2">
        <h1 className="font-display text-display tracking-tight text-on-surface">
          📟 SENT
        </h1>
        <span className="font-code-sm text-code-sm text-on-surface-variant ml-auto px-3 py-1 bg-surface-container border border-outline-variant rounded-full">
          {loading ? "…" : `${beeps.length}${nextOffset !== null ? "+" : ""} SENT`}
        </span>
      </div>

      {fetchError && (
        <div className="mb-stack-sm font-code-sm text-code-sm text-error border border-error px-stack-sm py-2 rounded-md bg-error-container">
          {fetchError}
        </div>
      )}

      {loading ? (
        <div className="font-code-sm text-code-sm text-on-surface-variant py-8 text-center">
          LOADING…
        </div>
      ) : beeps.length === 0 ? (
        <div className="font-code-sm text-code-sm text-on-surface-variant py-8 text-center">
          NO SENT BEEPS
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {beeps.map((beep) => (
            <article
              key={beep.id}
              className={`group bg-surface-container-lowest border border-outline-variant p-stack-sm flex flex-col md:flex-row md:items-start justify-between gap-stack-sm rounded-md hover:border-outline transition-all duration-150 ease-out ${
                beep.status === "open" ? "opacity-80" : ""
              }`}
              style={{ boxShadow: "var(--shadow-sm)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "var(--shadow-sm)";
              }}
            >
              <div className="flex flex-col gap-stack-xs flex-grow">
                <div className="font-code-sm text-code-sm text-on-surface-variant uppercase">
                  TO: {beep.to}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface max-w-prose">
                  &ldquo;{beep.task}&rdquo;
                </div>
                {beep.status === "closed" && beep.reply && (
                  <div className="font-code-sm text-code-sm text-on-surface-variant max-w-prose border-l-2 border-primary pl-2 mt-1 italic">
                    ↳ {beep.reply}
                  </div>
                )}
                {beep.status === "declined" && beep.decline_reason && (
                  <div className="font-code-sm text-code-sm text-error max-w-prose border-l-2 border-error pl-2 mt-1 italic">
                    ↳ {beep.decline_reason}
                  </div>
                )}
              </div>
              <div className="shrink-0 flex items-center">
                <div
                  className={`font-label-caps text-label-caps px-2.5 py-1 rounded-full flex items-center gap-1.5 ${STATUS_PILL[beep.status]}`}
                >
                  <span className={STATUS_DOT[beep.status]} aria-hidden />
                  {STATUS_LABEL[beep.status]}
                </div>
              </div>
            </article>
          ))}
          {nextOffset !== null && <LoadMore loading={loadingMore} onClick={loadMore} />}
        </div>
      )}
    </main>
  );
}
