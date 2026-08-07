"use client";

import { useState, useEffect, useCallback } from "react";
import { api, formatTime, type Invite } from "@/lib/api";
import { useIdentity } from "@/lib/identity";

function looksLikePhone(q: string): boolean {
  return /^\+?[\d\s().-]{7,}$/.test(q.trim());
}

const INVITE_STATUS_STYLES: Record<Invite["status"], string> = {
  pending: "text-secondary border-secondary",
  accepted: "text-primary border-primary",
  declined: "text-error border-error",
  canceled: "text-outline border-outline",
};

export default function AccessPage() {
  const [me] = useIdentity();
  const [edges, setEdges] = useState<
    { owner: string; sender: string; added_at: string }[]
  >([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Add / invite form state
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [invitePhone, setInvitePhone] = useState<string | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [canceling, setCanceling] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!me) return;
    setFetchError(null);
    Promise.all([api.allowlist(me), api.invites()])
      .then(([edgeData, inviteData]) => {
        setEdges(edgeData);
        setInvites(inviteData);
      })
      .catch((e) => setFetchError((e as Error).message))
      .finally(() => setLoading(false));
  }, [me]);

  useEffect(() => {
    if (!me) return;
    setLoading(true);
    refresh();
  }, [me, refresh]);

  if (!me) return null;

  async function handleAdd() {
    const q = query.trim();
    if (!q || busy) return;
    setBusy(true);
    setActionError(null);
    setNotice(null);
    setInvitePhone(null);
    try {
      const user = await api.lookupUser(q);
      await api.allowlistAdd(user.id);
      setQuery("");
      setNotice(`${user.display_name} (${user.id}) can now beep you.`);
      refresh();
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 404 && looksLikePhone(q)) {
        // Not on Beeper yet — offer to invite the phone number.
        setInvitePhone(q);
        setInviteName("");
      } else if (err.status === 404) {
        setActionError(
          `No user with that handle. If they're not on Beeper yet, enter their phone number (+1…) to invite them.`,
        );
      } else {
        setActionError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleInvite() {
    if (!invitePhone || !inviteName.trim() || busy) return;
    setBusy(true);
    setActionError(null);
    try {
      const r = await api.sendInvite(invitePhone, inviteName.trim());
      setInvitePhone(null);
      setQuery("");
      setNotice(
        r.recipient_notified
          ? `Invite sent — once ${inviteName.trim()} replies YES, you'll be connected.`
          : `Invite recorded, but the text failed to send. Try resending in a bit.`,
      );
      refresh();
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(sender: string) {
    setRemoving(sender);
    setActionError(null);
    try {
      await api.allowlistRemove(sender);
      setNotice(`${sender} can no longer beep you.`);
      refresh();
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setRemoving(null);
    }
  }

  async function handleCancelInvite(id: string) {
    setCanceling(id);
    setActionError(null);
    try {
      await api.cancelInvite(id);
      refresh();
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setCanceling(null);
    }
  }

  const visibleInvites = invites.filter((i) => i.status !== "canceled");

  return (
    <main className="flex-grow px-container-margin max-w-3xl mx-auto w-full pt-4 md:pt-8">
      <header className="mb-stack-md flex items-center justify-between border-b border-outline-variant pb-4">
        <h1 className="font-display text-display tracking-tight text-on-surface">
          🔑 ACCESS
        </h1>
        <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          allowlist
        </span>
      </header>

      {fetchError && (
        <div className="mb-stack-sm font-code-sm text-code-sm text-error border border-error px-stack-sm py-2 rounded-md bg-error-container">
          {fetchError}
        </div>
      )}

      {notice && (
        <div className="mb-stack-sm flex items-start justify-between gap-2 font-code-sm text-code-sm text-on-surface-variant border border-outline-variant px-stack-sm py-2 rounded-md bg-surface-container">
          <span>{notice}</span>
          <button
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface"
          >
            ✕
          </button>
        </div>
      )}

      <section className="mb-8">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
          GRANT ACCESS — LET SOMEONE BEEP YOU
        </h2>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Handle (jeffrey) or phone (+14155551234)…"
            className="brutalist-input flex-grow border border-outline bg-surface-container-lowest p-2 font-code-sm text-code-sm text-on-surface rounded-md"
          />
          <button
            onClick={handleAdd}
            disabled={!query.trim() || busy}
            className="font-label-caps text-label-caps px-3 py-1.5 bg-primary text-on-primary rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            {busy && !invitePhone ? "ADDING…" : "ADD"}
          </button>
        </div>

        {actionError && (
          <div className="mt-stack-xs font-code-sm text-code-sm text-error">
            {actionError}
          </div>
        )}

        {invitePhone && (
          <div className="mt-stack-sm border border-outline-variant bg-surface-container-low p-stack-sm flex flex-col gap-stack-xs rounded-md">
            <span className="font-label-caps text-label-caps text-secondary">
              NOT ON BEEPER YET — INVITE {invitePhone}
            </span>
            <input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              placeholder="Their first name…"
              className="brutalist-input w-full border border-outline bg-surface-container-lowest p-2 font-code-sm text-code-sm text-on-surface rounded-md"
            />
            <span className="font-code-sm text-code-sm text-on-surface-variant">
              They&apos;ll get a text from Beeper and must reply YES before
              they&apos;re added — nothing happens without their OK.
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleInvite}
                disabled={!inviteName.trim() || busy}
                className="font-label-caps text-label-caps px-3 py-1.5 bg-primary text-on-primary rounded-md disabled:opacity-40 hover:bg-on-primary-fixed-variant transition-colors duration-150 ease-out"
              >
                {busy ? "SENDING…" : "SEND INVITE"}
              </button>
              <button
                onClick={() => setInvitePhone(null)}
                className="font-label-caps text-label-caps px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-md hover:bg-surface-container transition-colors duration-150 ease-out"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
          ALLOWLIST — WHO CAN BEEP YOU
        </h2>

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
            <div className="grid grid-cols-[1fr_auto_auto] gap-stack-sm px-stack-sm py-2 bg-surface-container border-b border-outline-variant">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                SENDER
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                SINCE
              </span>
              <span aria-hidden className="w-16" />
            </div>
            {edges.map((edge, idx) => (
              <div
                key={edge.sender}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-stack-sm px-stack-sm py-2 border-b border-outline-variant last:border-b-0 font-data-value text-data-value text-on-surface ${
                  idx % 2 === 1 ? "bg-surface-container-low" : "bg-surface-container-lowest"
                }`}
              >
                <span className="uppercase font-semibold">{edge.sender}</span>
                <span className="text-on-surface-variant font-code-sm text-code-sm">
                  {formatTime(edge.added_at)}
                </span>
                <button
                  onClick={() => handleRemove(edge.sender)}
                  disabled={removing === edge.sender}
                  className="font-label-caps text-label-caps px-2 py-1 w-16 border border-outline-variant text-on-surface-variant rounded-md disabled:opacity-40 hover:bg-surface-container hover:text-error transition-colors duration-150 ease-out"
                >
                  {removing === edge.sender ? "…" : "REMOVE"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {visibleInvites.length > 0 && (
        <section className="mb-8">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">
            INVITES — PEOPLE YOU&apos;VE ASKED TO JOIN
          </h2>
          <div
            className="border border-outline-variant rounded-md overflow-hidden"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            {visibleInvites.map((invite, idx) => (
              <div
                key={invite.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-stack-sm px-stack-sm py-2 border-b border-outline-variant last:border-b-0 font-data-value text-data-value text-on-surface ${
                  idx % 2 === 1 ? "bg-surface-container-low" : "bg-surface-container-lowest"
                }`}
              >
                <span>
                  <span className="font-semibold">{invite.first_name}</span>{" "}
                  <span className="text-on-surface-variant font-code-sm text-code-sm">
                    {invite.phone}
                  </span>
                </span>
                <span
                  className={`font-label-caps text-label-caps px-2 py-0.5 border rounded-full ${INVITE_STATUS_STYLES[invite.status]}`}
                >
                  {invite.status.toUpperCase()}
                </span>
                <span className="text-on-surface-variant font-code-sm text-code-sm">
                  {formatTime(invite.created_at)}
                </span>
                {invite.status === "pending" ? (
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    disabled={canceling === invite.id}
                    className="font-label-caps text-label-caps px-2 py-1 w-16 border border-outline-variant text-on-surface-variant rounded-md disabled:opacity-40 hover:bg-surface-container hover:text-error transition-colors duration-150 ease-out"
                  >
                    {canceling === invite.id ? "…" : "CANCEL"}
                  </button>
                ) : (
                  <span aria-hidden className="w-16" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
