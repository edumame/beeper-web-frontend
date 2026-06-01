"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { api, type Beep, type Urgency } from "@/lib/api";
import { formatTime } from "@/lib/api";
import { useIdentity } from "@/lib/identity";

const URGENCY_STYLES: Record<Urgency, string> = {
  high: "bg-error-container text-on-error-container border-error",
  normal: "bg-surface-variant text-on-surface-variant border-outline",
  low: "bg-surface-container-low text-on-surface-variant border-outline-variant",
};

export default function InboxPage() {
  const [me] = useIdentity();
  const [beeps, setBeeps] = useState<Beep[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [action, setAction] = useState<"reply" | "decline" | null>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchBeeps = useCallback(async () => {
    if (!me) return;
    setLoading(true);
    setFetchError(null);
    try {
      const data = await api.inbox(me);
      setBeeps(data);
    } catch (e: unknown) {
      setFetchError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [me]);

  useEffect(() => {
    fetchBeeps();
  }, [fetchBeeps]);

  const openAction = (id: string, type: "reply" | "decline") => {
    setActingOn(id);
    setAction(type);
    setText("");
    setSubmitError(null);
  };

  const cancelAction = () => {
    setActingOn(null);
    setAction(null);
    setText("");
    setSubmitError(null);
  };

  const submitAction = async (beep: Beep) => {
    if (!me || !text.trim() || !action) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (action === "reply") {
        await api.reply(beep.id, me, text);
      } else {
        await api.decline(beep.id, me, text);
      }
      cancelAction();
      await fetchBeeps();
    } catch (e: unknown) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!me) return null;

  return (
    <main className="flex-grow px-container-margin md:px-8 max-w-5xl mx-auto w-full pt-4 md:pt-8">
      <header className="mb-stack-md flex items-center justify-between">
        <h1 className="font-display text-display uppercase tracking-tight text-primary">
          📟 INBOX
        </h1>
        <span className="font-code-sm text-code-sm text-outline px-2 py-1 bg-surface-container-low border border-outline-variant">
          {loading ? "…" : `${beeps.length} TASKS`}
        </span>
      </header>

      {fetchError && (
        <div className="mb-stack-sm font-code-sm text-code-sm text-error border border-error px-stack-sm py-2">
          {fetchError}
        </div>
      )}

      {loading ? (
        <div className="font-code-sm text-code-sm text-on-surface-variant py-8 text-center">
          LOADING…
        </div>
      ) : beeps.length === 0 ? (
        <div className="font-code-sm text-code-sm text-on-surface-variant py-8 text-center">
          NO OPEN BEEPS
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter md:gap-stack-md">
          {beeps.map((beep) => (
            <div key={beep.id} className="flex flex-col gap-0">
              <article className="border border-outline-variant bg-surface-container-lowest p-stack-sm flex flex-col gap-stack-xs hover:bg-surface-bright">
                <div className="flex justify-between items-start w-full">
                  <div className="font-code-md text-code-md font-bold text-primary uppercase">
                    FROM: {beep.from}
                  </div>
                  <div className="font-code-sm text-code-sm text-on-surface-variant">
                    {formatTime(beep.created_at)}
                  </div>
                </div>
                <div className="bg-surface-container-low border border-outline-variant p-stack-sm font-code-sm text-code-sm text-on-surface line-clamp-2 min-h-10 w-full">
                  {beep.task}
                </div>
                <div className="mt-unit flex items-center justify-between">
                  <div
                    className={`font-label-caps text-label-caps px-2 py-0.5 border-l-2 ${URGENCY_STYLES[beep.urgency]}`}
                  >
                    {beep.urgency.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    {beep.request_transcript && (
                      <span className="font-label-caps text-label-caps text-on-surface-variant inline-flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          aria-hidden
                        >
                          description
                        </span>
                        TRANSCRIPT
                      </span>
                    )}
                    <span className="font-code-sm text-code-sm text-outline">
                      {beep.id}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-unit">
                  <button
                    onClick={() => openAction(beep.id, "reply")}
                    className="font-label-caps text-label-caps px-3 py-1 border border-primary text-primary hover:bg-primary hover:text-on-primary"
                  >
                    REPLY
                  </button>
                  <button
                    onClick={() => openAction(beep.id, "decline")}
                    className="font-label-caps text-label-caps px-3 py-1 border border-error text-error hover:bg-error-container"
                  >
                    DECLINE
                  </button>
                </div>
              </article>

              {actingOn === beep.id && action && (
                <div className="border border-t-0 border-outline-variant bg-surface-container-low p-stack-sm flex flex-col gap-stack-xs">
                  <span className="font-label-caps text-label-caps text-secondary">
                    {action === "reply" ? "REPLY" : "DECLINE REASON"}
                  </span>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="brutalist-input w-full border border-outline bg-surface-container-lowest p-2 font-code-sm text-code-sm text-on-surface resize-none leading-relaxed min-h-[80px]"
                    placeholder={action === "reply" ? "Enter your reply…" : "Enter reason for declining…"}
                  />
                  {submitError && (
                    <div className="font-code-sm text-code-sm text-error">{submitError}</div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => submitAction(beep)}
                      disabled={!text.trim() || submitting}
                      className="font-label-caps text-label-caps px-3 py-1 bg-primary text-on-primary disabled:opacity-40"
                    >
                      {submitting ? "SENDING…" : "SEND"}
                    </button>
                    <button
                      onClick={cancelAction}
                      className="font-label-caps text-label-caps px-3 py-1 border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        href="/compose"
        aria-label="New beep"
        className="fixed bottom-16 md:bottom-8 right-container-margin w-12 h-12 bg-primary text-on-primary flex items-center justify-center border border-primary hover:bg-inverse-surface z-40"
      >
        <span className="material-symbols-outlined text-2xl" aria-hidden>
          add
        </span>
      </Link>
    </main>
  );
}
