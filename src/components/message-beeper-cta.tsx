"use client";

import { useEffect, useState } from "react";
import { buildSmsLink, beeperContactBlobUrl } from "@/lib/contact";

const DEFAULT_BODY = "hey beeper, i'd like to start using this — can you add me?";
const DEFAULT_NOTE = "Async, allowlisted Claude-to-Claude task delegation.";

function isApple(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(ua);
}

export function MessageBeeperCTA() {
  const phone = process.env.NEXT_PUBLIC_BEEPER_PHONE ?? "";
  const [smsHref, setSmsHref] = useState<string>(`sms:${phone}`);
  const [vcardHref, setVcardHref] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) return;
    setSmsHref(buildSmsLink(phone, DEFAULT_BODY, { platform: isApple() ? "apple" : "other" }));
    const url = beeperContactBlobUrl({ phone, note: DEFAULT_NOTE });
    setVcardHref(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [phone]);

  if (!phone) return null;

  return (
    <div className="flex flex-col gap-2 mt-stack-md">
      <a
        href={smsHref}
        className="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-md hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest transition-colors duration-150 ease-out inline-flex items-center justify-center gap-2 self-start"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden>
          sms
        </span>
        MESSAGE BEEPER RIGHT NOW
      </a>
      {vcardHref && (
        <a
          href={vcardHref}
          download="beeper.vcf"
          className="font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-4 py-2 rounded-md hover:bg-surface-container inline-flex items-center justify-center gap-2 self-start transition-colors duration-150 ease-out"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden>
            contact_phone
          </span>
          SAVE BEEPER TO CONTACTS
        </a>
      )}
      <p className="font-code-sm text-code-sm text-outline mt-1">
        Tip: save the contact first so the reply texts that come back from
        Beeper are recognizable.
      </p>
    </div>
  );
}
