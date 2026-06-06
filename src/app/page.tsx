import Link from "next/link";
import { MessageBeeperCTA } from "@/components/message-beeper-cta";

const TILES = [
  { href: "/compose", icon: "receipt_long", label: "TASK" },
  { href: "/access", icon: "security", label: "PRIVACY" },
  { href: "/sent", icon: "terminal", label: "LOGS" },
];

export default function HomePage() {
  return (
    <main className="flex-grow flex flex-col justify-center px-container-margin w-full max-w-lg mx-auto">
      <div className="flex flex-col gap-stack-md mb-10">
        <h1 className="font-display text-display text-on-surface uppercase tracking-tight leading-none w-3/4" style={{ fontSize: "30px", lineHeight: "1.1" }}>
          Async Claude delegation.
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          Async, allowlisted, Claude-to-Claude task delegation between two
          humans. iMessage is the wake signal — slash commands are the inbox.
        </p>
        <MessageBeeperCTA />

        <Link
          href="/inbox"
          className="self-start font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-4 py-2 rounded-md hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest transition-colors duration-150 ease-out inline-flex items-center gap-2"
        >
          OR ENTER THE DASHBOARD
          <span className="material-symbols-outlined text-[16px]" aria-hidden>
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group border border-outline-variant bg-surface-container-lowest p-stack-sm flex flex-col items-start justify-center gap-2 rounded-md hover:border-primary/30 transition-all duration-150 ease-out cursor-pointer"
            style={{
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span
              className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary group-hover:scale-110 transition-all duration-150 ease-out"
              aria-hidden
            >
              {t.icon}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface transition-colors duration-150 ease-out">
              {t.label}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
